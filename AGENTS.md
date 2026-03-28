# AGENTS

## Repo Purpose

This repo supports Phase 0 SEO cleanup and controlled future pSEO for **Distilled Funding by Moonshine Capital**.

Use it to manage:

- crawl and index controls
- trust and disclosure remediation
- URL triage and publishing decisions
- schema governance
- verification workflows
- template-driven future page planning

## Preferred Workflow

1. Read `README.md`, `TASKS.md`, and the docs in `docs/`.
2. Update source-of-truth CSVs before generating outputs.
3. Keep schema files editable and mapped to explicit page intent.
4. Use scripts for repeatable checks, not speculative automation.
5. Record unknowns in a queue instead of guessing.

## Coding Priorities

- Keep utilities small, inspectable, and easy to run
- Prefer clarity over abstraction
- Make missing required data obvious
- Support controlled publishing QA before scaling generation

## File Conventions

- Markdown for docs, prompts, and templates
- CSV for inventories, queues, and operator-controlled tabular data
- JSON for schema starters and template payloads
- TypeScript for utility scripts

## Guardrails

- Do not generate large SEO page batches before Phase 0 controls are complete.
- Do not invent canonical URLs, redirect targets, legal disclosures, or trust claims.
- Do not create app code in this repository unless explicitly requested later.
- If an essential canonical, disclosure, or schema field is missing, fail loudly instead of guessing.

## Preferred Output Types

- `markdown`
- `csv`
- `json`
- `typescript`
