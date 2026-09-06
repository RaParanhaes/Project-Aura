export type HeartbeatOptions = {
  intervalMs: number;
  timeoutMs: number;
  sendPing: () => void | Promise<void>;
  onTimeout: () => void;
};

export type TimerApi = {
  setInterval(callback: () => void, delayMs: number): unknown;
  clearInterval(handle: unknown): void;
};

/** Sends periodic pings and reports when no activity arrives before the timeout. */
export class HeartbeatController {
  private interval: unknown;
  private lastActivity = 0;

  constructor(
    private readonly options: HeartbeatOptions,
    private readonly timers: TimerApi = globalThis as unknown as TimerApi
  ) {}

  start(now = Date.now()): void {
    this.stop();
    this.lastActivity = now;
    this.interval = this.timers.setInterval(() => {
      const current = Date.now();
      if (current - this.lastActivity >= this.options.timeoutMs) {
        this.options.onTimeout();
        this.stop();
        return;
      }
      void this.options.sendPing();
    }, this.options.intervalMs);
  }

  markAlive(now = Date.now()): void { this.lastActivity = now; }
  stop(): void {
    if (this.interval !== undefined) this.timers.clearInterval(this.interval);
    this.interval = undefined;
  }
}
