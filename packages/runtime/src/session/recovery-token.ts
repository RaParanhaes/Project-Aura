/** In-memory recovery token holder; tokens are short-lived and never persisted. */
export class SessionRecoveryTokenStore {
  private token = '';

  get value(): string { return this.token; }

  set(value: string): void { this.token = value.trim(); }

  clear(): void { this.token = ''; }
}
