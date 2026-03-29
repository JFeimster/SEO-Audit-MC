# Post Wix Fix Summary

## Scope

- Verification source: `data/five_url_verification.csv`
- Run timestamp: `2026-03-29T03:49:04.667Z`
- Deployment method under review: `Custom Embeds API` (`2cc73d0f-5700-4841-aee0-3e97c09c85f6`)

## What Passed

- All 5 URLs passed critical checks used by the verifier:
  - status code `200`
  - title present
  - canonical present

## What Still Failed

- `https://www.distilledfunding.com/privacy-policy`
  - meta description still missing in static verifier output
  - JSON-LD count still `0`
- `https://www.distilledfunding.com/revenuebased`
  - JSON-LD count still `0`
- `https://www.distilledfunding.com/industries/wix-seller-financing`
  - JSON-LD count still `0`

## Pages Now Clean

- Critical checks only:
  - `https://www.distilledfunding.com/`
  - `https://www.distilledfunding.com/privacy-policy`
  - `https://www.distilledfunding.com/revenuebased`
  - `https://www.distilledfunding.com/post/warp-speed-mortgage-review`
  - `https://www.distilledfunding.com/industries/wix-seller-financing`

## Issues Remaining Open

- `MC-005` robots meta missing validation (`open`)
- `MC-006` legacy URL intent triage (`open`)
- Target-page meta/JSON-LD items are now `implemented_in_wix` pending JS-aware validation:
  - `MC-001`, `MC-002`, `MC-003`, `MC-004`
