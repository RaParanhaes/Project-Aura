import type { CapabilityRegistry, CapabilityContext } from './capability-registry.js';

export type StartTypingInput = undefined;
export type StartTypingCommand = (actionId: string, input: StartTypingInput, context: CapabilityContext) => Promise<void>;

const isStartTypingInput = (value: unknown): value is StartTypingInput => value === undefined;

/** Registers the semantic typing-start action; packet composition belongs to the command adapter. */
export function registerStartTyping(registry: CapabilityRegistry, command: StartTypingCommand): void {
  registry.register<StartTypingInput>({
    name: 'START_TYPING',
    validate: isStartTypingInput,
    precondition: (context) => context.world.roomId === undefined ? 'room observation required' : undefined,
    execute: (actionId, context, input) => command(actionId, input, context),
  });
}
