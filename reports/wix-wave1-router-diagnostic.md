# Wix Wave 1 Router Diagnostic

- Generated at: `2026-04-01T22:20:23.819Z`
- Site: `https://www.distilledfunding.com`
- Scope: `/industries/*` Wave 1 dynamic route verification

## Key Findings

1. Valid and invalid `/industries/*` slugs render the same fallback metadata:
   - `<title>`: `Wix Seller Financing (2026): Funding Options for Wix Stores (Fast + Realistic)`
   - `meta description`: `Running a Wix store and need capital? Explore the best financing options—what lenders look for, what to prepare, and how to improve approval odds quickly.`
   - `og:title`: `Wix Seller Financing (2026): Funding Options for Wix Stores (Fast + Realistic)`
2. Invalid probe URL (`/industries/not-a-real-industry-slug-zz`) returns `200` and resolves to the same page object as valid slugs.
3. Live `wix-viewer-model` router config does not include an `industries` dynamic router prefix.

## Live Router Prefixes Observed

- `account`
- `business-loan-affiliate-partner-hub`
- `funding`
- `funding-products`
- `funding-tools`
- `hub`
- `news-1`
- `pricing-plans`
- `profile`

## Conclusion

The production `/industries/*` path is currently operating as a static/fallback route pattern, not as an item-level dynamic route bound to `industryPages`.

Wave 1 status must remain `ready_for_qa` until the `industries` dynamic router/item template is repaired in Wix Editor and `npm run verify:wix:live` returns zero errors.

