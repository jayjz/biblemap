# Deployment Investigation - BibleMap Pages

## Issue Reported
Site https://biblemap.pages.dev is BROKEN with "S.Ay is not a constructor" TDZ error

## Root Cause Analysis

### Webpack Minification TDZ (Temporal Dead Zone)
**Root Cause:** Next.js 15 static export with Webpack 5 aggressive minification causes TDZ when:
1. Module evaluation order places minified globals (Map, Set) before their initialization
2. `useState(new Map())` executes during module evaluation, not component render
3. Webpack's `concatenateModules` optimization inlines modules in problematic order
4. Minified code like `new S.Ay()` (where `S.Ay = Map`) fails if `S` isn't initialized yet

**Why Previous Fixes (5581791, 62238b2) Weren't Sufficient:**
- Lazy initializers were applied but Webpack's aggressive bundling still caused issues
- Cache busting with `Date.now()` alone insufficient for edge networks (Cloudflare/Vercel)
- No runtime safeguard for users with stale cached bundles

### Complete Solution (2026-05-21)

#### 1. Lazy Initializers (Already Applied ✅)
All useState with Map/Set converted to lazy form:
```typescript
// ❌ BAD: Evaluates during module init, causes TDZ
useState(new Map())

// ✅ GOOD: Lazy evaluation, prevents TDZ
useState(() => new Map())  // Lazy initializer prevents Webpack TDZ
```
**Files:** `src/components/DataLoader.tsx` lines 722-725

#### 2. Enhanced Cache Busting
**Before:** `generateBuildId: () => Date.now().toString()`
**After:** Git SHA + timestamp ensures unique builds
```javascript
generateBuildId: async () => {
  const { execSync } = await import('child_process');
  const sha = execSync('git rev-parse --short HEAD').toString().trim();
  return `${sha}-${Date.now()}`;
}
```

#### 3. Webpack Optimization Fix
```javascript
config.optimization = {
  ...config.optimization,
  concatenateModules: false, // Prevents aggressive inlining that causes TDZ
};
```

#### 4. Production Error Boundary
Detects "is not a constructor" errors and auto-reloads with cache bypass:
- Shows "Cache cleared — reloading..." UI
- Forces `window.location.reload()` after 2 seconds
- Handles stale bundle edge case gracefully

## Investigation Results (Historical)

### 1. Code Status: ✅ CORRECT
File: `src/components/DataLoader.tsx`
Lines 722-725 contain CORRECT lazy initializers (verified 2026-05-21).

### 2. Git History
- Commit 5581791: Applied initial fix for TDZ error
- Commit 62238b2: Force cache-busting redeploy
- Commit 37979ed: Content expansion + build ID cache busting
- **NEW:** Commit [pending]: Comprehensive TDZ fix with webpack + error boundary

### 3. Build Status: ✅ SUCCESS
Local build verification:
```
✓ Compiled successfully
✓ Generating static pages (4/4)
✓ Static export complete
```

### 4. Verification Steps

**Check Vercel/Cloudflare Deployment:**
```bash
# 1. Verify build ID in deployment logs
# Should show format: <git-sha>-<timestamp>

# 2. Curl JS bundle and verify lazy pattern
curl -s https://biblemap.pages.dev/_next/static/chunks/pages/_app-*.js | grep -o "useState.*new Map" | head -5
# Should find NOTHING (lazy form doesn't contain this pattern in bundle)

# 3. Verify concatenateModules is disabled
# Check build output for "concatenateModules: false"
```

**Browser DevTools Verification:**
1. Open site with DevTools Network tab
2. Disable cache, hard reload (Cmd+Shift+R)
3. Check JS bundles load without "is not a constructor" errors
4. Verify ErrorBoundary doesn't trigger on fresh load

## Deployment Checklist

For Vercel/Cloudflare Pages:
- [ ] Clear build cache before deploy
- [ ] Verify `NODE_ENV=production`
- [ ] Check build logs confirm new build ID format
- [ ] Test in incognito window (no cache)
- [ ] Monitor ErrorBoundary logs for constructor errors
- [ ] Verify static export completes: `out/` directory generated

## References
- Next.js Issue: https://github.com/vercel/next.js/issues/55891
- Webpack concatenateModules: https://webpack.js.org/configuration/optimization/#optimizationconcatenatemodules
- Temporal Dead Zone: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cant_access_lexical_declaration_before_init

