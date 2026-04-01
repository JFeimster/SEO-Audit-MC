# Wix Wave 1 Editor Binding Sheet

- Generated at: `2026-04-01T16:24:04.959Z`
- Target site editor: `https://editor.wix.com/html/editor/web/renderer/edit/397cd6a3-8120-4723-8290-c03a073958ae?metaSiteId=cc61a0cb-edcd-43dc-bdda-42c76443dcd6`
- Wave 1 rows: `5`

Use this as the source-of-truth while fixing dynamic page/template bindings in Wix Editor.

| Slug | Route | SEO Title | Meta Description | OG Title | H1 | Hero Headline |
| --- | --- | --- | --- | --- | --- | --- |
| construction-contractor-funding | /industries/construction-contractor-funding | Contractor Business Funding \| Distilled Funding by Moonshine Capital | Explore contractor business funding options for labor, materials, and project cash flow timing. Review requirements and start your application. | Contractor Business Funding | Construction Contractor Funding for Project Cash Flow | Funding for Construction Contractors |
| ecommerce-business-funding | /industries/ecommerce-business-funding | Ecommerce Business Funding \| Distilled Funding by Moonshine Capital | Compare ecommerce business funding options for inventory, marketing, and fulfillment expenses. Review requirements and apply when ready. | Ecommerce Business Funding | Ecommerce Business Funding for Inventory and Growth | Funding for Ecommerce Operators |
| restaurant-funding | /industries/restaurant-funding | Restaurant Funding \| Distilled Funding by Moonshine Capital | Explore restaurant funding options for payroll, inventory, and equipment needs. Review qualification requirements and start an application. | Restaurant Funding | Restaurant Funding for Operating Stability and Growth | Flexible Funding for Restaurant Operators |
| trucking-funding | /industries/trucking-funding | Trucking Business Funding \| Distilled Funding by Moonshine Capital | Review trucking business funding options for fuel, payroll, maintenance, and receivables timing. See requirements and apply when ready. | Trucking Business Funding | Trucking Funding for Fleet and Cash Flow Operations | Funding for Trucking Businesses |
| wix-seller-financing | /industries/wix-seller-financing | Wix Seller Financing \| Distilled Funding by Moonshine Capital | Explore Wix seller financing options for inventory, marketing, and fulfillment cash flow needs. Review requirements and start your application. | Wix Seller Financing | Wix Seller Financing for Growing Online Stores | Flexible Financing for Wix Sellers |

## Required Wix Editor Binding Targets

- Dynamic item route: `/industries/{slug}` from collection `industryPages`.
- SEO title binding: `seoTitle`.
- Meta description binding: `metaDescription`.
- Canonical binding: `canonicalUrl`.
- OG title binding: `ogTitle`.
- OG description binding: `ogDescription`.
- OG image binding: `ogImage`.
- H1 binding: `h1`.
- Hero headline binding: `heroHeadline`.

After applying fixes, run: `npm run verify:wix:live`.

