import {
  RoomEnterComposer,
  RoomEntryDataComposer,
  RoomOpenParser,
  type PacketFrame,
} from '@aura/protocol';

export interface PolarisPacketSender {
  send(payload: Uint8Array): Promise<void>;
}

export interface PolarisRoomEntryInput {
  readonly roomId: number;
  readonly password?: string;
}

/**
 * Completes Polaris room entry as a two-stage exchange:
 * RoomEnter (2312) -> RoomOpen (758) -> RoomModel request (2300).
 */
export class PolarisRoomEntryAdapter {
  private readonly roomOpen = new RoomOpenParser();
  private awaitingRoomOpen = false;

  public constructor(private readonly sender: PolarisPacketSender) {}

  public async enter(input: PolarisRoomEntryInput): Promise<void> {
    if (this.awaitingRoomOpen) throw new Error('A room entry is already pending');

    await this.sender.send(new RoomEnterComposer(input.roomId, input.password ?? '').encode());
    this.awaitingRoomOpen = true;
  }

  /** Returns true only when a pending RoomOpen was consumed. */
  public async handleInbound(frame: PacketFrame): Promise<boolean> {
    if (!this.awaitingRoomOpen || frame.header !== this.roomOpen.definition.header) return false;

    this.roomOpen.parse(frame);
    await this.sender.send(new RoomEntryDataComposer().encode());
    this.awaitingRoomOpen = false;
    return true;
  }
}
