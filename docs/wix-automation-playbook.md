# Wix Automation Playbook

Snapshot date: `2026-05-03`
Scope: Phase 1 Wave 1 industry rollout blocker control layer

## Purpose

Separate Wix work into three lanes:

1. CMS or API-fixable tasks
2. live verification tasks
3. Wix Editor-only blockers

This playbook is intentionally execution-ready but no-live-change by default. It does not approve writes on its own.

## What Can Be Automated Through Wix CMS or API

These tasks appear automatable or semi-automatable based on current connector and repo evidence:

- list collections and inspect schema through a Wix connector workflow
- inspect `industryPages` CMS rows directly
- compare Wave 1 slugs against expected field values
- identify blank, mismatched, or governance-held CMS fields
- build patch candidates in `data/wix_field_patch_plan.csv`
- patch approved collection fields only after operator review
- regenerate local value sheets and patch plans
- re-run local verification commands after a publish event

Confirmed collection and plugin state:

- collection ID: `industryPages`
- display field: `title`
- read permission: `ANYONE`
- insert permission: `ADMIN`
- update permission: `ADMIN`
- `PUBLISH` plugin: confirmed
- `EDITABLE_PAGE_LINK` plugin: confirmed
- item route field: `link-industry-pages-title` using `/industries/{slug}`

Confirmed field keys in the current discovery and execution model:

- `title`
- `slug`
- `seoTitle`
- `metaDescription`
- `canonicalUrl`
- `ogTitle`
- `ogDescription`
- `ogImage`
- `robotsDirective`
- `h1`
- `heroHeadline`
- `heroSubhead`
- `metadataApproved`
- `link-industry-pages-title`

Patchable but currently blocked CMS governance field:

- `metadataApproved`

Current rule:

- keep `metadataApproved=false` for all Wave 1 rows until live verification passes

## What Appears To Require Wix Editor

Current evidence still points to manual Wix Editor work for:

- creating or repairing the dynamic item route `/industries/{slug}`
- restoring the missing `industries` router prefix
- removing static or fallback behavior serving all `/industries/*` slugs
- binding live template SEO controls to CMS fields
- binding live H1, hero, CTA, and repeater content to the current item
- publishing template or route changes after manual fixes

Reason:

- `industryPages` is confirmed, populated, and has the required route/plugin support at the CMS layer
- `reports/wix-wave1-live-binding-verification.md` still shows live titles, descriptions, OG values, and hero or H1 signals resolving through a fallback or static pattern
- this means the remaining blocker is route or template binding in Wix Editor, not missing CMS data

## Current Wave 1 Blocker Summary

Known Wave 1 state:

- `industryPages` CMS data is populated for all five Wave 1 items
- `metadataApproved` must remain `false` on all five items until live verification passes
- live `/industries/*` routing still appears to resolve through a fallback or static page pattern
- live SEO metadata still does not reflect populated CMS fields
- live hero or H1 signals still fail on four Wave 1 slugs
- publish calls alone are not evidence of a live fix

Operational conclusion:

- CMS discovery is complete for the core `industryPages` lane
- remaining blockers are Wix Editor route, template, and binding fixes
- API or CMS patch tasks stay blocked until the live route and binding issue is fixed and verified

## Safe Execution Order

1. Discover
   - confirm current connector findings remain true for `industryPages`
   - re-check only if the collection schema changes
2. Plan
   - maintain `data/wix_field_patch_plan.csv` as a governance hold list
   - do not approve CMS patch rows yet
3. Perform manual Wix Editor fixes
   - follow `docs/wix-wave1-dynamic-binding-hotfix.md`
   - next action: fix the dynamic item page route and bindings in Wix Editor
4. Re-check blockers
   - run `npm run wix:blockers`
   - confirm all remaining blockers are Editor-only until live verification changes
5. Verify live state
   - run `npm run verify:wix`
   - run `npm run verify:wix:router`
   - run `npm run verify:wix:live`

## No-Live-Change Safety Rules

- Do not write to Wix during connector discovery.
- Do not patch rows unless live verification evidence supports advancement.
- Do not set `metadataApproved=true` while live binding mismatches remain open.
- Do not modify routes, templates, layout, or repeater wiring through a CMS patch flow.
- Do not mark a blocker complete because a publish call succeeded.
- Do not close Wave 1 blockers until live verification passes.
- Do not invent collection permissions, item IDs, or missing field values.

## Verification Sequence

Local and live verification order:

1. `npm run wix:patch-plan`
   - rebuild or refresh local patch candidates
2. `npm run wix:blockers`
   - confirm open P0 Editor blockers before expecting a live pass
3. `npm run verify:wix`
   - validate seed and CMS-side implementation assumptions
4. `npm run verify:wix:router`
   - confirm the `industries` dynamic router prefix exists
5. `npm run verify:wix:live`
   - confirm live metadata and content bindings match expectations

Only after the router and live verification steps pass should Wave 1 rows move forward in publish lifecycle tracking.
