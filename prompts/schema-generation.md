# Schema Generation Prompt

## Objective

Generate or revise schema for **Distilled Funding by Moonshine Capital** using the editable starters in `schemas/`.

## Inputs Required

- page type
- canonical URL
- visible page purpose
- required entity relationships
- approved brand naming
- disclosure requirements

## Instructions

1. Match schema to the visible page intent.
2. Reuse existing starter files when possible.
3. Do not invent entity properties that are not confirmed.
4. If a required field is unknown, leave a clear placeholder and mark it as required.
5. Prefer JSON-LD that is easy for operators to edit.

## Output Format

- chosen schema type or graph
- required fields
- optional fields
- populated JSON-LD draft
- unresolved placeholders
