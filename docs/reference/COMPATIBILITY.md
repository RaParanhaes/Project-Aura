# Compatibility Reference

This file records versions actually validated by AURA and the exact external compatibility target selected for protocol work. Do not claim runtime compatibility based only on documentation/research.

## Tooling baseline

| Component | Validated version/commit | Status |
|---|---|---|
| Node.js | 24.x | CI VALIDATED |
| pnpm | 11.25.0 | CI VALIDATED |
| pnpm lockfile | format 9.0 | CI VALIDATED / FROZEN INSTALL |
| TypeScript | 7.0.2 | CI VALIDATED |
| Vitest | 5.0.0 | CI VALIDATED |
| Pino | 10.3.1 | CI VALIDATED |
| @types/node | 24.6.1 | CI VALIDATED WITH `skipLibCheck` |
| AURA agent state schema | not created yet | F6 |

F1 tooling validation means a clean GitHub Actions environment installs the committed dependency graph with `pnpm install --frozen-lockfile` and passes the canonical `pnpm run verify` gate. The lockfile freezes the transitive dependency graph used by CI; direct dependency versions remain explicitly pinned in workspace manifests where appropriate.

The shared TypeScript configuration uses `skipLibCheck: true`: AURA source remains strict, while third-party declaration internals are not revalidated. This is required by the current TypeScript 7.0.2 + Node 24 type ecosystem combination.

## F2.1 frozen Polaris / Octane target

The following target was identified from the user's local hotel environment before packet implementation began. It is the compatibility reference for F2 protocol work.

### Polaris

| Field | Frozen value |
|---|---|
| Version | `4.2.82` |
| Base commit | `11f35d8c4d2a6f371b355107d4c7e477717cb2de` |
| Working tree | DIRTY |
| Local-state fingerprint | `568e90d740c2420ec52bce6516cbe6778a2e5d513a8095b4138a3522c159ef2f` |
| Runtime JAR SHA-256 | `4f05ad8a6fa4eddb96712ae5a703d23e8247e230cff7e26f9b322cb7af42488d` |

The runtime JAR was produced from a dirty Polaris tree. Therefore the supported target cannot be identified by the upstream/base commit alone; the base commit, local-state fingerprint and JAR SHA-256 belong together.

### Octane

| Field | Frozen value |
|---|---|
| Base commit | `80f105adb8786093a194d7f10cb1517ec580b0f1` |
| Working tree | DIRTY |
| Local-state fingerprint | `f71207bd99f061328e422f9fbb2d7e5df1b8493d2459cf943d0c7e3e7b882735` |
| Package version | `3.5.0` |

### Octane Renderer

| Field | Frozen value |
|---|---|
| Version | `2.1.0` |
| Commit | `88dade32f88285fe3ff1d30387841ea66f15acf1` |
| Working tree | CLEAN |

### Polaris protocol contract

| Field | Frozen value |
|---|---|
| Contract | `packet-field-contracts.json` |
| Schema | `2` |
| SHA-256 | `fb8dd00dcaa7657b58781b835c0357fefc692797c1fabb9db5ba6770ce52d67b` |

The repository stores the contract identity/fingerprint rather than a machine-specific local path. F2.2 must inspect this exact contract plus the relevant Polaris handlers before AURA protocol code is derived from it.

### Client release contract

The effective client release is `NITRO-3-6-0`.

When `client.release.allowed` is empty, Polaris falls back to `NITRO-3-6-0`; an empty value does **not** mean that any release is accepted. Polaris still validates the client release using an exact case-insensitive match. The current Octane Renderer sends `NITRO-3-6-0`, so the selected client/server target agrees on release identity.

A database-provided explicit value may override the configuration value. If the effective value is still empty, the same `NITRO-3-6-0` fallback applies.

### WebSocket access target

| Context | Endpoint / port |
|---|---|
| Polaris internal WebSocket | `2096` |
| AURA running on host | `ws://127.0.0.1:2096` |
| AURA in same Compose network | `ws://polaris:2096/` |

The current Compose configuration does not yet publish port `2096` to the host. Before host-based integration tests, publish only the WebSocket locally, for example `127.0.0.1:2096:2096`. Game-server port `3000` and RCON port `3001` do not need to be exposed for normal AURA user-protocol operation.

## Fingerprint meaning

The local-state fingerprints above cover tracked diff content plus a manifest hash of untracked files. They are evidence identifiers, not copies of local files, paths or secrets.

## Validation status

**F2.1 status: TARGET FROZEN.** The exact Polaris/Octane/runtime-contract identity is now explicit enough to begin protocol evidence study.

This does **not** yet claim that AURA has successfully connected to Polaris. Packet compatibility, WebSocket integration and authenticated RealSession behavior must be proven in their planned F2/F3 tests.
