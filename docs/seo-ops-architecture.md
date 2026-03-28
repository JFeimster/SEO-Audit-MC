# SEO Ops Architecture

## Objective

Create a lightweight control repo that sits between SEO decision-making and any future publishing system for **Distilled Funding by Moonshine Capital**.

## Operating Layers

### 1. Governance

- `docs/brand-rules.md` defines naming, disclosure, and wording constraints.
- `docs/phase-0-triage.md` defines cleanup order and escalation rules.
- `docs/page-blueprints.md` defines which page families are allowed later.

### 2. Source of Truth

- `data/url_inventory.csv` tracks current known URLs and disposition
- `data/redirects.csv` tracks approved redirect mappings
- `data/canonicals.csv` tracks canonical decisions
- `data/keyword_clusters.csv` tracks future opportunity clusters
- `data/five_url_verification.csv` tracks controlled verification samples
- `data/action_queue.csv` tracks open tasks, blockers, and owners

### 3. Reusable Controls

- `schemas/` stores editable JSON-LD starters
- `prompts/` stores reusable prompts for repeatable operator tasks
- `templates/` stores page structures, not finished pages
- `scripts/` stores small checks and helpers

### 4. Reports

- `reports/` is reserved for exported QA summaries, verification logs, and one-off audit outputs

## Expected Flow

1. Crawl or export live URLs into `data/url_inventory.csv`.
2. Classify URLs as keep, improve, merge, redirect, noindex, or remove.
3. Repair brand and trust anchors on the highest-value pages first.
4. Lock canonical and redirect decisions in CSV before implementation.
5. Verify 5 representative URLs across metadata, schema, trust, and crawl signals.
6. Only after controls hold steady, define approved page blueprints for future pSEO.

## Non-Goals

- This repo is not the production website.
- This repo is not a CMS replacement.
- This repo is not the place to mass-generate publish-ready landing pages on day one.

## Change Management

- Prefer explicit edits to CSVs, docs, and schema files over hidden automation.
- When a script writes output, it should write into `reports/` or clearly named artifacts.
- If live-site facts are unknown, log the gap and stop instead of inventing content.
