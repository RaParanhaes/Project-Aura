import type { CapabilityRegistry, CapabilityContext } from './capability-registry.js';

export type WalkToInput = { readonly x: number; readonly y: number };
export type WalkToCommand = (actionId: string, input: WalkToInput, context: CapabilityContext) => Promise<void>;

const isWalkToInput = (value: unknown): value is WalkToInput => {
  if (typeof value !== 'object' || value === null) return false;
  const input = value as { x?: unknown; y?: unknown };
  return Number.isSafeInteger(input.x) && Number.isSafeInteger(input.y)
    && (input.x as number) >= 0 && (input.y as number) >= 0;
};

/** Registers the semantic walk action; packet composition belongs to the command adapter. */
export function registerWalkTo(registry: CapabilityRegistry, command: WalkToCommand): void {
  registry.register<WalkToInput>({
    name: 'WALK_TO',
    validate: isWalkToInput,
    precondition: (context) => context.world.roomId === undefined ? 'room observation required' : undefined,
    execute: (actionId, context, input) => command(actionId, input, context),
  });
}
