import pino, {
  type DestinationStream,
  type Logger,
  type LoggerOptions,
} from 'pino';

export interface AuraLogContext {
  traceId?: string;
  sessionId?: string;
  agentId?: string;
  actionId?: string;
  component?: string;
}

export interface CreateAuraLoggerOptions {
  service: string;
  level?: LoggerOptions['level'];
  destination?: DestinationStream;
  base?: Record<string, unknown>;
}

export type AuraLogger = Logger;

export const SENSITIVE_LOG_PATHS = [
  'password',
  'token',
  'accessToken',
  'refreshToken',
  'authorization',
  'ssoTicket',
  'req.headers.authorization',
] as const;

export function createLogger(options: CreateAuraLoggerOptions): AuraLogger {
  const loggerOptions: LoggerOptions = {
    base: {
      service: options.service,
      ...options.base,
    },
    redact: {
      paths: [...SENSITIVE_LOG_PATHS],
      censor: '[REDACTED]',
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  };

  if (options.level !== undefined) {
    loggerOptions.level = options.level;
  }

  return options.destination === undefined
    ? pino(loggerOptions)
    : pino(loggerOptions, options.destination);
}

export function withLogContext(
  logger: AuraLogger,
  context: AuraLogContext,
): AuraLogger {
  const bindings: Record<string, string> = {};

  if (context.traceId !== undefined) bindings.traceId = context.traceId;
  if (context.sessionId !== undefined) bindings.sessionId = context.sessionId;
  if (context.agentId !== undefined) bindings.agentId = context.agentId;
  if (context.actionId !== undefined) bindings.actionId = context.actionId;
  if (context.component !== undefined) bindings.component = context.component;

  return logger.child(bindings);
}
