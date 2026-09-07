import type { WorldStateSnapshot } from '@aura/domain';

export type CapabilityContext = { readonly world: WorldStateSnapshot };
export type CapabilityResult = { readonly actionId: string; readonly status: 'pending' | 'rejected'; readonly reason?: string };
export type CapabilityDefinition<T> = {
  readonly name: string;
  readonly validate: (input: unknown) => input is T;
  readonly precondition?: (context: CapabilityContext, input: T) => string | undefined;
  readonly execute: (actionId: string, context: CapabilityContext, input: T) => Promise<void>;
};
export type CapabilityRateLimit = { readonly cooldownMs?: number; readonly maxPerWindow?: number; readonly windowMs?: number };
export type CapabilityRegistryOptions = { readonly rateLimits?: Readonly<Record<string, CapabilityRateLimit>>; readonly now?: () => number };

/** Registry and boundary for semantic actions; execution is pending until observed confirmation. */
export class CapabilityRegistry {
  private readonly definitions = new Map<string, CapabilityDefinition<unknown>>();
  private readonly lastExecution = new Map<string, number>();
  private readonly executions = new Map<string, number[]>();
  private readonly now: () => number;
  private readonly rateLimits: Readonly<Record<string, CapabilityRateLimit>>;

  public constructor(options: CapabilityRegistryOptions = {}) {
    this.now = options.now ?? (() => Date.now());
    this.rateLimits = options.rateLimits ?? {};
  }

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
    const limited = this.rateLimitReason(name);
    if (limited) return { actionId, status: 'rejected', reason: limited };
    await definition.execute(actionId, context, input);
    this.recordExecution(name);
    return { actionId, status: 'pending' };
  }

  private rateLimitReason(name: string): string | undefined {
    const policy = this.rateLimits[name]; if (!policy) return undefined;
    const now = this.now(); const cooldown = policy.cooldownMs ?? 0; const last = this.lastExecution.get(name);
    if (last !== undefined && now - last < cooldown) return `cooldown active (${cooldown - (now - last)}ms remaining)`;
    const windowMs = policy.windowMs ?? 1000; const recent = (this.executions.get(name) ?? []).filter(time => now - time < windowMs);
    if (policy.maxPerWindow !== undefined && recent.length >= policy.maxPerWindow) return `rate limit exceeded (${policy.maxPerWindow}/${windowMs}ms)`;
    return undefined;
  }

  private recordExecution(name: string): void {
    const now = this.now(); this.lastExecution.set(name, now);
    const policy = this.rateLimits[name]; const windowMs = policy?.windowMs ?? 1000;
    this.executions.set(name, (this.executions.get(name) ?? []).filter(time => now - time < windowMs).concat(now));
  }
}
