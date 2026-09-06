export {
  RealSession,
  SessionError
} from './session/real-session.js';
export type {
  AuthProvider,
  SessionCloseReason,
  SessionState,
  SessionTransport,
  Unsubscribe
} from './session/real-session.js';
export { HeartbeatController } from './session/heartbeat.js';
export { WebSocketSessionTransport } from './session/websocket-transport.js';
export type { HeartbeatOptions, TimerApi } from './session/heartbeat.js';
export type { WebSocketFactory, WebSocketLike } from './session/websocket-transport.js';
export { CredentialAuthProvider } from './session/authentication.js';
export type { AuthHandshake, CredentialProvider } from './session/authentication.js';
export { firstLogin } from './session/first-login.js';
export type { FirstLoginResult } from './session/first-login.js';
export { SessionManager } from './session/session-manager.js';
export { EventNormalizer } from './world/event-normalizer.js';
export type { EventDecoder, InboundPacket } from './world/event-normalizer.js';
export { RoomHydrator } from './world/room-hydrator.js';
export type { RoomHydrationState } from './world/room-hydrator.js';
export { WorldState } from './world/world-state.js';
export { CapabilityRegistry } from './capabilities/capability-registry.js';
export type { CapabilityContext, CapabilityDefinition, CapabilityResult } from './capabilities/capability-registry.js';
export { registerEnterRoom } from './capabilities/enter-room.js';
export type { EnterRoomCommand, EnterRoomInput } from './capabilities/enter-room.js';
