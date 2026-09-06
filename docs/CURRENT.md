# Current Project State

**Completed phases:** D0 — Documentation Foundation; F1 — Development Foundation  
**Current phase:** F2 — Protocol Foundation  
**Last completed milestone:** F2.1 — Freeze Compatibility Target  
**Next milestone:** F2.2 — Study Existing Implementation Evidence  
**Status:** F2 IN PROGRESS  
**Implementation status:** COMPATIBILITY TARGET FROZEN; POLARIS PROTOCOL NOT IMPLEMENTED

## F1 result

The repository has the minimum development foundation required to implement protocol work safely:

- Node.js 24.x and pnpm 11.25.0;
- committed frozen dependency graph;
- TypeScript 7.0.2 strict workspace baseline;
- Vitest 5.0.0 unit/smoke baseline;
- repository-owned architecture guards;
- Pino 10.3.1 structured logging foundation;
- one canonical `pnpm run verify` local/CI gate.

## F2.1 result — compatibility target frozen

The exact local hotel environment used as the reference for AURA protocol work is now identified.

### Polaris

- version: `4.2.82`;
- base commit: `11f35d8c4d2a6f371b355107d4c7e477717cb2de`;
- working tree: DIRTY;
- local-state fingerprint: `568e90d740c2420ec52bce6516cbe6778a2e5d513a8095b4138a3522c159ef2f`;
- runtime JAR SHA-256: `4f05ad8a6fa4eddb96712ae5a703d23e8247e230cff7e26f9b322cb7af42488d`.

### Octane

- base commit: `80f105adb8786093a194d7f10cb1517ec580b0f1`;
- working tree: DIRTY;
- local-state fingerprint: `f71207bd99f061328e422f9fbb2d7e5df1b8493d2459cf943d0c7e3e7b882735`;
- package version: `3.5.0`.

### Octane Renderer

- version: `2.1.0`;
- commit: `88dade32f88285fe3ff1d30387841ea66f15acf1`;
- working tree: CLEAN.

### Protocol / release

- Polaris packet contract schema: `2`;
- contract SHA-256: `fb8dd00dcaa7657b58781b835c035fefc692797c1fabb9db5ba6770ce52d67b`;
- effective client release: `NITRO-3-6-0`;
- empty `client.release.allowed` falls back to `NITRO-3-6-0`; it does not mean unrestricted releases.

### WebSocket target

- Polaris internal WebSocket port: `2096`;
- host AURA target: `ws://127.0.0.1:2096`;
- same-Compose-network target: `ws://polaris:2096/`;
- the current Compose file does not yet expose `2096` to the host; host-based integration will require a local-only publication such as `127.0.0.1:2096:2096`.

The frozen target is evidence for protocol implementation, not a claim that AURA has already connected successfully. Real packet/session compatibility still requires F2/F3 tests.

Authoritative detail: `reference/COMPATIBILITY.md`.

## Next work — F2.2 Study Existing Implementation Evidence

Before implementing packet primitives:

1. inspect the frozen `packet-field-contracts.json` schema and identify the minimum handshake/auth/keepalive contracts needed by AURA;
2. inspect the corresponding Polaris incoming/outgoing handlers and field order/semantics;
3. inspect compatible portions of `cayank/packet-client` as implementation evidence, not as authority;
4. record license/reuse mode before adapting any external code;
5. capture uncertainties as research/open questions rather than guessing packet behavior;
6. do not implement codec primitives until the evidence study establishes the wire rules they must satisfy.

## Do not start early

- RealSession/WebSocket/authentication lifecycle implementation before the minimum F2 protocol contracts exist.
- WorldState implementation (F4).
- Capabilities (F5).
- Persistence/recovery implementation (F6).
- Ollama, memory and social systems.

Detailed sequence: `roadmap/IMPLEMENTATION-PLAN.md`.
