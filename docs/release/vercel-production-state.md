# Observed Vercel production state

Read-only inspection on 2026-11-06 UTC used the connected Vercel project/domain/deployment tools, CLI 65.2.0 `project inspect`, and the project/deployment REST responses. No branch tracking, alias, domain, environment variable, protection setting or deployment was changed. CLI project context was initially unlinked; inspection used explicit project `biblemap` and scope `elliotandersons-projects`, without linking.

| Item | Observed value |
|---|---|
| Project | `biblemap`, `prj_xKJkC8WBUusxhsDXO4jjcJ7zlc2m` |
| Team | `elliotandersons-projects`, `team_xtntWPJwjGlK9FNNQy9sGESp` |
| Connected Git repository | GitHub `jayjz/biblemap`, repository ID `1175601800` |
| Production branch | **`main`**, from `link.productionBranch` |
| Public domain | `biblemap-pink.vercel.app`, verified; no domain-specific Git branch or custom environment |
| Domain/production target deployment | `dpl_4hQwNWXRLa2WCdSaDcBbfjnd9WFq` |
| Immutable URL | `https://biblemap-gv2zljtjo-elliotandersons-projects.vercel.app` |
| Serving revision | **`e92b476729303cf00cf71f409c9cc64841ddf447`**, `feat/home-story-discovery` |
| Environment/state | `target: production`, `READY`, `readySubstate: PROMOTED` |
| Automatic domain assignment | `autoAssignCustomDomains: true`; current domain is in `targets.production.alias` |
| Most recent consolidated preview observed after #44 | `dpl_8qmmBGb6akAYziqzHYnqmPXqbGmB`, `fbe2608`, target null/preview, `STAGED` |
| Runtime/build | Next.js preset, Node 24.x, root `.`; build command defaults to `npm run build`/`next build` |

The project targets confirm a promoted feature artifact serves production despite `main` tracking. This is stronger evidence than the old README's branch inference. The records do not establish who requested promotion or whether additional manual alias operations occurred historically. Those historical actions would require the team's activity/audit log; they are not inferred from a commit author or alias creator.

With the observed Git tracking and automatic domain assignment, a successful new `main` production deployment is configured to update the public domain. This release branch's pending-decision guard prevents its code from completing a production-target build without creator acceptance, but it cannot retroactively guard the old `main` code or prevent a privileged manual promotion. Do not merge #41 as a production-release shortcut.

Official references: [Git branch deployments](https://vercel.com/docs/git), [promotion](https://vercel.com/docs/deployments/promoting-a-deployment), [rollback CLI](https://vercel.com/docs/cli/rollback), [alias guidance](https://vercel.com/docs/cli/alias).

## Verification before any separately authorized production change

Run these read-only commands with the same team and inspect the returned Git refs, SHA, target and aliases. Save sanitized results; do not retain credentials or full project environment records in the repository.

```powershell
vercel project inspect biblemap --scope elliotandersons-projects --non-interactive
vercel api /v9/projects/biblemap --scope elliotandersons-projects
vercel api /v4/aliases/biblemap-pink.vercel.app --scope elliotandersons-projects
vercel inspect biblemap-pink.vercel.app --scope elliotandersons-projects --json
vercel api '/v6/deployments?projectId=prj_xKJkC8WBUusxhsDXO4jjcJ7zlc2m&target=production&limit=5' --scope elliotandersons-projects
```

Use the deployment ID resolved from the alias to retrieve `/v13/deployments/<id>`. Before accepting a new production artifact, compare its exact Git/content/artifact identity with the reviewed release record; verify homepage, Thomas narrative/reading/sayings, James, Perpetua, Romanus, Jonah, Nineveh, Atlas/legacy links, keyboard/mobile behavior and local worker/media responses. Verify excluded markers are absent from actual hosted HTML, RSC, JS, JSON and asset URLs, and check errors/network failures. An HTTP 200 or a production label alone is insufficient. These future production smoke tests were not executed as a release during this run.

## Rollback targets and executable recovery procedure

The project uses Hobby. The observed production list marked both the active `dpl_4hQwNWXRLa2WCdSaDcBbfjnd9WFq` and immediately previous **`dpl_3RePRxky3rYTSFAzy7XtmhfFSioW`** eligible. The previous deployment is `https://biblemap-7ovb6mgir-elliotandersons-projects.vercel.app`, revision `b452100c3e14428419ab3662449794a6b312cd96`, branch `feat/romanus-voice`.

The older `main`/Nineveh deployment `dpl_HZ92yoxrEAZeji5vcrq8SyMjBqUP` (`60ecbda`) was **not** an eligible instant rollback target. Do not promise rollback to that artifact on this plan. Vercel documents Hobby rollback as limited to the previous production deployment.

After a future single production release, recheck eligibility: today's active `dpl_4hQwNWXRLa2WCdSaDcBbfjnd9WFq` should be the immediate previous target. Only with separate incident/release authorization, run:

```powershell
vercel inspect dpl_4hQwNWXRLa2WCdSaDcBbfjnd9WFq --scope elliotandersons-projects --json
vercel rollback dpl_4hQwNWXRLa2WCdSaDcBbfjnd9WFq --scope elliotandersons-projects --yes
vercel rollback status biblemap --scope elliotandersons-projects
vercel inspect biblemap-pink.vercel.app --scope elliotandersons-projects --json
```

If recovering from the currently observed artifact instead, the currently eligible previous target is `dpl_3RePRxky3rYTSFAzy7XtmhfFSioW`; verify it before substituting that ID. Then compare the domain's resolved deployment/SHA and repeat navigation/media/worker smoke tests. Rollback eligibility and domain bindings must be refreshed immediately before acting. Rollback/promote/alias commands were **not run**. Promotion to resume later automatic production flow is a separate authorized action, not an automatic follow-up in this checkpoint.
