import fs from 'node:fs/promises';
import path from 'node:path';
import {
  WORKSPACES,
  WORKSPACE_BY_NAME,
  detectCycles,
  parseAuraSpecifier,
  validateInternalEdge
} from './architecture-rules.mjs';

const root = process.cwd();
const sourceExtensions = new Set(['.ts', '.tsx', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs']);
const internalFields = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
const violations = [];

function addViolation(message) {
  violations.push(message);
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

async function listSourceFiles(directory) {
  const files = [];

  async function walk(current) {
    let entries;
    try {
      entries = await fs.readdir(current, { withFileTypes: true });
    } catch (error) {
      if (error?.code === 'ENOENT') return;
      throw error;
    }

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== 'dist') await walk(fullPath);
      } else if (sourceExtensions.has(path.extname(entry.name))) {
        files.push(fullPath);
      }
    }
  }

  await walk(directory);
  return files;
}

function collectSpecifiers(source) {
  const specifiers = new Set();
  const patterns = [
    /(?:import|export)\s+(?:type\s+)?(?:[^'";]*?\s+from\s+)?['"]([^'"]+)['"]/g,
    /import\(\s*['"]([^'"]+)['"]\s*\)/g,
    /require\(\s*['"]([^'"]+)['"]\s*\)/g
  ];

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) specifiers.add(match[1]);
  }

  return [...specifiers];
}

function workspaceContaining(absolutePath) {
  const normalized = path.resolve(absolutePath);

  for (const workspace of WORKSPACES) {
    const workspaceRoot = path.resolve(root, workspace.dir);
    if (normalized === workspaceRoot || normalized.startsWith(`${workspaceRoot}${path.sep}`)) {
      return workspace;
    }
  }

  return null;
}

const packageJsonByName = new Map();
const manifestGraph = new Map();
const importGraph = new Map();

for (const workspace of WORKSPACES) {
  const manifestPath = path.join(root, workspace.dir, 'package.json');
  const manifest = await readJson(manifestPath);

  if (manifest.name !== workspace.name) {
    addViolation(`${workspace.dir}/package.json must be named ${workspace.name}, found ${manifest.name ?? '<missing>'}`);
  }

  packageJsonByName.set(workspace.name, manifest);
  manifestGraph.set(workspace.name, new Set());
  importGraph.set(workspace.name, new Set());

  for (const field of internalFields) {
    for (const [dependencyName, version] of Object.entries(manifest[field] ?? {})) {
      if (!dependencyName.startsWith('@aura/')) continue;

      if (!WORKSPACE_BY_NAME.has(dependencyName)) {
        addViolation(`${workspace.name} declares unknown internal dependency ${dependencyName}`);
        continue;
      }

      if (typeof version !== 'string' || !version.startsWith('workspace:')) {
        addViolation(`${workspace.name} -> ${dependencyName} must use a workspace: version`);
      }

      const edgeViolation = validateInternalEdge(workspace.name, dependencyName);
      if (edgeViolation) addViolation(`Manifest boundary: ${edgeViolation}`);
      manifestGraph.get(workspace.name).add(dependencyName);
    }
  }
}

for (const cycle of detectCycles(manifestGraph)) {
  addViolation(`Manifest dependency cycle: ${cycle.join(' -> ')}`);
}

for (const workspace of WORKSPACES) {
  const manifest = packageJsonByName.get(workspace.name);
  const declaredInternal = new Set(
    internalFields.flatMap((field) => Object.keys(manifest[field] ?? {})).filter((name) => name.startsWith('@aura/'))
  );

  const sourceRoot = path.join(root, workspace.dir, 'src');
  for (const filePath of await listSourceFiles(sourceRoot)) {
    const source = await fs.readFile(filePath, 'utf8');
    const relativeFile = path.relative(root, filePath);

    for (const specifier of collectSpecifiers(source)) {
      const aura = parseAuraSpecifier(specifier);
      if (aura) {
        if (!WORKSPACE_BY_NAME.has(aura.packageName)) {
          addViolation(`${relativeFile}: unknown AURA import ${specifier}`);
          continue;
        }

        if (aura.deepImport) {
          addViolation(`${relativeFile}: deep import is forbidden (${specifier}); import only from ${aura.packageName}`);
        }

        const edgeViolation = validateInternalEdge(workspace.name, aura.packageName);
        if (edgeViolation) addViolation(`${relativeFile}: ${edgeViolation}`);

        if (workspace.name !== aura.packageName) {
          importGraph.get(workspace.name).add(aura.packageName);
          if (!declaredInternal.has(aura.packageName)) {
            addViolation(`${relativeFile}: ${aura.packageName} is imported but not declared in ${workspace.dir}/package.json`);
          }
        }

        continue;
      }

      if (specifier.startsWith('.')) {
        const resolved = path.resolve(path.dirname(filePath), specifier);
        const targetWorkspace = workspaceContaining(resolved);
        if (targetWorkspace && targetWorkspace.name !== workspace.name) {
          addViolation(
            `${relativeFile}: relative import crosses workspace boundary into ${targetWorkspace.name} (${specifier})`
          );
        }
      }
    }
  }
}

for (const cycle of detectCycles(importGraph)) {
  addViolation(`Source import cycle: ${cycle.join(' -> ')}`);
}

if (violations.length > 0) {
  console.error(`AURA architecture verification failed (${violations.length} violation${violations.length === 1 ? '' : 's'}):`);
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log(`AURA architecture verification passed (${WORKSPACES.length} workspaces checked).`);
