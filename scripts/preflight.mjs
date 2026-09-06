import fs from 'node:fs';
import path from 'node:path';

const terms = process.argv.slice(2).filter((value) => value !== '--').map((value) => value.toLowerCase());
if (!terms.length) {
  console.error('Usage: pnpm preflight -- <task keywords>');
  process.exit(1);
}

const roots = ['docs', 'apps', 'packages', '.agents'];
const ignored = new Set(['node_modules', '.git', 'dist', 'coverage']);
const matches = [];

function walk(current) {
  if (!fs.existsSync(current)) return;
  const stat = fs.statSync(current);
  if (stat.isDirectory()) {
    if (ignored.has(path.basename(current))) return;
    for (const child of fs.readdirSync(current)) walk(path.join(current, child));
    return;
  }
  if (!/\.(md|ts|mts|json|ya?ml)$/i.test(current)) return;
  const text = fs.readFileSync(current, 'utf8').toLowerCase();
  const score = terms.reduce((sum, term) => sum + (text.includes(term) || current.toLowerCase().includes(term) ? 1 : 0), 0);
  if (score) matches.push({ current, score });
}

for (const root of roots) walk(root);

matches.sort((a, b) => b.score - a.score || a.current.localeCompare(b.current));
console.log(`Project AURA preflight: ${terms.join(' ')}\n`);
if (!matches.length) {
  console.log('No local matches yet. Check docs/INDEX.md and current GitHub issues before creating a new mechanism.');
  process.exit(0);
}
for (const match of matches.slice(0, 25)) console.log(`- ${match.current}`);
