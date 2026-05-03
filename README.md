# moonshine-seo-ops

**Last Updated:** 2026-04-15

`moonshine-seo-ops` is the SEO operations control repository for **Distilled Funding by Moonshine Capital**. It governs crawl/index decisions, trust and disclosure remediation, schema quality, verification workflows, and the controlled rollout of future template-based SEO pages. The repo is designed to keep decisions explicit, operator-owned, and auditable before anything is scaled.

## 🎯 Purpose

**What This Repo Is For:**
- Phase 0 SEO cleanup and remediation
- Crawl, index, canonical, and redirect governance
- Trust, disclosure, and brand consistency controls
- Structured schema management and QA
- Repeatable verification workflows and audit reporting
- Controlled Phase 1/Wix rollout support
- Future pSEO planning (only after publishing controls are in place)

**What This Repo Is Not:**
- The production website
- A CMS replacement
- A place to mass-generate landing pages before controls are verified
- A source of guessed canonicals, redirects, disclosures, or trust claims

## 📜 Brand Rules

- **Primary bridge brand:** `Distilled Funding by Moonshine Capital`
- **Allowed short form:** `Distilled Funding`
- **Parent reference:** `Moonshine Capital`
- **Disallowed legacy term:** `Capitol Accelerator` (unless explicitly quarantining a bad asset)

## ⚙️ Operating Model

1. **Read the Docs:** Start with `README.md`, `TASKS.md`, and relevant documentation in `docs/`.
2. **Update Data:** Modify source-of-truth CSVs in `data/` before generating reports or downstream assets.
3. **Manage Schema:** Keep schema files editable and tightly mapped to explicit page intent.
4. **Use Scripts:** Rely on small TypeScript scripts for repeatable checks and exports.
5. **No Guesswork:** If a required canonical, disclosure, redirect target, or schema field is unknown, log the gap and stop.

## 📂 Repository Structure

- `docs/`: Architecture, triage order, policy, rollout plans, Wix implementation guides, and page family specs.
- `data/`: Source-of-truth CSVs for URL inventory, canonicals, redirects, issue tracking, rollout tracking, and seed inputs.
- `prompts/`: Reusable prompts for schema, verification, rewrites, and cleanup workflows.
- `schemas/`: Editable JSON-LD starter files and governed schema payloads.
- `scripts/`: Small TypeScript utilities for verification, QA, schema generation, and Wix rollout support.
- `templates/`: Controlled markdown blueprints for future page types.
- `reports/`: Generated verification logs, QA outputs, and handoff artifacts.
- `wix/`: Wix-related implementation materials and supporting assets.

## 📄 Key Documentation

- `docs/seo-ops-architecture.md`: Repo operating model and control layers.
- `docs/phase-0-triage.md`: Cleanup order and escalation path.
- `docs/phase-0-closeout.md`: Phase 0 completion status and verified outcomes.
- `docs/robots-meta-policy.md`: Crawl/index policy guidance.
- `docs/page-blueprints.md`: Approved future page blueprint rules.
- `docs/pseo-source-of-truth-schema.md`: Governed data model for future scaled page families.
- `docs/phase-1-kickoff.md`: Phase 1 rollout context and execution direction.

## 📊 Current Status

- **Phase 0:** Core remediation is complete (documented in `docs/phase-0-closeout.md`).
- **Verification:** Artifacts confirm representative URLs pass the required baseline checks for status, title, and canonical presence.
- **Phase 1:** The repo now supports controlled Phase 1 rollout work, including Wix execution tracking and verification.
- *Note:* Any remaining unknowns should stay in tracked queues until explicitly resolved.

## 🗄️ Core Data Files

- `data/url_inventory.csv`: Current URL inventory and disposition decisions.
- `data/redirects.csv`: Approved redirect mappings.
- `data/canonicals.csv`: Canonical target decisions.
- `data/action_queue.csv`: Operator task queue, blockers, and ownership.
- `data/audit_issues.csv`: Normalized issue tracker with severity, status, and due dates.
- `data/issue_to_url_map.csv`: Issue-to-URL mapping table.
- `data/five_url_verification.csv`: Representative verification sample set.
- `data/schema_backlog.csv`: Schema fixes and missing-field queue.
- `data/wix_changes.csv`: Execution log for published Wix remediation work.

## 🛠️ Scripts & Workflows

**Available Scripts:**
```bash
npm run bootstrap
npm run verify
npm run qa
npm run schema
npm run verify:wix
npm run verify:wix:live
npm run verify:wix:router
npm run wix:patch-plan
npm run wix:blockers
npm run wix:seed
npm run wix:wave1:bindings
```

**Verification Workflow:**
Run the baseline URL verifier:
```bash
npm run verify
```
This workflow:
- Reads URLs from `data/five_url_verification.csv` (falls back to a hardcoded sample if needed).
- Writes outputs to `reports/url-verification.csv` and `reports/url-verification.md`.
- **Fails loudly** when a checked URL returns a non-`200` status, lacks a title, or lacks a canonical.

**QA Checks:**
Run the repo QA checks:
```bash
npm run qa
```
*Use QA before signoff when editing governed CSVs, schema payloads, or rollout tracking files.*

## Wix Blocker Control Layer

Use the Wix control-layer artifacts before attempting CMS patching or Editor remediation:

1. `npm run wix:patch-plan`
   - builds or refreshes `data/wix_field_patch_plan.csv`
   - writes `reports/wix-patch-plan-summary.md`
2. `npm run wix:blockers`
   - prints tracked Editor blockers
   - exits non-zero while P0 Editor blockers remain open
3. `npm run verify:wix`
4. `npm run verify:wix:router`
5. `npm run verify:wix:live`

Operator docs and prompts:

- `docs/wix-automation-playbook.md`
- `prompts/wix-connector-discovery.md`
- `prompts/wix-cms-patch-execution.md`

Governed tracking files:

- `data/wix_cms_collection_inventory.csv`
- `data/wix_field_patch_plan.csv`
- `data/wix_editor_blockers.csv`

## 🧠 Working Principles

- **Prefer clarity over abstraction.**
- **Keep utilities small, inspectable, and easy to run.**
- **Make missing required data obvious.**
- **Use scripts for repeatable checks, not speculative automation.**
- **Do not scale page generation until controls, templates, and QA gates are explicitly ready.**
