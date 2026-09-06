export type DomainEventKind =
  | 'session_authenticated'
  | 'user_home_room_observed'
  | 'room_opened'
  | 'server_ping'
  | 'room_users_observed';

export type ObservedRoomUser = {
  readonly id: number;
  readonly roomUnitId: number;
  readonly name: string;
  readonly type: number;
  readonly x: number;
  readonly y: number;
};

export type DomainEventPayload = {
  readonly session_authenticated: { readonly sessionResumed: boolean; readonly roomId: number };
  readonly user_home_room_observed: { readonly homeRoom: number; readonly roomToEnter: number };
  readonly room_opened: Record<string, never>;
  readonly server_ping: Record<string, never>;
  readonly room_users_observed: { readonly users: readonly ObservedRoomUser[] };
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

export type WorldStateSnapshot = {
  readonly revision: number;
  readonly roomId: number | undefined;
  readonly homeRoom: number | undefined;
  readonly lastObservedAt: number | undefined;
  readonly users: readonly ObservedRoomUser[];
};
