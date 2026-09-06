# AURA Dependency Rules

This document records the currently enforced internal dependency directions for the Foundation.

The goal is to keep AURA modular without creating speculative layers. Rules should change only when an implementation need is accepted and documented.

## Current workspace rules

| From | Allowed internal dependencies |
|---|---|
| `@aura/core` | all current AURA workspaces (composition root) |
| `@aura/domain` | none |
| `@aura/protocol` | none |
| `@aura/polaris` | `@aura/protocol` |
| `@aura/runtime` | `@aura/domain` |
| `@aura/persistence` | `@aura/domain` |
| `@aura/observability` | none |

Examples:

```text
runtime → domain       ✅
polaris → protocol     ✅
persistence → domain   ✅

domain → polaris       ❌
protocol → runtime     ❌
protocol → persistence ❌
runtime → polaris      ❌
```

`@aura/core` is the composition root and may depend on all current modules so it can wire adapters to runtime/domain ports.

## Public seams

Cross-workspace source code must import only from the package public export:

```ts
import type { Example } from '@aura/domain'; // allowed
```

Deep imports are forbidden:

```ts
import type { Example } from '@aura/domain/src/example.js'; // forbidden
```

Relative imports that escape one workspace and enter another workspace are also forbidden.

## Manifest rules

Internal AURA dependencies:

- must reference a known `@aura/*` workspace;
- must use a `workspace:` version;
- must follow the dependency direction table above;
- must not create dependency cycles.

A source import of another AURA package must also be declared in that workspace's package manifest.

## Enforcement

Run:

```bash
pnpm run architecture
```

The same check is part of:

```bash
pnpm run verify
```

The verifier checks both package manifests and source imports, including circular workspace relationships.

## dependency-cruiser status

`dependency-cruiser` remains the preferred mature tool to evaluate for this job, but it is **not installed in F1.3**.

At the time of this milestone, `dependency-cruiser@18.2.0` does not support the project's pinned TypeScript `7.0.2`. Its maintainers indicate TypeScript 7 support is expected once the public compiler API is available in TypeScript 7.1.

Until that compatibility exists, AURA uses a small repository-owned verifier instead of downgrading TypeScript or forcing an unsupported toolchain.

Re-evaluate dependency-cruiser when the TypeScript compatibility constraint changes.
