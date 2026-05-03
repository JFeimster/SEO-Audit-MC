# Wix Patch Plan Summary

- Generated at: `2026-05-03T07:33:16.510Z`
- Source file: `data/phase1_rollout_candidates.csv`
- Output file: `data/wix_field_patch_plan.csv`
- Wave 1 slugs included: `5`
- Patch rows generated or preserved: `40`
- Optional sprint queue present: `no`

## Wave 1 Slugs

- `/industries/wix-seller-financing`
- `/industries/ecommerce-business-funding`
- `/industries/restaurant-funding`
- `/industries/trucking-funding`
- `/industries/construction-contractor-funding`

## Notes

- This script does not call Wix APIs and does not assign item IDs.
- Existing `item_id`, `current_value`, `status`, and approval fields are preserved when the patch plan is regenerated.
- If `data/phase1_sprint_queue.csv` is missing, Wave 1 is derived from the first five `p1` `industry_pages` rows in `data/phase1_rollout_candidates.csv`.
- Treat all generated rows as discovery candidates until connector evidence confirms collection item IDs and current field values.

