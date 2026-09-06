import type { CapabilityRegistry, CapabilityContext } from './capability-registry.js';

export type LookAtInput = { readonly x: number; readonly y: number };
export type LookAtCommand = (actionId: string, input: LookAtInput, context: CapabilityContext) => Promise<void>;

const isLookAtInput = (value: unknown): value is LookAtInput => {
  if (typeof value !== 'object' || value === null) return false;
  const input = value as { x?: unknown; y?: unknown };
  return Number.isSafeInteger(input.x) && Number.isSafeInteger(input.y)
    && (input.x as number) >= 0 && (input.y as number) >= 0;
};

/** Registers the semantic look action; packet composition belongs to the command adapter. */
export function registerLookAt(registry: CapabilityRegistry, command: LookAtCommand): void {
  registry.register<LookAtInput>({
    name: 'LOOK_AT',
    validate: isLookAtInput,
    precondition: (context) => context.world.roomId === undefined ? 'room observation required' : undefined,
    execute: (actionId, context, input) => command(actionId, input, context),
  });
}
