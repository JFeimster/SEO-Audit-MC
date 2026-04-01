# Wix CMS Wave 1 Import Checklist

Use this checklist for a Wave 1-only import using the pre-filtered `batch_01` bundle files.

## Scope

- Family: `industry_pages`
- Wave: `batch_01`
- Slugs:
  - `wix-seller-financing`
  - `ecommerce-business-funding`
  - `restaurant-funding`
  - `trucking-funding`
  - `construction-contractor-funding`

## Wave 1 Bundle Files

- `data/wix_wave1_industryPages_seed.csv` (5 rows)
- `data/wix_wave1_industryFaqs_seed.csv` (20 rows)
- `data/wix_wave1_industryModules_seed.csv` (15 rows)
- `data/wix_wave1_industryLinks_seed.csv` (15 rows)

## Pre-Import Checks

1. Run `npm run verify:wix`.
2. Confirm `reports/wix-industry-implementation-verification.md` shows `Errors: 0`.
3. Confirm all five Wave 1 rows are still `status = drafting` in `wix_wave1_industryPages_seed.csv`.

## Import Order (Wave 1)

1. Import `wix_wave1_industryPages_seed.csv` into `industryPages`.
2. Import `wix_wave1_industryFaqs_seed.csv` into `industryFaqs`.
3. Import `wix_wave1_industryModules_seed.csv` into `industryModules`.
4. Import `wix_wave1_industryLinks_seed.csv` into `industryLinks`.

Do not publish during import.

## Reference Resolution (Required)

1. In each supporting collection (`industryFaqs`, `industryModules`, `industryLinks`), filter by each Wave 1 `industrySlug`.
2. Set `industryPageRef` to the matching `industryPages.slug` item.
3. Keep `isActive = true` only where content is ready to render.

## Required Before QA Advancement

1. Upload and bind required media:
   - `heroImage`
   - `ogImage`
2. Confirm `heroImageAlt` is present and specific for each slug.
3. Populate `data/keyword_clusters.csv` rows for all five Wave 1 primary keywords.
4. Log each import and mapping step in `data/wix_changes.csv`.

## QA Gate Sequence

Set these booleans in order for each Wave 1 row:

1. `metadataApproved = true`
2. `schemaApproved = true`
3. `linksApproved = true`
4. `disclosureApproved = true`
5. `contentApproved = true`
6. `qaPass = true`
7. `publishReady = true`

Only then move lifecycle state:

`ready_for_qa -> qa_passed -> publish_approved -> scheduled -> published`

## Post-Import Validation

1. Re-run `npm run verify:wix`.
2. Confirm no regression in required link types (`service_page`, `trust_page`, `sibling_industry`).
3. Confirm `/industries/construction-contractor-funding` sibling remains Wave 1-safe:
   - `/industries/wix-seller-financing`
