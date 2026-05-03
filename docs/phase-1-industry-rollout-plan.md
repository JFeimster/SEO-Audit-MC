# Phase 1 Industry Rollout Plan

Snapshot date: `2026-05-03`
Scope: controlled `industry_pages` rollout only

## Planning Rule

Do not expand beyond the current Wave 1 batch until the live Wix dynamic route and SEO bindings are fixed and re-verified.

Current blocker references:

- `docs/phase-1-wave1-next-actions.md`
- `docs/wix-wave1-dynamic-binding-hotfix.md`
- `reports/wix-wave1-live-binding-verification.md`

## Wave 1 Industry Targets

Priority order for the active Wave 1 batch:

1. `/industries/wix-seller-financing`
   - Existing URL already present in inventory
   - `MC-004` is `verified_fixed`
   - Best proof-of-concept page for future seller-financing variants
2. `/industries/ecommerce-business-funding`
   - Closest adjacent expansion to the existing Wix seller page
   - Strongest bridge into broader ecommerce seller financing clusters
3. `/industries/restaurant-funding`
   - Existing `p1` rollout candidate with direct operational cash-flow use case
4. `/industries/trucking-funding`
   - Existing `p1` rollout candidate with direct working-capital timing use case
5. `/industries/construction-contractor-funding`
   - Existing `p1` rollout candidate with materials, labor, and project-timing intent

## Required Schema

Every industry page must ship with:

- `WebPage`
- `Service`
- `FAQPage` when visible FAQ content is present
- `BreadcrumbList`

Schema rules:

- visible content and schema claims must match
- canonical in schema must match the approved page canonical
- bridge brand naming must use `Distilled Funding by Moonshine Capital` or approved short form
- do not add review, rating, or outcome claims unless first-party evidence exists

## Internal Link Rules

Required outbound internal links on every industry page:

- one link to `/revenuebased`
- one link to `/privacy-policy` until a stronger approved trust page is designated
- one sibling industry link

Required inbound links before publish:

- linked from the `/industries` index
- linked from at least one money-page or navigation surface

Anchor text rules:

- use descriptive industry-specific anchors
- avoid repeated generic `learn more` anchors
- do not point industry pages at unapproved comparison or review URLs

## Wix Implementation Method

API or CMS-driven work:

- maintain source rows in `data/phase1_rollout_candidates.csv`
- maintain approved keyword support in `data/keyword_clusters.csv`
- generate or refresh seed files with `npm run wix:seed`
- validate seed files with `npm run verify:wix`
- use the CMS import runbook in `docs/wix-cms-industry-import-runbook.md`

Manual Wix Editor work:

- recreate or repair the `industryPages` dynamic route `/industries/{slug}`
- ensure the router prefix is `industries`
- bind SEO fields from CMS values on the live dynamic template
- confirm H1, hero, repeater, and CTA bindings use the current item
- republish after template or route corrections

Known platform constraint:

- existing repo evidence says the available Wix REST APIs do not directly write the live dynamic route or template SEO bindings, so those steps stay manual until platform capability changes

## QA Gates Before Publish

1. Data gate
   - rollout candidate row exists and is complete
   - keyword cluster row exists and is approved
2. Content gate
   - required sections are complete
   - no placeholders or unresolved factual gaps remain
3. Metadata gate
   - title, meta description, canonical, and indexation are final
4. Schema gate
   - required schema pattern is present and matches visible content
5. Trust gate
   - bridge brand naming is compliant
   - disclosure block is present
6. Wix live gate
   - `npm run verify:wix` passes
   - `npm run verify:wix:router` passes
   - `npm run verify:wix:live` returns `Errors: 0`
7. Lifecycle gate
   - `metadataApproved=true`
   - `schemaApproved=true`
   - `linksApproved=true`
   - `disclosureApproved=true`
   - `contentApproved=true`
   - `qaPass=true`
   - `publishReady=true`

## Rollout Guardrails

- Do not start Wave 2 until all Wave 1 live binding blockers are cleared.
- Do not publish any industry page with a blank or guessed canonical.
- Do not create redirect mappings for adjacent legacy pages until explicit targets are approved.
- Do not reuse one FAQ block unchanged across multiple industries.
