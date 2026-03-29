# Wix Automation Pack 01

This pack is the furthest-automated version of the current Phase 0 SEO fixes that could be prepared without a successful live write to Wix.

## Files in this pack

- `wix/custom-embed-seo-fixes.html`
  - One-shot custom embed payload.
  - Injects page-specific meta description and JSON-LD by `window.location.pathname`.
- `wix/velo/seo-fixes.js`
  - Reusable Velo payload source.
  - Keeps page-specific SEO fix data in one place for future site-level code usage.

## Current target pages

1. `https://www.distilledfunding.com/privacy-policy`
2. `https://www.distilledfunding.com/revenuebased`
3. `https://www.distilledfunding.com/industries/wix-seller-financing`

## What this pack changes

### Privacy Policy
- Adds a strong meta description.
- Adds minimal `WebPage` JSON-LD.

### Revenue-Based Financing
- Adds minimal `Service` JSON-LD.

### Wix Seller Financing
- Adds minimal `WebPage` JSON-LD.

## Recommended deployment order

### Path A: Custom Embed
Use `wix/custom-embed-seo-fixes.html` as the first live deployment payload.

Target behavior:
- Site-wide embed in `HEAD`
- Logic only fires on the 3 specified paths
- Fastest way to land all 3 fixes with one payload

### Path B: Velo Reusable Layer
Use `wix/velo/seo-fixes.js` as the source object if you later wire this into site code for repeatable SEO fixes or future `/industries/*` expansion.

## Validation after deployment

After any live deployment, re-run:

```bash
npm run verify
```

Expected results:
- `/privacy-policy` should no longer report missing meta description
- `/privacy-policy` should no longer report missing JSON-LD
- `/revenuebased` should no longer report missing JSON-LD
- `/industries/wix-seller-financing` should no longer report missing JSON-LD

## Limitation hit during automation

A direct live write through the connected Wix API path was attempted, but the execution layer blocked the actual site-level API calls before they reached Wix. Because of that, the repo now contains deployment-ready assets, but this document does **not** claim the live site is already updated.
