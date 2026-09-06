import { describe, expect, it } from 'vitest';
import { PolarisRoomEntryAdapter } from '../../packages/polaris/src/index.ts';
import {
  ClientHelloComposer,
  InfoRetrieveComposer,
  PacketStreamCodec,
  PongComposer,
  SSOTicketComposer,
  UniqueIDComposer,
  parseRoomUsers,
} from '../../packages/protocol/src/index.ts';
import { OriginWebSocket } from './support/origin-websocket.ts';

const ticket = process.env.AURA_SSO_TICKET;
const expectedUser = process.env.AURA_EXPECT_ROOM_USER;

describe.runIf(ticket)('live Polaris room entry', () => {
  it('completes room entry, observes the roster and remains present for 30 seconds', async () => {
    const names = await new Promise<readonly string[]>((resolve, reject) => {
      const socket = new OriginWebSocket(process.env.AURA_WS_URL ?? 'ws://172.18.0.3:2096');
      const codec = new PacketStreamCodec();
      const roomEntry = new PolarisRoomEntryAdapter({ send: async payload => socket.send(payload) });
      const timeout = setTimeout(() => reject(new Error('live room-entry timeout')), 55_000);
      let requestedRoom = false;
      let finishTimer: ReturnType<typeof setTimeout> | undefined;
      let queue = Promise.resolve();

      const fail = (error: unknown) => {
        clearTimeout(timeout);
        if (finishTimer) clearTimeout(finishTimer);
        socket.close();
        reject(error);
      };

      const handle = async (payload: Uint8Array) => {
        for (const frame of codec.push(payload)) {
          if (frame.header === 2491) socket.send(new InfoRetrieveComposer().encode());
          if (frame.header === 2725 && !requestedRoom) {
            requestedRoom = true;
            await roomEntry.enter({ roomId: 1 });
          }
          if (frame.header === 758) await roomEntry.handleInbound(frame);
          if (frame.header === 3928) socket.send(new PongComposer().encode());
          if (frame.header === 374 && !finishTimer) {
            const roster = parseRoomUsers(frame.body).map(user => user.name);
            if (!roster.includes('octane_test_1_mt')) continue;
            if (expectedUser && !roster.includes(expectedUser)) continue;

            finishTimer = setTimeout(() => {
              clearTimeout(timeout);
              socket.close(1000, 'live test complete');
              resolve(roster);
            }, 30_000);
          }
        }
      };

      socket.binaryType = 'arraybuffer';
      socket.onopen = () => {
        socket.send(new ClientHelloComposer().encode());
        socket.send(new UniqueIDComposer('aura-test-machine', 'aura-live-test', 'AURA/0.1').encode());
        socket.send(new SSOTicketComposer(ticket!, Math.floor(Date.now() / 1000)).encode());
      };
      socket.onmessage = ({ data }) => {
        const payload = new Uint8Array(data);
        queue = queue.then(() => handle(payload)).catch(fail);
      };
      socket.onerror = () => fail(new Error('live websocket error'));
    });

    expect(names).toContain('octane_test_1_mt');
    if (expectedUser) expect(names).toContain(expectedUser);
  }, 60_000);
});
