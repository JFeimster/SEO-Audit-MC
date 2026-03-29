# Phase 0 Priority Fixes

## Top Issues From First Verification Run

1. `/privacy-policy` missing meta description.
2. `/revenuebased` missing JSON-LD.
3. `/privacy-policy` missing JSON-LD.
4. `/industries/wix-seller-financing` missing JSON-LD.
5. Robots meta absent across sampled pages (validation item, not auto-defect).

## Critical Vs Optional

### Critical

- Missing meta description on trust page (`/privacy-policy`).
- Missing JSON-LD on money page (`/revenuebased`).
- Missing JSON-LD on trust page (`/privacy-policy`).

### Important But Secondary

- Missing JSON-LD on industry template candidate (`/industries/wix-seller-financing`).
- Legacy blog intent triage (`/post/warp-speed-mortgage-review`).

### Optional / Validate Before Changing

- Missing robots meta.
- Only change robots meta if indexing policy requires it.

## Recommended Order Of Remediation

1. Fix trust page meta description.
2. Add JSON-LD to money page.
3. Add JSON-LD to trust page.
4. Add JSON-LD pattern to industry template candidate.
5. Run legacy blog keep/merge/redirect decision.
6. Validate robots meta policy and only then apply changes if needed.

## Fix Now (Next 3 Days)

### Day 1

- Update `/privacy-policy` meta description in Wix.
- Confirm deployment and re-check metadata pull.

### Day 2

- Add JSON-LD block to `/revenuebased`.
- Add JSON-LD block to `/privacy-policy`.
- Re-run verification and update `data/audit_issues.csv` statuses.

### Day 3

- Add JSON-LD block to `/industries/wix-seller-financing`.
- Decide disposition for `/post/warp-speed-mortgage-review`.
- Validate robots meta policy and capture decision in `data/action_queue.csv`.
