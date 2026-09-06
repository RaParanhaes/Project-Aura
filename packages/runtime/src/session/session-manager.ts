import { SessionError, type RealSession } from './real-session.js';

/** Coordinates one active RealSession per AURA agent identity. */
export class SessionManager {
  private readonly sessions = new Map<string, RealSession>();

  register(session: RealSession): void {
    const current = this.sessions.get(session.agentId);
    if (current && current !== session) {
      throw new SessionError(`An active session already exists for agent ${session.agentId}`);
    }
    this.sessions.set(session.agentId, session);
  }

  get(agentId: string): RealSession | undefined { return this.sessions.get(agentId); }

  entries(): IterableIterator<[string, RealSession]> { return this.sessions.entries(); }

  get size(): number { return this.sessions.size; }

  unregister(session: RealSession): void {
    if (this.sessions.get(session.agentId) === session) this.sessions.delete(session.agentId);
  }

  clear(): void { this.sessions.clear(); }
}
