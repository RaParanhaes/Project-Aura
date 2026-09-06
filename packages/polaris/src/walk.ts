import { RoomUnitWalkComposer } from '@aura/protocol';

export interface PolarisWalkPacketSender { send(payload: Uint8Array): Promise<void>; }

export class PolarisWalkAdapter {
  public constructor(private readonly sender: PolarisWalkPacketSender) {}
  public walkTo(x: number, y: number): Promise<void> {
    return this.sender.send(new RoomUnitWalkComposer(x, y).encode());
  }
}
