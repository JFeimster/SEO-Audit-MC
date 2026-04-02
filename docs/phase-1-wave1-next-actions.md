# Phase 1 Wave 1 Execution Next Actions

Snapshot date: `2026-04-01`
Scope: `industry_pages` Wave 1 only (`batch_01`)

## Current Execution Snapshot

- Source tracker: `data/phase1_wave1_execution_tracking.csv`
- Seed verifier report: `reports/wix-industry-implementation-verification.md`
- Live binding verifier report: `reports/wix-wave1-live-binding-verification.md`
- Dynamic binding hotfix runbook: `docs/wix-wave1-dynamic-binding-hotfix.md`
- Wave 1 editor value sheet: `reports/wix-wave1-editor-binding-sheet.csv`
- Latest execution cycle (`2026-04-01 18:07 ET`):
  - `npm run verify:wix`: `Errors: 0`, `Warnings: 0`
  - `npm run verify:wix:router`: `FAIL` (missing `industries` dynamic router prefix)
  - `npm run verify:wix:live`: `Errors: 16`, `Warnings: 5`
  - `npm run verify`: `PASS`
- Latest republish run (`POST https://www.wixapis.com/site-publisher/v1/site/publish` on `2026-04-01`): `completed`, verifier results unchanged (`verify:wix:router` fail, `verify:wix:live` Errors `16`/Warnings `5`)
- Latest Wix API capability check (`2026-04-01`): no REST endpoint found to directly write dynamic route/template SEO bindings for `/industries/{slug}`; fix must be completed in Wix Editor UI.
- Latest schema-level remediation attempt (`2026-04-01`): added `industryPages` PAGE_LINK fields (`/industries/{slug}` and `/industries/`) plus `PUBLISH` plugin, published site twice, and re-ran gates; live results remained unchanged (`verify:wix:router` fail, `verify:wix:live` Errors `16`/Warnings `5`).
- Wave 1 slugs tracked: `5`
- Slugs with import evidence in `data/wix_changes.csv`: `5/5`
- Slugs with supporting `industryPageRef` resolved in Wix: `5/5` (`20 FAQ + 15 module + 15 link rows`)
- Slugs with required media bound (`heroImage`, `ogImage`): `5/5`
- Slugs rolled back to `ready_for_qa` after live-binding gate failure: `5/5`

## Active Blockers (Wave 1)

1. Live SEO binding mismatch on all 5 slugs:
   - public `<title>`, `meta description`, and `og:title` do not match Wave 1 CMS seed values.
2. Live content binding signal mismatch on 4 slugs:
   - expected Wave 1 hero/H1 signals are not present in public HTML for:
     - `ecommerce-business-funding`
     - `restaurant-funding`
     - `trucking-funding`
     - `construction-contractor-funding`
3. Lifecycle gate rollback applied to prevent premature scheduling:
   - `metadataApproved=false`, `qaPass=false`, `publishReady=false`
   - `status=ready_for_qa`
   - blocker reason recorded on each Wave 1 `industryPages` row.
4. Platform automation limit:
   - Wix REST APIs available to this workflow do not expose a direct write endpoint for dynamic route/template SEO bindings, so correction must be completed in Wix Editor UI before re-verification.
5. Branch state confirmation:
   - default branch is `Original-Branch` and publish actions target it; no alternate active branch explains the mismatch.
6. CMS value confirmation:
   - `industryPages` records for all Wave 1 slugs already contain expected SEO/content fields; remaining blocker is route/template binding on live dynamic page output.
7. Controlled marker test confirmation:
   - temporary marker update on `ecommerce-business-funding` SEO fields did not change live output after publish, confirming `/industries/*` live route is not bound to `industryPages` SEO fields yet.
8. Re-publish + branch recheck confirmation:
   - branch query still shows `Original-Branch` as default/active and recently updated, but live metadata output is unchanged after republish, so Wave 1 remains blocked at template binding level.
9. Router-level root cause confirmation:
   - live `wix-viewer-model` router config does not include an `industries` dynamic router prefix.
   - invalid slug probe (`/industries/not-a-real-industry-slug-zz`) returns `200` and resolves to the same page object as valid slugs, confirming static/fallback routing behavior rather than item-level dynamic routing.
10. Data-level readiness confirmation:
   - `industryPages` now includes collection-defined page-link fields and publish plugin metadata.
   - all Wave 1 rows are `_publishStatus=PUBLISHED` and expose expected link values (for example `/industries/wix-seller-financing`), but live router/template output still does not switch to item-level dynamic mode.

## Next Actions (Execution Order)

1. Recreate/repair the `industryPages` dynamic item route in Wix Editor (use `docs/wix-wave1-dynamic-binding-hotfix.md`):
   - ensure dynamic router prefix exists as `industries`.
   - ensure item route is `/industries/{slug}` and resolves item-level records from `industryPages`.
2. Fix dynamic page/template bindings in Wix Editor:
   - ensure route `/industries/{slug}` is bound to the intended dataset item for each slug.
   - ensure SEO bindings map correctly from CMS fields:
     - `seoTitle` -> page title
     - `metaDescription` -> meta description
     - `ogTitle` -> OG title
3. Republish the dynamic template/page changes in Wix (`Original-Branch`).
4. Re-run:
   - `npm run verify:wix`
   - `npm run verify:wix:router`
   - `npm run verify:wix:live`
5. Only after live verifier returns `Errors: 0` and router verifier passes:
   - set `metadataApproved=true`, `qaPass=true`, `publishReady=true`
   - advance lifecycle:
     - `ready_for_qa -> qa_passed -> publish_approved`
6. Log each status change in `data/wix_changes.csv` before any scheduling/publish action.
