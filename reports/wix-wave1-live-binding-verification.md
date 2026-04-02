# Wix Wave 1 Live Binding Verification

- Generated at: `2026-04-01T22:20:27.246Z`
- Wave 1 URLs inspected: `5`
- Errors: `16`
- Warnings: `5`

## Findings

| Severity | Slug | Check | Expected | Actual | Message |
| --- | --- | --- | --- | --- | --- |
| error | wix-seller-financing | dynamic_router_prefix_presence | dynamic router prefixes include industries | account, business-loan-affiliate-partner-hub, funding, funding-products, funding-tools, hub, news-1, pricing-plans, profile | Live viewer model does not include an industries dynamic router prefix, so /industries/* may be resolving to a static/fallback page instead of industryPages dynamic routing. |
| error | wix-seller-financing | seo_title_binding | Wix Seller Financing \| Distilled Funding by Moonshine Capital | Wix Seller Financing (2026): Funding Options for Wix Stores (Fast + Realistic) | Document title does not match Wave 1 seed seoTitle. |
| error | wix-seller-financing | meta_description_binding | Explore Wix seller financing options for inventory, marketing, and fulfillment cash flow needs. Review requirements and start your application. | Running a Wix store and need capital? Explore the best financing options—what lenders look for, what to prepare, and how to improve approval odds quickly. | Meta description does not match Wave 1 seed metaDescription. |
| error | wix-seller-financing | og_title_binding | Wix Seller Financing | Wix Seller Financing (2026): Funding Options for Wix Stores (Fast + Realistic) | OG title does not match Wave 1 seed ogTitle. |
| error | ecommerce-business-funding | seo_title_binding | Ecommerce Business Funding \| Distilled Funding by Moonshine Capital | Industries We Serve \| Moonshine Capital | Document title does not match Wave 1 seed seoTitle. |
| error | ecommerce-business-funding | meta_description_binding | Compare ecommerce business funding options for inventory, marketing, and fulfillment expenses. Review requirements and apply when ready. |  | Meta description does not match Wave 1 seed metaDescription. |
| error | ecommerce-business-funding | og_title_binding | Ecommerce Business Funding | Industries We Serve \| Moonshine Capital | OG title does not match Wave 1 seed ogTitle. |
| warning | ecommerce-business-funding | content_binding_signal | contains heroHeadline="Funding for Ecommerce Operators" or h1="Ecommerce Business Funding for Inventory and Growth" | neither string found in HTML response | Live HTML did not contain expected Wave 1 hero or H1 signal. Dynamic template/data binding may still be unresolved. |
| error | restaurant-funding | seo_title_binding | Restaurant Funding \| Distilled Funding by Moonshine Capital | Industries We Serve \| Moonshine Capital | Document title does not match Wave 1 seed seoTitle. |
| error | restaurant-funding | meta_description_binding | Explore restaurant funding options for payroll, inventory, and equipment needs. Review qualification requirements and start an application. |  | Meta description does not match Wave 1 seed metaDescription. |
| error | restaurant-funding | og_title_binding | Restaurant Funding | Industries We Serve \| Moonshine Capital | OG title does not match Wave 1 seed ogTitle. |
| warning | restaurant-funding | content_binding_signal | contains heroHeadline="Flexible Funding for Restaurant Operators" or h1="Restaurant Funding for Operating Stability and Growth" | neither string found in HTML response | Live HTML did not contain expected Wave 1 hero or H1 signal. Dynamic template/data binding may still be unresolved. |
| error | trucking-funding | seo_title_binding | Trucking Business Funding \| Distilled Funding by Moonshine Capital | Industries We Serve \| Moonshine Capital | Document title does not match Wave 1 seed seoTitle. |
| error | trucking-funding | meta_description_binding | Review trucking business funding options for fuel, payroll, maintenance, and receivables timing. See requirements and apply when ready. |  | Meta description does not match Wave 1 seed metaDescription. |
| error | trucking-funding | og_title_binding | Trucking Business Funding | Industries We Serve \| Moonshine Capital | OG title does not match Wave 1 seed ogTitle. |
| warning | trucking-funding | content_binding_signal | contains heroHeadline="Funding for Trucking Businesses" or h1="Trucking Funding for Fleet and Cash Flow Operations" | neither string found in HTML response | Live HTML did not contain expected Wave 1 hero or H1 signal. Dynamic template/data binding may still be unresolved. |
| error | construction-contractor-funding | seo_title_binding | Contractor Business Funding \| Distilled Funding by Moonshine Capital | Industries We Serve \| Moonshine Capital | Document title does not match Wave 1 seed seoTitle. |
| error | construction-contractor-funding | meta_description_binding | Explore contractor business funding options for labor, materials, and project cash flow timing. Review requirements and start your application. |  | Meta description does not match Wave 1 seed metaDescription. |
| error | construction-contractor-funding | og_title_binding | Contractor Business Funding | Industries We Serve \| Moonshine Capital | OG title does not match Wave 1 seed ogTitle. |
| warning | construction-contractor-funding | content_binding_signal | contains heroHeadline="Funding for Construction Contractors" or h1="Construction Contractor Funding for Project Cash Flow" | neither string found in HTML response | Live HTML did not contain expected Wave 1 hero or H1 signal. Dynamic template/data binding may still be unresolved. |
| warning | not-a-real-industry-slug-zz | invalid_slug_fallback_signal | invalid /industries slug should not resolve to same pageId as valid Wave 1 slugs | status=200, pageId=cp4jk | Invalid industries slug resolved to the same live pageId as valid slugs, indicating a static/fallback route pattern instead of item-level dynamic routing. |

