import type { CapabilityContext, CapabilityRegistry } from './capability-registry.js';
export interface SayInput { readonly text: string; readonly bubble?: number; readonly color?: string; }
export type SayCommand = (actionId: string, input: SayInput, context: CapabilityContext) => Promise<void>;
const isSayInput = (value: unknown): value is SayInput => {
  if (!value || typeof value !== 'object' || typeof (value as { text?: unknown }).text !== 'string') return false;
  const input = value as SayInput;
  return input.text.length > 0 && input.text.length <= 100 && (input.bubble === undefined || Number.isInteger(input.bubble)) && (input.color === undefined || typeof input.color === 'string');
};
export function registerSay(registry: CapabilityRegistry, command: SayCommand): void {
  registry.register<SayInput>({ name: 'SAY', validate: isSayInput, precondition: (context) => context.world.roomId === undefined ? 'room observation required' : undefined, execute: (actionId, context, input) => command(actionId, input, context) });
}
