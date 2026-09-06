export class PacketProtocolError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class PacketBoundsError extends PacketProtocolError {
  public constructor(
    public readonly operation: string,
    public readonly requestedBytes: number,
    public readonly remainingBytes: number,
  ) {
    super(
      `${operation} requires ${requestedBytes} byte(s), but only ${remainingBytes} remain`,
    );
  }
}

export class PacketValueRangeError extends PacketProtocolError {
  public constructor(
    public readonly operation: string,
    public readonly value: number | bigint,
  ) {
    super(`${operation} received an out-of-range value: ${String(value)}`);
  }
}

export class PacketStringTooLongError extends PacketProtocolError {
  public constructor(public readonly byteLength: number) {
    super(`String UTF-8 length ${byteLength} exceeds the 65535-byte wire limit`);
  }
}

export class InvalidPacketLengthError extends PacketProtocolError {
  public constructor(public readonly length: number) {
    super(`Packet length ${length} is invalid; length must include at least the 2-byte header`);
  }
}

export class PacketTooLargeError extends PacketProtocolError {
  public constructor(
    public readonly length: number,
    public readonly maxPacketLength: number,
  ) {
    super(
      `Packet length ${length} exceeds the configured maximum of ${maxPacketLength}`,
    );
  }
}
