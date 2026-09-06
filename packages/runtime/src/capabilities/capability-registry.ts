import type { WorldStateSnapshot } from '@aura/domain';

export type CapabilityContext = { readonly world: WorldStateSnapshot };
export type CapabilityResult = { readonly actionId: string; readonly status: 'pending' | 'rejected'; readonly reason?: string };
export type CapabilityDefinition<T> = {
  readonly name: string;
  readonly validate: (input: unknown) => input is T;
  readonly precondition?: (context: CapabilityContext, input: T) => string | undefined;
  readonly execute: (actionId: string, context: CapabilityContext, input: T) => Promise<void>;
};

/** Registry and boundary for semantic actions; execution is pending until observed confirmation. */
export class CapabilityRegistry {
  private readonly definitions = new Map<string, CapabilityDefinition<unknown>>();

  register<T>(definition: CapabilityDefinition<T>): void {
    if (this.definitions.has(definition.name)) throw new Error(`Capability already registered: ${definition.name}`);
    this.definitions.set(definition.name, definition as CapabilityDefinition<unknown>);
  }

  async request(name: string, input: unknown, context: CapabilityContext, actionId: string): Promise<CapabilityResult> {
    const definition = this.definitions.get(name);
    if (!definition) return { actionId, status: 'rejected', reason: `Unknown capability: ${name}` };
    if (!definition.validate(input)) return { actionId, status: 'rejected', reason: `Invalid input for ${name}` };
    const reason = definition.precondition?.(context, input);
    if (reason) return { actionId, status: 'rejected', reason };
    await definition.execute(actionId, context, input);
    return { actionId, status: 'pending' };
  }
}
