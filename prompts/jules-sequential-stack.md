# Jules Sequential Task Stack (Non-Overlap With Phase 1 Thread)

## Global Jules Runner Block (use once before Task 1)

```text
Repository: moonshine-seo-ops
Execution mode: Sequential, stop-on-failure.
Rule: Complete tasks strictly in numeric order. Do not start next task until current task passes acceptance criteria.

Thread coordination:
- This run must not duplicate active work in tasklist thread "Phase 1" (id: 019d37eb-799c-7d00-9189-e09d3d3d981a).
- Shared files can be edited when needed, but only for Phase 0-related updates tied to MC-005, MC-006, verification, QA governance, and closeout.
- Do not duplicate or re-prioritize active Phase 1 planning work (industry rollout prioritization, keyword expansion, blueprint/spec authoring, template rollout decisions).
- If a requested change overlaps active Phase 1 ownership, write a dependency note in reports/phase0_to_phase1_handoff.md and proceed with non-overlapping parts.

Primary write scope for this run:
- data/audit_issues.csv
- data/action_queue.csv
- data/five_url_verification.csv
- data/url_inventory.csv
- data/redirects.csv
- data/canonicals.csv
- data/issue_to_url_map.csv
- docs/robots-meta-policy.md
- docs/phase-0-closeout.md
- scripts/qa-check.ts
- reports/**

Secondary shared-file writes (allowed only when directly required by Phase 0 outcomes):
- data/phase1_rollout_candidates.csv (notes/status fields only for Phase 0 dependency impacts)
- docs/phase-1-rollout-order.md (additive dependency notes only, no reprioritization)
- docs/page-family-specs.md (additive QA dependency notes only, no framework rewrites)

Guardrails:
- Do not invent canonical URLs, redirect targets, legal disclosures, or trust claims.
- Do not generate large SEO page batches.
- Do not create app code.
- If essential canonical/disclosure/schema fields are missing, fail loudly and log blocker in data/action_queue.csv.
- Preferred outputs: markdown, csv, json, typescript.

When finished with each task, return:
1) files changed
2) command outputs summary
3) acceptance criteria status (PASS/FAIL)
4) blockers (if any)
```

## Task 1

### Prompt

```text
Task 1/10: Baseline verification sync (Phase 0 scope only).

Run npm run verify.
Compare generated reports with existing reports/url-verification.csv and reports/url-verification.md.
Update data/five_url_verification.csv status/notes columns to reflect the current run.
Do not change policy decisions in this task.

Acceptance criteria:
- Verification run completed.
- reports/url-verification.csv updated.
- reports/url-verification.md updated.
- data/five_url_verification.csv synced to current verification reality.
```

### Expected Output

```text
Updated reports/url-verification.csv
Updated reports/url-verification.md
Updated data/five_url_verification.csv
PASS if all 3 are updated and consistent.
```

## Task 2

### Prompt

```text
Task 2/10: Resolve MC-005 robots meta policy decision.

Decide and document policy for robots meta on homepage/indexable pages.
Update data/audit_issues.csv for MC-005 with final status and rationale.
Update data/action_queue.csv for AQ-005 with final status and next action.
Record policy in docs/robots-meta-policy.md (create file if missing).

Acceptance criteria:
- MC-005 no longer open without rationale.
- AQ-005 no longer open without rationale.
- docs/robots-meta-policy.md exists with explicit policy text.
```

### Expected Output

```text
Updated data/audit_issues.csv (MC-005)
Updated data/action_queue.csv (AQ-005)
Created/updated docs/robots-meta-policy.md
PASS if decision is explicit and traceable.
```

## Task 3

### Prompt

```text
Task 3/10: Resolve MC-006 legacy URL disposition.

Review URL: https://www.distilledfunding.com/post/warp-speed-mortgage-review
Choose final disposition: keep, merge, redirect, or remove.
Document evidence-based rationale.
Update data/audit_issues.csv for MC-006.
Update data/action_queue.csv for AQ-006.

Acceptance criteria:
- MC-006 has final disposition and rationale.
- AQ-006 has final disposition and next action.
```

### Expected Output

```text
Updated data/audit_issues.csv (MC-006)
Updated data/action_queue.csv (AQ-006)
PASS if disposition is explicit and evidence-backed.
```

## Task 4

### Prompt

```text
Task 4/10: Apply URL control mappings from Task 3 decision.

Propagate the MC-006 disposition into:
- data/url_inventory.csv
- data/redirects.csv
- data/canonicals.csv
- data/issue_to_url_map.csv

If redirect/canonical target is unknown, fail loudly and log blocker in data/action_queue.csv.

Acceptance criteria:
- All required control files reflect the disposition.
- No blank critical canonical/redirect fields for decided actions.
```

### Expected Output

```text
Updated data/url_inventory.csv
Updated data/redirects.csv (if redirect chosen)
Updated data/canonicals.csv
Updated data/issue_to_url_map.csv
PASS if mappings are complete or blocker is explicitly logged.
```

## Task 5

### Prompt

```text
Task 5/10: Post-decision verification rerun.

Run npm run verify again.
Confirm all 5 representative URLs pass critical checks.
Update reports/url-verification.csv and reports/url-verification.md.
Sync any changed status/notes in data/five_url_verification.csv.

Acceptance criteria:
- Verification run succeeds.
- Reports updated to latest run.
- Representative URL tracking file is aligned.
```

### Expected Output

```text
Updated reports/url-verification.csv
Updated reports/url-verification.md
Updated data/five_url_verification.csv (if needed)
PASS if critical checks pass for all 5 URLs.
```

## Task 6

### Prompt

```text
Task 6/10: Implement real governance checks in scripts/qa-check.ts.

Replace starter stub with concrete checks for:
- required CSV headers in data/*.csv
- missing canonical/disclosure/schema-required fields
- non-zero exit code for critical governance failures

Keep utility small and inspectable.
Use only repository files and current governance rules.

Acceptance criteria:
- npm run qa executes real checks.
- Critical governance failures cause non-zero exit.
```

### Expected Output

```text
Updated scripts/qa-check.ts
PASS if script enforces real fail-loud governance checks.
```

## Task 7

### Prompt

```text
Task 7/10: Run QA and remediate governance/data gaps.

Run npm run qa.
Fix all critical failures by editing Phase 0-owned files first; use secondary shared-file writes only if required.
Re-run npm run qa until all critical checks pass.

Acceptance criteria:
- Final npm run qa exits successfully.
- All critical issues resolved or explicitly blocked with action_queue entry.
- No duplicated Phase 1 planning/reprioritization work.
```

### Expected Output

```text
Updated files tied to failing checks (within allowed write scope)
Final successful npm run qa
PASS if critical QA checks pass with no read-only file edits.
```

## Task 8

### Prompt

```text
Task 8/10: Create coordinated Phase 1 handoff notes.

Review relevant Phase 1 files:
- data/phase1_rollout_candidates.csv
- docs/phase-1-rollout-order.md
- docs/page-family-specs.md

Create reports/phase0_to_phase1_handoff.md containing:
- dependencies from this Phase 0 run that could impact Phase 1
- open blockers still relevant to Phase 1
- recommended next actions for the Phase 1 thread owner

Acceptance criteria:
- A handoff report exists in reports/.
- Any Phase 1 file edits (if made) are additive dependency notes only and do not duplicate planning work.
```

### Expected Output

```text
Created reports/phase0_to_phase1_handoff.md
PASS if handoff is complete and Phase 1 files remain untouched.
```

## Task 9

### Prompt

```text
Task 9/10: Update Phase 0 closeout only.

Update docs/phase-0-closeout.md to reflect:
- resolved open issues
- current verification/QA status
- remaining blockers and explicit ownership notes for Phase 1 thread

Do not re-prioritize Phase 1 plans in this task.

Acceptance criteria:
- docs/phase-0-closeout.md aligned with latest data/reports.
- Clear separation of ownership between this run and Phase 1 thread.
```

### Expected Output

```text
Updated docs/phase-0-closeout.md
PASS if narrative matches current source-of-truth and ownership is explicit.
```

## Task 10

### Prompt

```text
Task 10/10: Final validation and isolated closeout report.

Run npm run verify.
Run npm run qa.
Create reports/phase0_closeout_summary.md summarizing:
- what changed in Tasks 1-9
- final verify result
- final qa result
- remaining blockers (if any)
- explicit confirmation that no active Phase 1 planning tasks were duplicated

Acceptance criteria:
- Both commands executed.
- Closeout report created in reports/.
- Non-duplication with active Phase 1 planning work confirmed.
```

### Expected Output

```text
Latest reports/url-verification.csv
Latest reports/url-verification.md
Final QA run result
Created reports/phase0_closeout_summary.md
PASS if final validation is complete and no active Phase 1 planning work was duplicated.
```
