import type { DomainEvent, DomainEventKind, DomainEventPayload } from '@aura/domain';

export type InboundPacket = { readonly header: number; readonly body: Uint8Array };
export type EventDecoder<K extends DomainEventKind> = (packet: InboundPacket) => DomainEventPayload[K];

/** Converts transport packets into stable domain events through injected decoders. */
export class EventNormalizer {
  private readonly decoders = new Map<number, { kind: DomainEventKind; decode: EventDecoder<DomainEventKind> }>();

  register<K extends DomainEventKind>(header: number, kind: K, decode: EventDecoder<K>): void {
    if (this.decoders.has(header)) throw new Error(`A decoder is already registered for header ${header}`);
    this.decoders.set(header, { kind, decode: decode as EventDecoder<DomainEventKind> });
  }

  normalize(packet: InboundPacket, observedAt = Date.now()): DomainEvent | undefined {
    const decoder = this.decoders.get(packet.header);
    if (!decoder) return undefined;
    return { kind: decoder.kind, observedAt, payload: decoder.decode(packet) } as DomainEvent;
  }
}
