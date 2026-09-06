export const WORKSPACES = [
  {
    name: '@aura/core',
    dir: 'apps/aura-core',
    allowedInternalDependencies: [
      '@aura/domain',
      '@aura/observability',
      '@aura/persistence',
      '@aura/polaris',
      '@aura/protocol',
      '@aura/runtime'
    ]
  },
  {
    name: '@aura/domain',
    dir: 'packages/domain',
    allowedInternalDependencies: []
  },
  {
    name: '@aura/protocol',
    dir: 'packages/protocol',
    allowedInternalDependencies: []
  },
  {
    name: '@aura/polaris',
    dir: 'packages/polaris',
    allowedInternalDependencies: ['@aura/protocol']
  },
  {
    name: '@aura/runtime',
    dir: 'packages/runtime',
    allowedInternalDependencies: ['@aura/domain']
  },
  {
    name: '@aura/persistence',
    dir: 'packages/persistence',
    allowedInternalDependencies: ['@aura/domain']
  },
  {
    name: '@aura/observability',
    dir: 'packages/observability',
    allowedInternalDependencies: []
  }
];

export const WORKSPACE_BY_NAME = new Map(
  WORKSPACES.map((workspace) => [workspace.name, workspace])
);

export function parseAuraSpecifier(specifier) {
  if (!specifier.startsWith('@aura/')) return null;

  const parts = specifier.split('/');
  if (parts.length < 2) return null;

  return {
    packageName: `${parts[0]}/${parts[1]}`,
    deepImport: parts.length > 2
  };
}

export function validateInternalEdge(fromName, toName) {
  if (fromName === toName) return null;

  const from = WORKSPACE_BY_NAME.get(fromName);
  const to = WORKSPACE_BY_NAME.get(toName);

  if (!from) return `Unknown AURA source workspace: ${fromName}`;
  if (!to) return `Unknown AURA target workspace: ${toName}`;

  if (!from.allowedInternalDependencies.includes(toName)) {
    return `${fromName} must not depend on ${toName}`;
  }

  return null;
}

export function detectCycles(graph) {
  const visited = new Set();
  const active = new Set();
  const stack = [];
  const cycles = [];
  const seen = new Set();

  function visit(node) {
    if (active.has(node)) {
      const start = stack.indexOf(node);
      const cycle = [...stack.slice(start), node];
      const canonical = cycle.join(' -> ');
      if (!seen.has(canonical)) {
        seen.add(canonical);
        cycles.push(cycle);
      }
      return;
    }

    if (visited.has(node)) return;

    visited.add(node);
    active.add(node);
    stack.push(node);

    for (const target of graph.get(node) ?? []) visit(target);

    stack.pop();
    active.delete(node);
  }

  for (const node of graph.keys()) visit(node);
  return cycles;
}
