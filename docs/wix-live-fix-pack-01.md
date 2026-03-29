# Wix Live Fix Pack 01

Scope: First live implementation package for the three highest-priority Phase 0 pages.

## Page: https://www.distilledfunding.com/privacy-policy

- URL: `https://www.distilledfunding.com/privacy-policy`
- Issue:
  - Missing meta description
  - Missing JSON-LD
- Why it matters:
  - Trust page can show weak or auto-generated snippets in search.
  - No structured page context on a high-trust URL.
- Exact Wix implementation location:
  - Meta description: `Wix Dashboard -> Pages & Menu -> Privacy Policy -> SEO Basics`
  - JSON-LD: `Wix Dashboard -> Pages & Menu -> Privacy Policy -> Advanced SEO -> Structured data markup`
  - Fallback if needed: `Wix Dashboard -> Settings -> Custom Code` (target this URL only)
- Exact recommended fix:
  - Add a page-specific meta description.
  - Add one minimal `WebPage` JSON-LD block that matches visible page intent.
- Ready-to-paste meta description:
  - `Read Moonshine Capital's privacy policy to understand what data we collect, how we use it, and what choices you have to manage your information.`
- Ready-to-paste JSON-LD:

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Privacy Policy | Moonshine Capital",
  "url": "https://www.distilledfunding.com/privacy-policy",
  "description": "Read Moonshine Capital's privacy policy to understand what data we collect, how we use it, and what choices you have to manage your information.",
  "isPartOf": {
    "@type": "WebSite",
    "url": "https://www.distilledfunding.com/"
  },
  "inLanguage": "en-US"
}
```

- Validation steps after publishing:
  - Open page source and confirm `<meta name="description">` is present with the exact text.
  - Confirm one `application/ld+json` block is present on this page.
  - Re-run verifier: `npm run verify` and confirm this URL no longer reports missing meta/JSON-LD.

## Page: https://www.distilledfunding.com/revenuebased

- URL: `https://www.distilledfunding.com/revenuebased`
- Issue:
  - Missing JSON-LD
- Why it matters:
  - Primary money page has no structured service context for crawlers.
- Exact Wix implementation location:
  - JSON-LD: `Wix Dashboard -> Pages & Menu -> Revenue-Based Financing page -> Advanced SEO -> Structured data markup`
  - Fallback if needed: `Wix Dashboard -> Settings -> Custom Code` (target this URL only)
- Exact recommended fix:
  - Add one minimal `Service` JSON-LD block aligned to visible page content.
- Ready-to-paste meta description if needed:
  - No update needed in this fix pack (meta description already exists from verification run).
- Ready-to-paste JSON-LD:

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Revenue-Based Financing",
  "serviceType": "Revenue-Based Financing",
  "url": "https://www.distilledfunding.com/revenuebased",
  "provider": {
    "@type": "Organization",
    "name": "Moonshine Capital"
  },
  "description": "Revenue-based financing options for business growth."
}
```

- Manual completion fields:
  - None required for this minimal valid block.
- Validation steps after publishing:
  - Open page source and confirm one `application/ld+json` block is present.
  - Validate JSON-LD syntax in Rich Results Test or Schema Markup Validator.
  - Re-run verifier: `npm run verify` and confirm JSON-LD count is no longer zero for this URL.

## Page: https://www.distilledfunding.com/industries/wix-seller-financing

- URL: `https://www.distilledfunding.com/industries/wix-seller-financing`
- Issue:
  - Missing JSON-LD
- Why it matters:
  - Template candidate page is schema-empty and weak for future scalable rollouts.
- Exact Wix implementation location:
  - JSON-LD: `Wix Dashboard -> Pages & Menu -> Wix Seller Financing page -> Advanced SEO -> Structured data markup`
  - Fallback if needed: `Wix Dashboard -> Settings -> Custom Code` (target this URL only)
- Exact recommended fix:
  - Add one minimal `WebPage` JSON-LD block and use this pattern for future `/industries/*` pages.
- Ready-to-paste meta description if needed:
  - No update needed in this fix pack (meta description already exists from verification run).
- Ready-to-paste JSON-LD:

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Wix Seller Financing (2026): Funding Options for Wix Stores (Fast + Realistic)",
  "url": "https://www.distilledfunding.com/industries/wix-seller-financing",
  "description": "Running a Wix store and need capital? Explore funding options, what lenders look for, and how to improve approval odds.",
  "about": {
    "@type": "Thing",
    "name": "Wix Seller Financing"
  },
  "isPartOf": {
    "@type": "WebSite",
    "url": "https://www.distilledfunding.com/"
  },
  "inLanguage": "en-US"
}
```

- Manual completion fields:
  - None required for this minimal valid block.
- Validation steps after publishing:
  - Open page source and confirm one `application/ld+json` block is present.
  - Validate JSON-LD syntax in Rich Results Test or Schema Markup Validator.
  - Re-run verifier: `npm run verify` and confirm JSON-LD count is no longer zero for this URL.

## Hold / Validate Before Editing

- Robots meta policy (`https://www.distilledfunding.com/` and other sampled URLs):
  - Do not add robots meta tags automatically.
  - First confirm indexation policy and whether directives are needed at page level.
- Legacy blog URL disposition (`https://www.distilledfunding.com/post/warp-speed-mortgage-review`):
  - Do not redirect, noindex, or canonical-shift automatically.
  - Complete keep/merge/redirect decision first.
