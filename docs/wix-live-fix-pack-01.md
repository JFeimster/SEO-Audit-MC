# Wix Live Fix Pack 01

Scope: First live remediation pass for the highest-priority Phase 0 pages.

## 1) https://www.distilledfunding.com/privacy-policy

- URL: `https://www.distilledfunding.com/privacy-policy`
- Issue:
  - Missing meta description
  - Missing JSON-LD
- Current risk:
  - Trust page snippet control is weak in search results.
  - No structured page context for crawlers on a key trust asset.
- Exact recommended page-level fix:
  - Add a page-specific meta description in Wix SEO settings.
  - Add one page-specific JSON-LD block (`WebPage`) with fields below.
- Exact meta description draft:
  - `Read Moonshine Capital's privacy policy to understand what data we collect, how we use it, and what choices you have to manage your information.`
- Exact JSON-LD recommendation:

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

- Implementation notes (Wix):
  - Go to **Pages & Menu -> Privacy Policy -> SEO Basics** and update meta description.
  - Add JSON-LD in **Advanced SEO -> Structured data markup** for this page.
  - If page-level structured data UI is unavailable, use **Settings -> Custom Code** and target this URL only.

## 2) https://www.distilledfunding.com/revenuebased

- URL: `https://www.distilledfunding.com/revenuebased`
- Issue:
  - Missing JSON-LD
- Current risk:
  - Primary money page has no structured entity/service context.
- Exact recommended page-level fix:
  - Add one page-specific JSON-LD block (`Service`) aligned to visible content.
- Exact meta description draft where needed:
  - No change required in this pack (meta description already present in verification output).
- Exact JSON-LD recommendation:

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
  "description": "Revenue-based financing options for business growth.",
  "areaServed": "<FILL_MANUALLY_IF_USED>",
  "offers": "<FILL_MANUALLY_OR_REMOVE>"
}
```

- Implementation notes (Wix):
  - Add structured data for this page only in **Advanced SEO -> Structured data markup**.
  - Remove `areaServed` and `offers` if not confirmed before publish.
  - Keep schema copy aligned with on-page terms used in the visible hero/body text.

## 3) https://www.distilledfunding.com/industries/wix-seller-financing

- URL: `https://www.distilledfunding.com/industries/wix-seller-financing`
- Issue:
  - Missing JSON-LD
- Current risk:
  - Template candidate page is schema-empty, weakening future template rollout quality.
- Exact recommended page-level fix:
  - Add one reusable page-level JSON-LD block (`WebPage`) for industry template pages.
- Exact meta description draft where needed:
  - No change required in this pack (meta description already present in verification output).
- Exact JSON-LD recommendation:

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

- Implementation notes (Wix):
  - Add structured data on this page first, then copy pattern to future `/industries/*` pages.
  - Keep `name`, `url`, and `description` page-specific when reusing the pattern.

## Do not change yet

- Robots-meta policy:
  - Verification flagged missing robots meta, but this is not automatically a defect.
  - Do not add robots meta tags until indexation policy is explicitly decided.
- Legacy blog URL disposition:
  - Do not redirect or noindex `/post/warp-speed-mortgage-review` until keep/merge/redirect decision is approved.
