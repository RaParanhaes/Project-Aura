import { SayComposer, WhisperComposer } from '@aura/protocol';

export interface PolarisChatPacketSender { send(payload: Uint8Array): Promise<void>; }

export class PolarisChatAdapter {
  public constructor(private readonly sender: PolarisChatPacketSender) {}
  public say(text: string, bubble = 0, color = ''): Promise<void> { return this.sender.send(new SayComposer(text, bubble, color).encode()); }
  public whisper(recipient: string, text: string, bubble = 0, color = ''): Promise<void> { return this.sender.send(new WhisperComposer(recipient, text, bubble, color).encode()); }
}
