import fs from 'node:fs';

const checks = [];
const add = (name, ok, detail = '') => checks.push({ name, ok, detail });

const major = Number(process.versions.node.split('.')[0]);
add('Node 24 LTS', major === 24, `detected ${process.versions.node}`);

for (const path of [
  'AGENTS.md',
  'docs/CURRENT.md',
  'docs/INDEX.md',
  'docs/architecture/OVERVIEW.md',
  'docs/roadmap/FOUNDATION.md',
  'docs/decisions/README.md'
]) {
  add(path, fs.existsSync(path));
}

console.log('Project AURA — doctor\n');
for (const check of checks) {
  console.log(`${check.ok ? '✓' : '✗'} ${check.name}${check.detail ? ` — ${check.detail}` : ''}`);
}

const failed = checks.filter((check) => !check.ok);
if (failed.length) {
  console.error(`\n${failed.length} check(s) failed.`);
  process.exit(1);
}

console.log('\nFoundation repository checks passed.');
