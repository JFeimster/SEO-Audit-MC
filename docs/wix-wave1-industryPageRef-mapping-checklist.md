# Wix Wave 1 `industryPageRef` Mapping Checklist

Snapshot date: `2026-04-01`
Scope: Wave 1 only (`batch_01`)

## Purpose

Use this checklist to map supporting collection rows to the correct `industryPages` item in Wix CMS by setting `industryPageRef`.

This checklist is exact for Wave 1:

- `wix-seller-financing`
- `ecommerce-business-funding`
- `restaurant-funding`
- `trucking-funding`
- `construction-contractor-funding`

Expected rows per slug:

- `industryFaqs`: `4`
- `industryModules`: `3`
- `industryLinks`: `3`

## Pre-Flight

1. Confirm latest seeds are generated and validated:
   - `npm run wix:seed`
   - `npm run verify:wix`
2. Confirm `industryPages` and all three supporting collections are imported.
3. Confirm `industryPages.slug` values are plain slugs (no `/industries/` prefix).
4. Open `data/wix_changes.csv` and keep row IDs `W1-002` through `W1-033` ready for status logging.

## Slug-To-Page Mapping Table

Use this exact match table when setting `industryPageRef`:

| Supporting row `industrySlug` | Target `industryPages.slug` |
| --- | --- |
| `wix-seller-financing` | `wix-seller-financing` |
| `ecommerce-business-funding` | `ecommerce-business-funding` |
| `restaurant-funding` | `restaurant-funding` |
| `trucking-funding` | `trucking-funding` |
| `construction-contractor-funding` | `construction-contractor-funding` |

## Operator Steps In Wix UI

### A) Map `industryFaqs` References

1. Open Wix CMS -> `industryFaqs`.
2. Filter:
   - `industrySlug` equals one Wave 1 slug.
   - `industryPageRef` is empty.
3. Multi-select all rows for that slug (expected `4` rows).
4. Bulk edit `industryPageRef` -> choose the matching row from `industryPages`.
5. Save/publish CMS changes.
6. Repeat for all 5 Wave 1 slugs.

Completion check:

- `industryFaqs` filtered by Wave 1 slugs with empty `industryPageRef` returns `0` rows.

### B) Map `industryModules` References

1. Open Wix CMS -> `industryModules`.
2. Filter:
   - `industrySlug` equals one Wave 1 slug.
   - `industryPageRef` is empty.
3. Multi-select all rows for that slug (expected `3` rows).
4. Bulk edit `industryPageRef` -> choose the matching row from `industryPages`.
5. Save/publish CMS changes.
6. Repeat for all 5 Wave 1 slugs.

Completion check:

- `industryModules` filtered by Wave 1 slugs with empty `industryPageRef` returns `0` rows.

### C) Map `industryLinks` References

1. Open Wix CMS -> `industryLinks`.
2. Filter:
   - `industrySlug` equals one Wave 1 slug.
   - `industryPageRef` is empty.
3. Multi-select all rows for that slug (expected `3` rows).
4. Bulk edit `industryPageRef` -> choose the matching row from `industryPages`.
5. Save/publish CMS changes.
6. Repeat for all 5 Wave 1 slugs.

Completion check:

- `industryLinks` filtered by Wave 1 slugs with empty `industryPageRef` returns `0` rows.

## Wave 1 Exception (Required Before Publish)

For `construction-contractor-funding` in `industryLinks`:

1. Filter `industrySlug = construction-contractor-funding`.
2. Find row where `linkType = sibling_industry`.
3. Update `linkUrl` from `/industries/medical-practice-funding` to a Wave 1 slug.
4. Keep `isRequired = true`.
5. Save and log this as `W1-033` in `data/wix_changes.csv`.

## Final Validation

1. Re-run `npm run verify:wix`.
2. Spot-check one slug in Wix dynamic preview:
   - FAQ repeater renders expected rows.
   - module repeater renders expected rows.
   - related links repeater renders expected rows.
3. Update `data/wix_changes.csv` statuses:
   - set completed rows from `planned` -> `completed`.
   - fill `wix_item_id` when available.
   - set `published_date` only when the change is live.
