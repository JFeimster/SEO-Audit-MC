# Wix Wave 1 Dynamic Binding Hotfix

Snapshot date: `2026-04-01`
Site: `Moonshine Capital` (`metaSiteId: cc61a0cb-edcd-43dc-bdda-42c76443dcd6`)

## Blocking Condition

Wave 1 cannot be re-advanced to `publish_approved` until the dynamic page/template SEO bindings in Wix Editor are corrected and live verification passes (`npm run verify:wix:live` returns `Errors: 0`).

Latest live verification: `reports/wix-wave1-live-binding-verification.md` (`Errors: 15`, `Warnings: 4`).

## Editor Entry Point

Use this editor URL for direct fix work:

`https://editor.wix.com/html/editor/web/renderer/edit/397cd6a3-8120-4723-8290-c03a073958ae?metaSiteId=cc61a0cb-edcd-43dc-bdda-42c76443dcd6`

If prompted, sign in with the site owner account that has edit permissions.

## Exact Fix Steps (Do Not Skip)

1. Open the dynamic item page intended for `industryPages` and confirm route pattern is `/industries/{slug}`.
2. Confirm the page dataset source is `industryPages` (not a static fallback page).
3. In page SEO settings, bind each field to CMS values:
   - title -> `seoTitle`
   - meta description -> `metaDescription`
   - canonical -> `canonicalUrl`
   - og title -> `ogTitle`
   - og description -> `ogDescription`
   - og image -> `ogImage`
   - robots -> `robotsDirective`
4. In template content bindings, confirm:
   - H1 -> `h1`
   - hero headline -> `heroHeadline`
   - hero subhead -> `heroSubhead`
5. Confirm all repeaters still filter by:
   - `industryPageRef = current item`
   - `isActive = true`
6. Publish the site changes.

## Operator Value Sheet

Use generated Wave 1 binding values:

- `reports/wix-wave1-editor-binding-sheet.csv`
- `reports/wix-wave1-editor-binding-sheet.md`

Generate or refresh values with:

`npm run wix:wave1:bindings`

## Verification Sequence (Required)

1. `npm run verify:wix`
2. `npm run verify:wix:live`

Only if both pass with no blocking errors:

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

