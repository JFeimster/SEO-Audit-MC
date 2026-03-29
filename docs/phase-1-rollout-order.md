# Phase 1 Rollout Order

Input note: `docs/phase-1-kickoff.md` was not present in this checkout on 2026-03-29. Order below uses Phase 0 closeout status and current inventory/audit data.

## Recommended Rollout Order

1. Industry pages
2. Borrower profile pages
3. Comparison pages
4. Tool pages

## Why Industry Pages Go First

- Existing proof of concept already exists at `/industries/wix-seller-financing` and is `verified_fixed` in audit issue `MC-004`.
- Industry pages map directly to commercial-intent funding queries and the core money-page offer (`/revenuebased`).
- They scale with controlled template variance and lower legal risk than competitor comparison claims.
- They can ship with strict schema and disclosure controls defined in `docs/page-family-specs.md`.

## What Should Wait Until Later

- Borrower profile pages:
  - wait until audience segmentation and qualification language are approved to avoid overgeneralized persona claims
- Comparison pages:
  - wait until legal-safe differentiators and evidence-backed claims are documented for each comparison target
- Tool pages:
  - wait until calculator or assessment logic is validated and QA automation is in place for formula correctness

## Publish-Ready Criteria For Any Page Family

A family is publish-ready only when all conditions are true:

1. Inventory readiness:
   - candidate rows exist with explicit slug, keyword, schema type, CTA type, and status
2. Keyword readiness:
   - keyword clusters populated and approved for that family
3. Canonical readiness:
   - canonical and indexation policy defined for each candidate
4. Template readiness:
   - family spec exists with required sections and disallowed shortcuts
5. Schema readiness:
   - required JSON-LD pattern documented and field-level requirements mapped
6. Trust readiness:
   - disclosure wording approved and bridge brand naming verified
7. QA readiness:
   - verification checklist and pass criteria defined for representative URLs

If any criterion is missing, family status stays `planned` and rollout does not start.
