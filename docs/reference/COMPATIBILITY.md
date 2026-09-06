# Compatibility Reference

This file records versions actually validated by AURA. Do not claim compatibility based only on documentation/research.

| Component | Validated version/commit | Status |
|---|---|---|
| Node.js | 24.x | CI VALIDATED |
| pnpm | 11.25.0 | CI VALIDATED |
| pnpm lockfile | format 9.0 | CI VALIDATED / FROZEN INSTALL |
| TypeScript | 7.0.2 | CI VALIDATED |
| Vitest | 5.0.0 | CI VALIDATED |
| Pino | 10.3.1 | CI VALIDATED |
| @types/node | 24.6.1 | CI VALIDATED WITH `skipLibCheck` |
| Polaris | not pinned yet | F2.1 NEEDS LOCAL CONFIRMATION |
| Octane | not pinned yet | F2.1 NEEDS LOCAL CONFIRMATION |
| Polaris packet contract | not pinned/imported yet | F2.1/F2.2 |
| AURA agent state schema | not created yet | F6 |

F1 tooling validation means a clean GitHub Actions environment installs the committed dependency graph with `pnpm install --frozen-lockfile` and passes the canonical `pnpm run verify` gate. The lockfile freezes the transitive dependency graph used by CI; direct dependency versions remain explicitly pinned in workspace manifests where appropriate.

Game compatibility remains intentionally unclaimed. F2.1 must identify the exact Polaris revision, Octane revision/build and protocol contract source used by the user's hotel before packet implementation begins.

The shared TypeScript configuration uses `skipLibCheck: true`: AURA source remains strict, while third-party declaration internals are not revalidated. This is required by the current TypeScript 7.0.2 + Node 24 type ecosystem combination.

When integration begins, record exact Polaris/Octane revisions and a stable protocol-contract fingerprint/commit reference used by tests and diagnostics.
