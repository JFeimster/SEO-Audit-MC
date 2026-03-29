# Post Wix Fix Summary

## Scope

- Verification source: `data/five_url_verification.csv`
- Run timestamp: `2026-03-29T04:17:30.674Z`
- Deployment method under review: `Custom Embeds API` (`2cc73d0f-5700-4841-aee0-3e97c09c85f6`)

## What Passed

- All 5 URLs passed critical checks used by the verifier:
  - status code `200`
  - title present
  - canonical present
- Target remediation checks now passing:
  - `/privacy-policy` now has meta description and JSON-LD (`jsonld_count=1`)
  - `/revenuebased` now has JSON-LD (`jsonld_count=1`)
  - `/industries/wix-seller-financing` now has JSON-LD (`jsonld_count=1`)

## What Still Failed

- No critical failures in current verification run.
- No remaining failures for the three target remediation pages.

## Pages Now Clean

- `https://www.distilledfunding.com/privacy-policy`
- `https://www.distilledfunding.com/revenuebased`
- `https://www.distilledfunding.com/industries/wix-seller-financing`

## Issues Remaining Open

- `MC-005` robots meta missing validation (`open`)
- `MC-006` legacy URL intent triage (`open`)
- Target-page remediation issues are now `verified_fixed`:
  - `MC-001`, `MC-002`, `MC-003`, `MC-004`
