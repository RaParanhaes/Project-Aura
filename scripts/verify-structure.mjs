import fs from 'node:fs';

const required = [
  'README.md',
  'AGENTS.md',
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'tsconfig.base.json',
  'docs/INDEX.md',
  'docs/CURRENT.md',
  'docs/project/VISION.md',
  'docs/project/OBJECTIVES.md',
  'docs/project/PRINCIPLES.md',
  'docs/project/GLOSSARY.md',
  'docs/architecture/OVERVIEW.md',
  'docs/architecture/FLOW.md',
  'docs/roadmap/ROADMAP.md',
  'docs/roadmap/IMPLEMENTATION-PLAN.md',
  'docs/roadmap/FOUNDATION.md',
  'docs/decisions/README.md',
  'docs/development/WORKFLOW.md',
  'docs/development/DEFINITION-OF-DONE.md',
  'docs/development/DEPENDENCY-RULES.md',
  'docs/engineering/TEST-COVERAGE.md',
  'docs/reference/COMPATIBILITY.md',
  'THIRD_PARTY.md',
  'scripts/architecture-rules.mjs',
  'scripts/verify-architecture.mjs',
  'apps/aura-core/package.json',
  'apps/aura-core/tsconfig.json',
  'apps/aura-core/src/main.ts',
  'packages/domain/package.json',
  'packages/domain/tsconfig.json',
  'packages/domain/src/index.ts',
  'packages/protocol/package.json',
  'packages/protocol/tsconfig.json',
  'packages/protocol/src/index.ts',
  'packages/polaris/package.json',
  'packages/polaris/tsconfig.json',
  'packages/polaris/src/index.ts',
  'packages/runtime/package.json',
  'packages/runtime/tsconfig.json',
  'packages/runtime/src/index.ts',
  'packages/persistence/package.json',
  'packages/persistence/tsconfig.json',
  'packages/persistence/src/index.ts',
  'packages/observability/package.json',
  'packages/observability/tsconfig.json',
  'packages/observability/src/index.ts'
];

const missing = required.filter((path) => !fs.existsSync(path));
if (missing.length) {
  console.error('AURA structure verification failed. Missing:');
  for (const path of missing) console.error(`- ${path}`);
  process.exit(1);
}

console.log(`AURA structure verification passed (${required.length} required artifacts).`);
