import type { CapabilityRegistry, CapabilityContext } from './capability-registry.js';

export type StopTypingInput = undefined;
export type StopTypingCommand = (actionId: string, input: StopTypingInput, context: CapabilityContext) => Promise<void>;
const isStopTypingInput = (value: unknown): value is StopTypingInput => value === undefined;

/** Registers the semantic typing-stop action; packet composition belongs to the command adapter. */
export function registerStopTyping(registry: CapabilityRegistry, command: StopTypingCommand): void {
  registry.register<StopTypingInput>({
    name: 'STOP_TYPING', validate: isStopTypingInput,
    precondition: context => context.world.roomId === undefined ? 'room observation required' : undefined,
    execute: (actionId, context, input) => command(actionId, input, context),
  });
}
