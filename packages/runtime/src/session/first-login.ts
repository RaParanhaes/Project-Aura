import { SessionError, type RealSession } from './real-session.js';

export type FirstLoginResult = {
  agentId: string;
  state: 'online';
};

/** Runs the first-login boundary and returns only a confirmed online state. */
export async function firstLogin(session: RealSession): Promise<FirstLoginResult> {
  await session.start();
  if (session.state !== 'online') {
    throw new SessionError(`First login did not reach online state: ${session.state}`);
  }
  return { agentId: session.agentId, state: 'online' };
}
