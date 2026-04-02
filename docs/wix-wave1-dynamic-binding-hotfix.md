# Wix Wave 1 Dynamic Binding Hotfix

Snapshot date: `2026-04-01`
Site: `Moonshine Capital` (`metaSiteId: cc61a0cb-edcd-43dc-bdda-42c76443dcd6`)

## Blocking Condition

Wave 1 cannot be re-advanced to `publish_approved` until the dynamic page/template SEO bindings in Wix Editor are corrected and live verification passes (`npm run verify:wix:live` returns `Errors: 0`).

Latest live verification: `reports/wix-wave1-live-binding-verification.md` (`Errors: 16`, `Warnings: 5`).
Latest API remediation status: `industryPages` now has collection-defined `PAGE_LINK` fields (`/industries/{slug}`, `/industries/`) and `PUBLISH` plugin enabled, but live router/output is unchanged.

## Root Cause Evidence (2026-04-01)

- Live viewer router config does not include an `industries` dynamic router prefix.
- Invalid slug probe (`/industries/not-a-real-industry-slug-zz`) resolves as `200` with the same live page object as valid Wave 1 slugs.
- Current live `/industries/*` responses fingerprint to `pageId=cp4jk` under `appDefinitionId=e593b0bd-b783-45b8-97c2-873d42aacaf4`, which helps identify the fallback/static page currently serving these URLs.
- Data-level fixes are already in place (`industryPages.link-industry-pages-title`, `industryPages.link-industry-pages-all`, `_publishStatus=PUBLISHED`) and still do not produce dynamic router activation.
- This indicates `/industries/*` is currently serving a static/fallback page pattern instead of item-level `industryPages` dynamic routing.

## Editor Entry Point

Use this editor URL for direct fix work:

`https://editor.wix.com/html/editor/web/renderer/edit/397cd6a3-8120-4723-8290-c03a073958ae?metaSiteId=cc61a0cb-edcd-43dc-bdda-42c76443dcd6`

If prompted, sign in with the site owner account that has edit permissions.

## Exact Fix Steps (Do Not Skip)

1. In Content Manager -> Dynamic Pages, confirm `industryPages` has an active **item** dynamic page route with prefix `industries` and pattern `/industries/{slug}`.
2. Remove or disable any static/fallback page behavior that causes unknown `/industries/*` slugs to render the same page.
3. Open the dynamic item page intended for `industryPages` and confirm dataset source is `industryPages` (not a static fallback page).
4. In page SEO settings, bind each field to CMS values:
   - title -> `seoTitle`
   - meta description -> `metaDescription`
   - canonical -> `canonicalUrl`
   - og title -> `ogTitle`
   - og description -> `ogDescription`
   - og image -> `ogImage`
   - robots -> `robotsDirective`
5. In template content bindings, confirm:
   - H1 -> `h1`
   - hero headline -> `heroHeadline`
   - hero subhead -> `heroSubhead`
6. Confirm all repeaters still filter by:
   - `industryPageRef = current item`
   - `isActive = true`
7. Publish the site changes.

## Operator Value Sheet

Use generated Wave 1 binding values:

- `reports/wix-wave1-editor-binding-sheet.csv`
- `reports/wix-wave1-editor-binding-sheet.md`

Generate or refresh values with:

`npm run wix:wave1:bindings`

## Verification Sequence (Required)

1. `npm run verify:wix`
2. `npm run verify:wix:router`
3. `npm run verify:wix:live`

Only if all three pass with no blocking errors:

1. Set booleans for each Wave 1 row:
   - `metadataApproved=true`
   - `schemaApproved=true`
   - `linksApproved=true`
   - `disclosureApproved=true`
   - `contentApproved=true`
   - `qaPass=true`
   - `publishReady=true`
2. Advance lifecycle:
   - `ready_for_qa -> qa_passed -> publish_approved`
3. Log each status change in `data/wix_changes.csv`.
