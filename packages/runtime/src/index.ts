export {
  RealSession,
  SessionError
} from './session/real-session.js';
export type {
  AuthProvider,
  SessionCloseReason,
  SessionState,
  SessionTransport,
  Unsubscribe
} from './session/real-session.js';
export { HeartbeatController } from './session/heartbeat.js';
export { WebSocketSessionTransport } from './session/websocket-transport.js';
export type { HeartbeatOptions, TimerApi } from './session/heartbeat.js';
export type { WebSocketFactory, WebSocketLike } from './session/websocket-transport.js';
export { CredentialAuthProvider } from './session/authentication.js';
export type { AuthHandshake, CredentialProvider } from './session/authentication.js';
