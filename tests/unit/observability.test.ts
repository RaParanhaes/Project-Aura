import { describe, expect, it } from 'vitest';

import {
  createLogger,
  withLogContext,
} from '../../packages/observability/src/index.ts';

function createCaptureDestination() {
  const lines: string[] = [];

  return {
    lines,
    destination: {
      write(message: string) {
        lines.push(message);
      },
    },
  };
}

describe('AURA observability baseline', () => {
  it('adds service and correlation fields to structured log records', () => {
    const capture = createCaptureDestination();
    const logger = createLogger({
      service: 'aura-test',
      destination: capture.destination,
    });
    const contextualLogger = withLogContext(logger, {
      traceId: 'trace-001',
      sessionId: 'session-001',
      agentId: 'agent-001',
      actionId: 'action-001',
      component: 'test-suite',
    });

    contextualLogger.info({ event: 'baseline_check' }, 'observability works');

    expect(capture.lines).toHaveLength(1);
    const record = JSON.parse(capture.lines[0] ?? '{}') as Record<string, unknown>;

    expect(record.service).toBe('aura-test');
    expect(record.traceId).toBe('trace-001');
    expect(record.sessionId).toBe('session-001');
    expect(record.agentId).toBe('agent-001');
    expect(record.actionId).toBe('action-001');
    expect(record.component).toBe('test-suite');
    expect(record.event).toBe('baseline_check');
    expect(record.msg).toBe('observability works');
  });

  it('redacts common credential fields before they reach the destination', () => {
    const capture = createCaptureDestination();
    const logger = createLogger({
      service: 'aura-test',
      destination: capture.destination,
    });

    logger.info(
      {
        password: 'super-secret',
        token: 'token-secret',
        authorization: 'Bearer secret',
        ssoTicket: 'ticket-secret',
      },
      'credential check',
    );

    const record = JSON.parse(capture.lines[0] ?? '{}') as Record<string, unknown>;

    expect(record.password).toBe('[REDACTED]');
    expect(record.token).toBe('[REDACTED]');
    expect(record.authorization).toBe('[REDACTED]');
    expect(record.ssoTicket).toBe('[REDACTED]');
  });
});
