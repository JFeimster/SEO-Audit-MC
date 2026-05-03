# Phase 1 Sprint Plan

Purpose: convert the Phase 0 closeout and Phase 1 tracking files into a 7-day execution sprint without changing live Wix content, inventing metrics, or generating new pages prematurely.

## Sprint doctrine

- Fix governance and blockers before scaling.
- Keep redirect decisions open until an approved target exists.
- Treat Wix dynamic binding as the primary blocker for Wave 1 industry rollout.
- Treat CTR work as a rewrite-and-verify lane, not a publish-first lane.
- Every page family must pass metadata, canonical, schema, internal link, and disclosure checks before publish.

## Current ground truth

- Phase 1 industry candidates exist, led by Wix seller financing, ecommerce business funding, restaurant funding, trucking funding, and construction contractor funding.
- Wix API tasks show seed generation and validation are complete, but publish/API automation is blocked by manual route and binding fixes.
- Wix manual tasks show the industry dynamic route/template binding is still open.
- Action queue items AQ-007 and AQ-008 remain open because approved redirect targets are missing.
- CTR heist targets are mostly needs_data or needs_review, with Wix Seller Financing blocked by live binding confirmation.

## Day 1 — Lock sprint queue and blockers

Actions:
- Review data/phase1_sprint_queue.csv.
- Confirm each task has owner, blocker, next action, and acceptance criteria.
- Keep AQ-007 and AQ-008 open. Do not add redirects until targets are approved.
- Run npm run qa after CSV edits.

Acceptance criteria:
- Sprint queue is complete enough to execute.
- QA passes.
- No fake redirect targets are added.

## Day 2 — Wix dynamic route and template binding fix

Actions:
- Execute WIX-MAN-001 through WIX-MAN-003 in Wix Editor.
- Repair or recreate the industryPages dynamic route.
- Confirm static or fallback industry behavior is removed or disabled.
- Bind title, meta description, canonical, OG title, OG description, OG image, and robots to CMS fields.

Acceptance criteria:
- Wix seller financing resolves to the correct dynamic item.
- Template SEO fields are connected to CMS fields.

## Day 3 — Validate Wix Wave 1 live bindings

Actions:
- Run npm run verify:wix:live.
- Run npm run wix:wave1:bindings if editor field values need refreshed copy.
- Update data/wix_manual_tasks.csv only when evidence confirms completion.

Acceptance criteria:
- Live binding verification passes for Wave 1 slugs or produces a clear blocker list.
- H1, hero, CTA, metadata, canonical, and schema signals are verified.

## Day 4 — Prepare Wave 1 industry pages for publish gate

Actions:
- Use data/phase1_rollout_candidates.csv to prioritize the first five industry pages.
- Confirm metadata, schema type, parent page, CTA type, and internal link role for each.
- Do not generate new content unless the dynamic binding gate passes.

Acceptance criteria:
- First five industry pages have approved metadata and schema requirements.
- Any unresolved item is marked blocked, not guessed.

## Day 5 — CTR heist evidence intake

Actions:
- Add GSC, ranking, or CTR evidence to data/ctr_heist_targets.csv where available.
- Prioritize targets that have first-page impressions and low or zero clicks.
- Keep needs_data rows open until evidence exists.

Acceptance criteria:
- CTR targets have evidence status updated.
- No title or meta rewrite is marked ready without query or ranking evidence.

## Day 6 — Gig worker and ecommerce cluster decisions

Actions:
- Review data/gig_worker_cluster_map.csv and data/ecommerce_seller_cluster_map.csv.
- Confirm king URLs where known.
- Mark unknown canonicals or redirects as needs_review.
- Avoid redirect or merge decisions without approved target mapping.

Acceptance criteria:
- Cluster maps identify hub, spoke, review, and comparison roles.
- Ambiguous URLs remain under review.

## Day 7 — Sprint closeout and next PR

Actions:
- Run npm run qa.
- Run relevant verification scripts based on completed work.
- Create a short sprint closeout report in reports/ if evidence changed.
- Prepare next PR only for completed, evidence-backed changes.

Acceptance criteria:
- QA passes.
- Blockers are explicit.
- Phase 1 next moves are based on verified site state.

## Immediate commands

```bash
npm run qa
npm run verify:wix:live
npm run wix:wave1:bindings
```

## Remaining blockers

- Wix dynamic route/template binding issue for industry pages.
- Missing approved redirect targets for AQ-007 and AQ-008.
- Missing CTR/ranking evidence for most CTR heist targets.
- Unknown canonical decisions in cluster maps.
