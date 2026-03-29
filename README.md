# moonshine-seo-ops

This repository is the Phase 0 SEO operations and controlled pSEO control center for **Distilled Funding by Moonshine Capital**.

It exists to stabilize brand, trust, crawl, schema, and publishing controls before any scaled page generation begins.

## Repo Purpose

- Phase 0 SEO cleanup
- Trust and disclosure remediation
- Crawl and index control
- Schema governance
- Publishing QA
- Future structured pSEO once controls are in place

## Brand Bridge

- Full bridge brand: `Distilled Funding by Moonshine Capital`
- Short form: `Distilled Funding`
- Parent reference: `Moonshine Capital`
- Disallowed legacy term unless explicitly quarantining a bad asset: `Capitol Accelerator`

## Folder Overview

- `docs/`: operating docs, architecture, Phase 0 triage, brand and blueprint rules
- `data/`: source-of-truth CSV inventories and QA queues
- `prompts/`: reusable operator prompts for generation, rewrite, verification, and cleanup
- `schemas/`: editable JSON-LD starter files and templates
- `scripts/`: small utility stubs for verification, QA, and schema workflows
- `templates/`: controlled markdown blueprints for future page drafting
- `reports/`: output directory for audits, QA summaries, and verification exports

## Priority Order

1. Normalize brand identity
2. Fix `robots.txt` / `ads.txt` split
3. Triage junk URLs
4. Repair trust anchors
5. Verify 5 representative URLs
6. Build publishing controls
7. Only then prepare structured page generation

## Workflow Summary

1. Use `docs/phase-0-triage.md` to run cleanup in a controlled order.
2. Track URL, redirect, canonical, keyword, and action data in `data/`.
3. Keep schema changes governed by `schemas/` starters plus `prompts/schema-generation.md`.
4. Use `scripts/verify-urls.ts` and `scripts/qa-check.ts` as the starting point for repeatable checks.
5. Do not generate large page batches until Phase 0 done criteria are satisfied in `TASKS.md`.

## URL Verification Usage

Run the Phase 0 URL verifier:

```bash
npm run verify
```

Behavior:

- Reads URLs from `data/five_url_verification.csv` (column: `url`) when usable rows exist.
- Falls back to a small hardcoded list when usable CSV rows are missing.
- Writes reports to:
  - `reports/url-verification.csv`
  - `reports/url-verification.md`
- Exits with a non-zero status when any URL has status not `200`, missing title, or missing canonical.

## Current Status

- Verification has been run.
- Reports are in `reports/url-verification.csv` and `reports/url-verification.md`.
- Latest run used real URLs from `data/five_url_verification.csv` (not fallback mode).

## Phase 0 Audit Tracking Files

- `data/audit_issues.csv`: master list of normalized audit findings with severity, status, ownership, and due dates.
- `data/issue_to_url_map.csv`: mapping table that links each issue to the exact impacted URL(s) and page context.
- `data/wix_changes.csv`: execution log for requested and published Wix changes tied to SEO remediation work.
- `data/schema_backlog.csv`: structured queue of schema fixes with missing required fields, owners, and release targeting.
