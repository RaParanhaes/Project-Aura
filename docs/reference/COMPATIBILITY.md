# Compatibility Reference

This file records versions actually validated by AURA. Do not claim compatibility based only on documentation/research.

| Component | Validated version/commit | Status |
|---|---|---|
| Node.js | 24.x | CI VALIDATED |
| pnpm | 11.25.0 | CI VALIDATED |
| TypeScript | 7.0.2 | CI VALIDATED |
| Polaris | not pinned yet | NEEDS LOCAL CONFIRMATION |
| Octane | not pinned yet | NEEDS LOCAL CONFIRMATION |
| Polaris packet contract | not imported yet | F2 |
| AURA agent state schema | not created yet | F6 |

Tooling validation means the repository installs and `pnpm run verify` passes in GitHub Actions with the versions above. Game compatibility remains intentionally unclaimed until the relevant integration phases.

When integration begins, record exact Polaris/Octane revisions and protocol contract fingerprint used by tests/logs.
