import type { CapabilityRegistry, CapabilityContext } from './capability-registry.js';

export type EnterRoomInput = { readonly roomId: number; readonly password?: string };
export type EnterRoomCommand = (actionId: string, input: EnterRoomInput, context: CapabilityContext) => Promise<void>;

const isEnterRoomInput = (value: unknown): value is EnterRoomInput => {
  if (typeof value !== 'object' || value === null) return false;
  const input = value as { roomId?: unknown; password?: unknown };
  return Number.isSafeInteger(input.roomId) && (input.roomId as number) >= 0 && (input.password === undefined || typeof input.password === 'string');
};

/** Registers the semantic room-entry action; packet composition belongs to the command adapter. */
export function registerEnterRoom(registry: CapabilityRegistry, command: EnterRoomCommand): void {
  registry.register<EnterRoomInput>({
    name: 'ENTER_ROOM',
    validate: isEnterRoomInput,
    precondition: (_context, input) => input.roomId === _context.world.roomId ? 'already in requested room' : undefined,
    execute: (actionId, context, input) => command(actionId, input, context),
  });
}
