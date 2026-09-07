import {
  AuthenticatedParser,
  ClientHelloComposer,
  EnableEffectComposer,
  InfoRetrieveComposer,
  PacketStreamCodec,
  PongComposer,
  SSOTicketComposer,
  UniqueIDComposer,
  type PacketFrame
} from '@aura/protocol';
import { parseRoomUserEffect } from '@aura/protocol';
import { OriginWebSocket } from './origin-websocket.js';
import { FileCheckpointStore } from '@aura/persistence';
import {
  CredentialAuthProvider,
  RealSession,
  WebSocketSessionTransport,
  type AuthHandshake,
  type CredentialProvider,
  type WebSocketLike,
  SessionRecoveryTokenStore
} from '@aura/runtime';
import { CapabilityRegistry } from '@aura/runtime';
import { PolarisActionAdapter } from './polaris-action-adapter.js';

const env = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};
const argv = (globalThis as unknown as { process?: { argv?: string[] } }).process?.argv ?? [];
const runningAsExecutable = argv[1]?.endsWith('/apps/aura-core/src/main.ts') === true || argv[1]?.endsWith('/src/main.ts') === true;
const wsUrl = env.AURA_WS_URL ?? 'ws://127.0.0.1:2096';
const statePath = env.AURA_STATE_PATH ?? '/tmp/aura-core-state.json';
const ticket = env.AURA_SSO_TICKET;
if (!ticket && runningAsExecutable) throw new Error('AURA_SSO_TICKET is required and must be provided at runtime');

const WebSocketCtor = (globalThis as unknown as { WebSocket?: new (url: string) => WebSocketLike }).WebSocket;
if (!WebSocketCtor && runningAsExecutable && !wsUrl.startsWith('ws://')) throw new Error('This Node runtime does not expose WebSocket');
const encodeUtf8 = (value: string): Uint8Array => Uint8Array.from(unescape(encodeURIComponent(value)), character => character.charCodeAt(0));
const decodeUtf8 = (value: Uint8Array): string => decodeURIComponent(escape(String.fromCharCode(...value)));

class EnvironmentCredentials implements CredentialProvider {
  async getCredentials(): Promise<Uint8Array> { return encodeUtf8(ticket ?? ''); }
}

class PolarisHandshake implements AuthHandshake {
  private readonly codec = new PacketStreamCodec();
  private authenticated: (() => void) | undefined;
  private failed: ((error: unknown) => void) | undefined;
  private readonly parser = new AuthenticatedParser();
  private readonly recovery = new SessionRecoveryTokenStore();
  private transport: import('@aura/runtime').SessionTransport | undefined;

  async sendCredentials(transport: import('@aura/runtime').SessionTransport, credentials: Uint8Array): Promise<void> {
    this.transport = transport;
    transport.onMessage(payload => this.handle(payload));
    await transport.send(new ClientHelloComposer().encode());
    await transport.send(new UniqueIDComposer('aura-core-machine', 'aura-core', 'AURA/0.1').encode());
    await transport.send(new SSOTicketComposer(decodeUtf8(credentials), Math.floor(Date.now() / 1000), this.recovery.value).encode());
  }

  waitForAuthenticated(): Promise<void> {
    return new Promise((resolve, reject) => { this.authenticated = resolve; this.failed = reject; });
  }

  private handle(payload: Uint8Array): void {
    for (const frame of this.codec.push(payload)) {
      if (frame.header === 3928) void this.transport?.send(new PongComposer().encode());
      if (frame.header === 2491) void this.transport?.send(new InfoRetrieveComposer().encode());
      if (frame.header === 1167 && parseRoomUserEffect(frame).effectId !== 0) void this.transport?.send(new EnableEffectComposer(0).encode());
      if (frame.header === this.parser.definition.header) {
        try { this.recovery.set(this.parser.parse(frame).recoveryToken); this.authenticated?.(); } catch (error) { this.failed?.(error); }
      }
    }
  }
}

if (ticket) {
const transport = new WebSocketSessionTransport(wsUrl, url => wsUrl.includes('127.0.0.1:8080') ? new OriginWebSocket(url) as unknown as WebSocketLike : new WebSocketCtor!(url));
const inboundCodec = new PacketStreamCodec();
const actionAdapter = new PolarisActionAdapter(transport);
const capabilities = new CapabilityRegistry({ rateLimits: {
  SOCIAL_GESTURE: { cooldownMs: 750, maxPerWindow: 6, windowMs: 10_000 },
  DANCE: { cooldownMs: 500, maxPerWindow: 10, windowMs: 10_000 },
  POSTURE: { cooldownMs: 500, maxPerWindow: 10, windowMs: 10_000 },
  ORIENT: { cooldownMs: 150, maxPerWindow: 20, windowMs: 10_000 },
  INSPECT_USER: { cooldownMs: 500, maxPerWindow: 20, windowMs: 10_000 },
  BROWSE_SHOP: { cooldownMs: 500, maxPerWindow: 20, windowMs: 10_000 },
} });
actionAdapter.registerCapabilities(capabilities);
const session = new RealSession(
  env.AURA_AGENT_ID ?? 'aura-core-agent',
  transport,
  new CredentialAuthProvider(new EnvironmentCredentials(), new PolarisHandshake()),
  payload => { for (const frame of inboundCodec.push(payload)) actionAdapter.handle(frame); }
);

await session.start();
const checkpointStore = new FileCheckpointStore(statePath);
const restored = await checkpointStore.latest(session.agentId);
if (restored) (globalThis as unknown as { console: { log: (message: string) => void } }).console.log(`AURA checkpoint restored sequence=${restored.sequence}`);
const nextSequence = (restored?.sequence ?? 0) + 1;
const now = Date.now();
await checkpointStore.save({ schemaVersion: 1, agentId: session.agentId, sequence: nextSequence, reason: 'session authenticated', createdAt: now, state: { schemaVersion: 1, agentId: session.agentId, identity: { name: session.agentId }, objective: null, homeRoomId: null, lastKnownRoomId: null, updatedAt: now } });
(globalThis as unknown as { console: { log: (message: string) => void } }).console.log(`AURA checkpoint saved sequence=${nextSequence}`);
(globalThis as unknown as { console: { log: (message: string) => void } }).console.log(`AURA online (${session.agentId})`);
const shutdown = async () => { await session.close({ code: 1000, reason: 'shutdown' }); session.dispose(); };
(globalThis as unknown as { process?: { on?: (signal: string, callback: () => void) => void } }).process?.on?.('SIGINT', () => void shutdown());
(globalThis as unknown as { process?: { on?: (signal: string, callback: () => void) => void } }).process?.on?.('SIGTERM', () => void shutdown());
}
