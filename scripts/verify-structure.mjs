import fs from 'node:fs';

const required = [
  'README.md',
  'AGENTS.md',
  'package.json',
  'pnpm-workspace.yaml',
  'docs/INDEX.md',
  'docs/CURRENT.md',
  'docs/project/VISION.md',
  'docs/project/PRINCIPLES.md',
  'docs/architecture/OVERVIEW.md',
  'docs/architecture/FLOW.md',
  'docs/roadmap/FOUNDATION.md',
  'docs/decisions/README.md',
  'docs/engineering/TEST-COVERAGE.md',
  'docs/reference/COMPATIBILITY.md',
  'THIRD_PARTY.md'
];

const missing = required.filter((path) => !fs.existsSync(path));
if (missing.length) {
  console.error('AURA structure verification failed. Missing:');
  for (const path of missing) console.error(`- ${path}`);
  process.exit(1);
}

console.log(`AURA structure verification passed (${required.length} required artifacts).`);
