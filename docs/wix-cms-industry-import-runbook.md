# Wix CMS Industry Import Runbook

Use this runbook to execute the first CMS import for Phase 1 industry pages.

## Generated Seed Files

Run:

```bash
npm run wix:seed
```

This creates:

- `data/wix_industryPages_seed.csv`
- `data/wix_industryFaqs_seed.csv`
- `data/wix_industryModules_seed.csv`
- `data/wix_industryLinks_seed.csv`

Then run:

```bash
npm run verify:wix
```

and confirm the report shows `Errors: 0` before importing.

## Import Order (Exact)

1. Import `wix_industryPages_seed.csv` into collection `industryPages`.
2. Import `wix_industryFaqs_seed.csv` into `industryFaqs`.
3. Import `wix_industryModules_seed.csv` into `industryModules`.
4. Import `wix_industryLinks_seed.csv` into `industryLinks`.

Do not publish any dynamic industry page during import.

## Reference Resolution Step

`industryFaqs`, `industryModules`, and `industryLinks` include:

- `industrySlug` (filled with normalized slug key, for example `restaurant-funding`)
- `industryPageRef` (blank by design)

After importing:

1. In Wix CMS, filter each supporting collection by `industrySlug`.
2. Set `industryPageRef` to the matching row in `industryPages` (matching the exact `slug` key).
3. Keep `isActive = true` only for records ready to render.

## Status and Gate Initialization

Imported page rows are intentionally seeded as:

- `status = planned`
- all QA booleans = `false`
- `publishReady = false`
- `blockerReason` filled

Do not move a row beyond `ready_for_qa` until:

- required content fields are filled
- required media fields are set
- metadata and canonical fields are final
- disclosure copy is approved

## First Rollout Wave

Start with `batch_01` rows in `industryPages`:

- `wix-seller-financing`
- `ecommerce-business-funding`
- `restaurant-funding`
- `trucking-funding`
- `construction-contractor-funding`

If you are importing Wave 1 only, use:

- `docs/wix-cms-wave1-import-checklist.md`
- `data/wix_wave1_industryPages_seed.csv`
- `data/wix_wave1_industryFaqs_seed.csv`
- `data/wix_wave1_industryModules_seed.csv`
- `data/wix_wave1_industryLinks_seed.csv`

Run QA gates before status changes:

1. `metadataApproved = true`
2. `schemaApproved = true`
3. `linksApproved = true`
4. `disclosureApproved = true`
5. `contentApproved = true`
6. `qaPass = true`
7. `publishReady = true`

Only then move:

`ready_for_qa -> qa_passed -> publish_approved -> scheduled -> published`
