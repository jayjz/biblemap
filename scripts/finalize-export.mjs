// next/navigation notFound() emits error HTML in a static export. Remove denied
// route artifacts so static hosts return a real 404 rather than a soft-404 200.
import { rmSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import scope from '../docs/release/publication-scope.json' with { type: 'json' };
const root = resolve('out');
for (const { route, maturity } of scope.routes) {
  if (maturity === 'complete' || maturity === 'provisional') continue;
  if (route === '/demo/' && process.env.BIBLEMAP_INTERNAL_REVIEW === '1') continue;
  if (route === '/experiments/nineveh/' && process.env.BIBLEMAP_NINEVEH_REVIEW === '1') continue;
  const target = resolve(root, `.${route}`);
  if (target === root || !target.startsWith(root + sep)) throw new Error(`Unsafe excluded route: ${route}`);
  rmSync(target, { recursive: true, force: true });
  console.log(`Excluded static route: ${route}`);
}
// The framework's duplicate error page is otherwise served as HTTP 200 by
// static hosts. Keep 404.html for host error handling; remove this public alias.
const frameworkError = resolve(root, '_not-found');
if (!frameworkError.startsWith(root + sep)) throw new Error('Unsafe framework error path');
rmSync(frameworkError, { recursive: true, force: true });
