import { StartTypingComposer, StopTypingComposer } from '@aura/protocol';

export interface PolarisTypingPacketSender { send(payload: Uint8Array): Promise<void>; }

/** Maps both semantic typing transitions to their complete Polaris packets. */
export class PolarisTypingAdapter {
  public constructor(private readonly sender: PolarisTypingPacketSender) {}
  public start(): Promise<void> { return this.sender.send(new StartTypingComposer().encode()); }
  public stop(): Promise<void> { return this.sender.send(new StopTypingComposer().encode()); }
}
