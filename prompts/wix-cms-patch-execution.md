# Wix CMS Patch Execution Prompt

Use this prompt in ChatGPT with the Wix connector enabled after connector discovery is complete.

## Goal

Patch approved CMS fields only for Wave 1 industry items and produce before or after evidence suitable for `reports/`.

## Source Of Truth

Read approved rows from `data/wix_field_patch_plan.csv`.

Treat a row as approved only when both conditions are true:

- `status=approved`
- `requires_approval=false`

If those conditions are not met, do not patch the row.

## Instructions

1. Read `data/wix_field_patch_plan.csv`.
2. Filter to approved rows only.
3. Group rows by `collection_id` and `item_id`.
4. Before patching each row:
   - confirm the item still exists
   - read the current field value
   - compare the current value to `proposed_value`
5. Patch only the approved field keys whose current value differs from `proposed_value`.
6. Skip rows when:
   - `item_id` is blank
   - the item is missing
   - the field key is missing
   - the row is not approved
   - the connector does not expose safe write capability for that field
7. After each attempted patch, capture before and after evidence.

## Hard Safety Rules

- Never patch unapproved rows.
- Never modify page routes, dynamic page settings, layout, repeaters, or template bindings.
- Never publish as part of this patch flow unless the operator explicitly asks for a publish step.
- Never invent item IDs or fallback field keys.
- Never change canonical logic if the approved repo value is missing or under review.

## Required Output

### 1. Execution Summary

Provide:

- rows reviewed
- rows patched
- rows skipped
- rows blocked

### 2. Per-Row Evidence

For each approved row, output:

- `patch_id`
- `collection_id`
- `item_id`
- `slug`
- `field_key`
- `before_value`
- `after_value`
- `result`
- `notes`

Use `result` values:

- `patched`
- `already_correct`
- `skipped_unapproved`
- `skipped_missing_item`
- `skipped_missing_field`
- `blocked_connector_limit`

### 3. Reports Output Block

End with a Markdown section formatted so it can be copied into a repo report file, for example:

- report title
- execution timestamp
- rows patched
- rows skipped
- unresolved blockers

## Required Behavior On Editor-Only Issues

If you discover that the remaining issue is route, template, or binding related, stop patching that lane and list it under Editor-only blockers instead of attempting a workaround.
