import { SessionManager } from './session-manager.js';
import type { RealSession } from './real-session.js';

export type SessionFactory = (agentId: string) => RealSession;

export type SessionFleetResult = {
  readonly agentId: string;
  readonly session?: RealSession;
  readonly error?: unknown;
};

/** Starts and stops independent resident sessions without cross-session failure propagation. */
export class SessionFleet {
  constructor(
    private readonly manager = new SessionManager(),
    private readonly maxSessions = 30
  ) {
    if (!Number.isSafeInteger(maxSessions) || maxSessions < 1) throw new Error('maxSessions must be a positive safe integer');
  }

  async start(agentIds: readonly string[], factory: SessionFactory): Promise<readonly SessionFleetResult[]> {
    const uniqueIds = [...new Set(agentIds)];
    if (uniqueIds.length !== agentIds.length) throw new Error('Session fleet agent IDs must be unique');
    if (uniqueIds.length > this.maxSessions) throw new Error(`Session fleet limit is ${this.maxSessions}`);
    return Promise.all(uniqueIds.map(async (agentId): Promise<SessionFleetResult> => {
      const session = factory(agentId);
      try {
        this.manager.register(session);
        await session.start();
        return { agentId, session };
      } catch (error) {
        this.manager.unregister(session);
        return { agentId, error };
      }
    }));
  }

  async stop(): Promise<void> {
    const sessions = [...this.managerSessions()];
    await Promise.allSettled(sessions.map(async session => {
      await session.close({ code: 1000, reason: 'fleet shutdown' });
      session.dispose();
      this.manager.unregister(session);
    }));
  }

  get(agentId: string): RealSession | undefined { return this.manager.get(agentId); }
  get size(): number { return this.managerSize(); }

  private managerSessions(): readonly RealSession[] {
    return [...this.manager.entries()].map(([, session]) => session);
  }

  private managerSize(): number { return this.managerSessions().length; }
}
