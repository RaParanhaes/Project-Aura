/**
 * Known wire fixtures for the frozen Polaris 4.2.82 / Nitro 3.6.0 target.
 * Values are intentionally non-secret and contain only deterministic test inputs.
 */
export const FROZEN_INITIAL_PACKET_FIXTURES = Object.freeze({
  clientHello: {
    releaseVersion: 'NITRO-3-6-0',
    type: 'HTML5',
    platform: 2,
    category: 1,
    hex: '0000001e0fa0000b4e4954524f2d332d362d30000548544d4c350000000200000001',
  },
  machineIdentity: {
    machineId: 'machine',
    fingerprint: 'fingerprint',
    flashVersion: 'flash',
    hex: '0000001f09ba00076d616368696e65000b66696e6765727072696e740005666c617368',
  },
  ssoTicket: {
    ticket: 'ticket',
    timestamp: 123,
    recoveryToken: '',
    hex: '00000010097300067469636b65740000007b0000',
  },
  pong: '000000020a24',
  infoRetrieve: '000000020165',
  roomEnter: '0000000809080000002a0000',
  roomEnterWithSpawn: '0000001209080000002a000270770000000300000004',
  roomEntryData: '0000000208fc',
  authenticated: '0000000a09bb01ffffffff000158',
  ping: '000000020f58',
  userHomeRoom: '0000000a0b3b0000000700000008',
  roomOpen: '0000000202f6',
});
