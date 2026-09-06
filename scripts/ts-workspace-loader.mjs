import fs from 'node:fs';
import path from 'node:path';

export async function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith('.js')) {
    const candidate = path.resolve(path.dirname(new URL(context.parentURL).pathname), `${specifier.slice(0, -3)}.ts`);
    if (fs.existsSync(candidate)) return nextResolve(new URL(`file://${candidate}`).href, context);
  }
  return nextResolve(specifier, context);
}
