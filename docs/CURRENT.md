# Current Project State

**Completed phases:** D0 — Documentation Foundation; F1 — Development Foundation  
**Current phase:** F2 — Protocol Foundation  
**Last completed milestone:** F1.5 — Verification Gate  
**Next milestone:** F2.1 — Freeze Compatibility Target  
**Status:** F1 COMPLETE / F2 READY TO START  
**Implementation status:** DEVELOPMENT FOUNDATION VERIFIED; POLARIS PROTOCOL NOT IMPLEMENTED

## F1 result

The repository now has the minimum development foundation required to begin protocol work safely.

Validated through the canonical CI gate:

- Node.js 24.x runtime constraint;
- pnpm 11.25.0 pinned through `packageManager`;
- committed `pnpm-lock.yaml` with frozen CI installation;
- TypeScript 7.0.2 strict workspace baseline;
- Vitest 5.0.0 unit/smoke baseline;
- repository-owned architecture rules for workspace dependencies/imports/cycles;
- Pino 10.3.1 structured logging foundation with correlation context and credential redaction;
- `pnpm run verify` is the single quality gate and runs doctor, structure verification, architecture verification, strict type checking and unit tests;
- GitHub Actions performs `pnpm install --frozen-lockfile` and then runs the same `pnpm run verify` command.

### Build/emission decision

F1 intentionally does **not** emit a `dist/` build. The current private workspaces expose TypeScript development surfaces and there is no executable/session runtime to package yet. Adding output layout/export-map decisions now would be premature. Strict type checking is the F1 compile gate; executable build/emission must be introduced when the runtime/package shape actually requires it.

### Known tooling constraints

- `dependency-cruiser@18.2.0` remains deferred because it does not support the pinned TypeScript 7.0.2; the repository-owned architecture verifier is active instead.
- Knip remains deferred until dead-code analysis provides useful signal.
- `skipLibCheck: true` remains part of the shared TypeScript baseline so third-party declaration internals do not break strict checking of AURA source.

## Next work — F2.1 Freeze Compatibility Target

Before implementing packet primitives, establish the exact environment AURA is targeting:

1. identify and record the exact Polaris revision/version currently used by the hotel;
2. identify and record the exact Octane revision/build currently used by the client;
3. locate the Polaris packet contract source for that revision;
4. record a stable contract fingerprint/commit reference;
5. do not implement packets until these compatibility targets are explicit.

Polaris will begin to matter from F2. Early F2 research/contract work can be done from source evidence, but real integration validation will require the user's Polaris environment running in later F2/F3 work.

## Do not start early

- RealSession/WebSocket/authentication behavior before the minimum F2 protocol contracts exist.
- WorldState implementation (F4).
- Capabilities (F5).
- Persistence/recovery implementation (F6).
- Ollama, memory and social systems.

Detailed sequence: `roadmap/IMPLEMENTATION-PLAN.md`.
