# Wix Remediation Punchlist

| Page | Problem | Why it matters | Exact recommended fix | Priority |
| --- | --- | --- | --- | --- |
| https://www.distilledfunding.com/privacy-policy | Missing meta description | Weak SERP snippet control on trust page | In Wix SEO settings, add a unique 140-160 char meta description aligned to privacy/trust intent | High |
| https://www.distilledfunding.com/revenuebased | Missing JSON-LD | Money page lacks structured entity signals | Add JSON-LD in Wix custom code for the page (start with `WebPage` + `FinancialService` mapping to visible content) | High |
| https://www.distilledfunding.com/privacy-policy | Missing JSON-LD | Trust page lacks structured page/entity context | Add JSON-LD in Wix custom code (start with `WebPage` or `AboutPage` tied to page purpose) | Medium |
| https://www.distilledfunding.com/industries/wix-seller-financing | Missing JSON-LD | Template candidate is schema-empty; weak for scaled rollout | Add JSON-LD block and save as template pattern for future industry pages | Medium |
| https://www.distilledfunding.com/post/warp-speed-mortgage-review | Legacy URL may be weak/off-intent | Can dilute topical focus if unmanaged | Run keep/merge/redirect decision and document final action before changing | Medium |
| https://www.distilledfunding.com/ | Robots meta missing | Not always a defect; can cause unnecessary changes | Validate indexation policy first. If no explicit directive needed, leave as-is and document decision | Low |
