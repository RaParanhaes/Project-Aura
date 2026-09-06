export type DomainEventKind =
  | 'session_authenticated'
  | 'user_home_room_observed'
  | 'room_opened'
  | 'server_ping';

export type DomainEventPayload = {
  readonly session_authenticated: { readonly sessionResumed: boolean; readonly roomId: number };
  readonly user_home_room_observed: { readonly homeRoom: number; readonly roomToEnter: number };
  readonly room_opened: Record<string, never>;
  readonly server_ping: Record<string, never>;
};

export type DomainEvent<K extends DomainEventKind = DomainEventKind> = {
  readonly kind: K;
  readonly observedAt: number;
  readonly payload: DomainEventPayload[K];
};

export type RoomSnapshot = {
  readonly roomId: number;
  readonly revision: number;
};
