import type { CapabilityContext, CapabilityRegistry } from './capability-registry.js';

export interface ShoutInput { readonly text: string; readonly bubble?: number; readonly color?: string; }
export type ShoutCommand = (actionId: string, input: ShoutInput, context: CapabilityContext) => Promise<void>;

const isShoutInput = (value: unknown): value is ShoutInput => {
  if (!value || typeof value !== 'object' || typeof (value as { text?: unknown }).text !== 'string') return false;
  const input = value as ShoutInput;
  return input.text.length > 0 && input.text.length <= 100 && (input.bubble === undefined || Number.isInteger(input.bubble)) && (input.color === undefined || typeof input.color === 'string');
};

export function registerShout(registry: CapabilityRegistry, command: ShoutCommand): void {
  registry.register<ShoutInput>({ name: 'SHOUT', validate: isShoutInput, precondition: (context) => context.world.roomId === undefined ? 'room observation required' : undefined, execute: (actionId, context, input) => command(actionId, input, context) });
}
