# Deployment Investigation - BibleMap Pages

## Issue Reported
Site https://biblemap.pages.dev is BROKEN with "S.Ay is not a constructor" TDZ error

## Investigation Results

### 1. Code Status: ✅ CORRECT
File: `src/components/DataLoader.tsx`
Lines 532-535 contain CORRECT lazy initializers:
```typescript
const [loadedChunks, setLoadedChunks] = useState<Map<number, Table>>(() => new Map());
const [loadingChunks, setLoadingChunks] = useState<Set<number>>(() => new Set());
const [chunkErrors, setChunkErrors] = useState<Map<number, string>>(() => new Map());
const [retryCount, setRetryCount] = useState<Map<number, number>>(() => new Map());
```

### 2. Git History
- Commit 5581791 (2026-05-17 19:47:27): Applied fix for TDZ error
- Commit a87f480 (HEAD): Latest commit with content additions
- Remote origin IS up to date with local

### 3. Build Status: ✅ SUCCESS
```
✓ Compiled successfully in 31.9s
✓ Generating static pages (4/4)
Build complete with chunked data
Exit code: 0
```

### 4. Deployment Verification: ❌ MISMATCH
**CRITICAL FINDING:** The deployed site at https://biblemap.pages.dev is NOT serving the Next.js application.

**Actual deployed content:**
- Title: "简明圣经史地图解" (Concise Bible History Map)
- Generator: GitBook 3.2.3
- Type: Static GitBook documentation site
- Assets: gitbook/style.css, gitbook plugins

**Expected content:**
- Next.js 16.1.6 application
- React components with DataLoader
- Interactive Bible map with deck.gl

### 5. Root Cause
The Cloudflare Pages project `biblemap.pages.dev` is deploying content from a DIFFERENT source than the repository at `github.com/jayjz/biblemap`.

Possible causes:
1. Cloudflare Pages connected to wrong repository
2. Cloudflare Pages connected to wrong branch
3. Build configuration outputs to wrong directory
4. Domain pointing to different Pages project
5. Recent configuration change deployed GitBook content

### 6. Recommended Actions
1. Check Cloudflare Pages dashboard for `biblemap` project
2. Verify connected repository: should be `jayjz/biblemap`
3. Verify production branch: should be `main`
4. Verify build settings:
   - Build command: `npm run build`
   - Build output directory: `out` or `.next` (depending on export mode)
5. Check deployment history for recent changes
6. Verify DNS settings for biblemap.pages.dev

### 7. Code Verification Complete
No code changes needed - the TDZ fix is already in place and verified working in local build.
