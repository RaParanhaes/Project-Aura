import type { CapabilityContext, CapabilityRegistry } from './capability-registry.js';

export interface WhisperInput { readonly recipient: string; readonly text: string; readonly bubble?: number; readonly color?: string; }
export type WhisperCommand = (actionId: string, input: WhisperInput, context: CapabilityContext) => Promise<void>;

const isWhisperInput = (value: unknown): value is WhisperInput => {
  if (!value || typeof value !== 'object') return false;
  const input = value as WhisperInput;
  return typeof input.recipient === 'string' && input.recipient.length > 0 && !/\s/.test(input.recipient)
    && typeof input.text === 'string' && input.text.length > 0 && input.text.length <= 100
    && (input.bubble === undefined || Number.isInteger(input.bubble))
    && (input.color === undefined || typeof input.color === 'string');
};

export function registerWhisper(registry: CapabilityRegistry, command: WhisperCommand): void {
  registry.register<WhisperInput>({ name: 'WHISPER', validate: isWhisperInput, precondition: (context) => context.world.roomId === undefined ? 'room observation required' : undefined, execute: (actionId, context, input) => command(actionId, input, context) });
}
