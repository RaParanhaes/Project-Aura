import {
  RoomEnterComposer,
  RoomEntryDataComposer,
  RoomUnitActionComposer,
  RoomUnitDanceComposer,
  RoomUnitOrientComposer,
  RoomUnitPostureComposer,
  RoomUnitSignComposer,
  RoomUnitWalkComposer,
  SayComposer,
  ShoutComposer,
  StartTypingComposer,
  StopTypingComposer,
  WhisperComposer,
  parseRoomUserAction,
  parseRoomUserDance,
  parseUnitStatus,
  CatalogPageRequestComposer,
  InventoryBadgesRequestComposer,
  InventoryItemsRequestComposer,
  UserProfileRequestComposer,
  type PacketFrame,
  type UnitStatus,
} from '@aura/protocol';
import {
  registerDance,
  registerOrient,
  registerPosture,
  registerSay,
  registerShout,
  registerSocialGesture,
  registerStartTyping,
  registerStopTyping,
  registerWalkTo,
  registerWhisper,
  type CapabilityRegistry,
} from '@aura/runtime';
import type { SessionTransport } from '@aura/runtime';

export type PolarisActionConfirmation =
  | { readonly kind: 'action'; readonly roomUnitId: number; readonly action: number }
  | { readonly kind: 'dance'; readonly roomUnitId: number; readonly danceType: number }
  | { readonly kind: 'status'; readonly statuses: readonly UnitStatus[] }
  | { readonly kind: 'read'; readonly read: 'profile' | 'inventory_items' | 'inventory_badges' | 'catalog_page'; readonly payload: Uint8Array };

/**
 * The only place where semantic room commands are translated to Polaris bytes.
 * Runtime capabilities stay protocol agnostic; this adapter owns transport and
 * exposes decoded server confirmations for reconciliation.
 */
export class PolarisActionAdapter {
  public constructor(
    private readonly transport: Pick<SessionTransport, 'send'>,
    private readonly onConfirmation: (confirmation: PolarisActionConfirmation) => void = () => {},
  ) {}

  enterRoom(roomId: number, password = '', spawn?: { readonly x: number; readonly y: number }): Promise<void> {
    const composer = spawn === undefined
      ? new RoomEnterComposer(roomId, password)
      : new RoomEnterComposer(roomId, password, spawn.x, spawn.y);
    return this.send(composer.encode());
  }

  completeRoomEntry(): Promise<void> { return this.send(new RoomEntryDataComposer().encode()); }
  walk(x: number, y: number): Promise<void> { return this.send(new RoomUnitWalkComposer(x, y).encode()); }
  say(text: string, bubble = 0, color = ''): Promise<void> { return this.send(new SayComposer(text, bubble, color).encode()); }
  whisper(recipient: string, text: string, bubble = 0, color = ''): Promise<void> { return this.send(new WhisperComposer(recipient, text, bubble, color).encode()); }
  shout(text: string, bubble = 0, color = ''): Promise<void> { return this.send(new ShoutComposer(text, bubble, color).encode()); }
  startTyping(): Promise<void> { return this.send(new StartTypingComposer().encode()); }
  stopTyping(): Promise<void> { return this.send(new StopTypingComposer().encode()); }

  gesture(gesture: 'wave' | 'kiss' | 'raise_sign' | 'lower_sign', signId?: number): Promise<void> {
    if (gesture === 'wave') return this.send(new RoomUnitActionComposer(1).encode());
    if (gesture === 'kiss') return this.send(new RoomUnitActionComposer(2).encode());
    if (gesture === 'raise_sign') return this.send(new RoomUnitSignComposer(signId ?? 0).encode());
    return this.send(new RoomUnitSignComposer(0).encode());
  }

  dance(danceType: number): Promise<void> { return this.send(new RoomUnitDanceComposer(danceType).encode()); }
  posture(posture: 'sit' | 'stand'): Promise<void> { return this.send(new RoomUnitPostureComposer(posture === 'sit' ? 1 : 0).encode()); }
  orient(x: number, y: number): Promise<void> { return this.send(new RoomUnitOrientComposer(x, y).encode()); }
  inspectUser(userId: number): Promise<void> { return this.send(new UserProfileRequestComposer(userId).encode()); }
  readInventoryItems(): Promise<void> { return this.send(new InventoryItemsRequestComposer().encode()); }
  readInventoryBadges(): Promise<void> { return this.send(new InventoryBadgesRequestComposer().encode()); }
  browseCatalog(pageId: number, offerId = 0, mode = 'normal'): Promise<void> { return this.send(new CatalogPageRequestComposer(pageId, offerId, mode).encode()); }

  /** Register the already validated semantic capabilities against this live transport. */
  registerCapabilities(registry: CapabilityRegistry): void {
    registerSocialGesture(registry, async (_id, input) => this.gesture(input.gesture, input.signId));
    registerDance(registry, async (_id, input) => this.dance(input.danceType));
    registerPosture(registry, async (_id, input) => this.posture(input.posture));
    registerOrient(registry, async (_id, input) => this.orient(input.x, input.y));
    registerWalkTo(registry, async (_id, input) => this.walk(input.x, input.y));
    registerSay(registry, async (_id, input) => this.say(input.text, input.bubble, input.color));
    registerWhisper(registry, async (_id, input) => this.whisper(input.recipient, input.text, input.bubble, input.color));
    registerShout(registry, async (_id, input) => this.shout(input.text, input.bubble, input.color));
    registerStartTyping(registry, async () => this.startTyping());
    registerStopTyping(registry, async () => this.stopTyping());
  }

  /** Feed decoded frames from the session stream into the confirmation path. */
  handle(frame: PacketFrame): PolarisActionConfirmation | undefined {
    if (frame.header === 1631) {
      const confirmation = { kind: 'action' as const, ...parseRoomUserAction(frame) };
      this.onConfirmation(confirmation);
      return confirmation;
    }
    if (frame.header === 2233) {
      const confirmation = { kind: 'dance' as const, ...parseRoomUserDance(frame) };
      this.onConfirmation(confirmation);
      return confirmation;
    }
    if (frame.header === 1640) {
      const confirmation = { kind: 'status' as const, statuses: parseUnitStatus(frame) };
      this.onConfirmation(confirmation);
      return confirmation;
    }
    const reads = [
      ['profile', 3898], ['inventory_items', 994], ['inventory_badges', 717], ['catalog_page', 804],
    ] as const;
    const read = reads.find(([, header]) => header === frame.header);
    if (read) {
      const confirmation = { kind: 'read' as const, read: read[0], payload: frame.body.slice() };
      this.onConfirmation(confirmation);
      return confirmation;
    }
    return undefined;
  }

  private send(payload: Uint8Array): Promise<void> { return this.transport.send(payload); }
}
