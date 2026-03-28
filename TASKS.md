# Tasks

## Phase 0 Checklist

- [ ] Normalize brand references to `Distilled Funding by Moonshine Capital`
- [ ] Quarantine or remove any use of `Capitol Accelerator`
- [ ] Confirm `robots.txt` only contains crawl directives
- [ ] Confirm `ads.txt` exists separately if ads inventory is used
- [ ] Build initial `data/url_inventory.csv`
- [ ] Classify junk, thin, duplicate, legacy, and keeper URLs
- [ ] Map redirect candidates in `data/redirects.csv`
- [ ] Map canonical targets in `data/canonicals.csv`
- [ ] Repair trust anchors across About, contact, disclosures, authorship, and company identity
- [ ] Draft baseline organization, person, about page, breadcrumb, and webpage schema
- [ ] Verify 5 representative URLs in `data/five_url_verification.csv`
- [ ] Define publishing QA gates before any new page family is generated

## This Week

- Populate `data/url_inventory.csv` from the live site crawl or export
- Review current brand usage and log violations in `data/action_queue.csv`
- Resolve `robots.txt` versus `ads.txt` ownership and correct file placement
- Choose 5 representative URLs:
  - homepage
  - about or trust page
  - primary service page
  - a likely junk or thin URL
  - one candidate future template type
- Fill first-pass schema placeholders in `schemas/`

## This Month

- Complete redirect and canonical mapping for legacy or junk URLs
- Publish trust and disclosure fixes on the highest-risk pages
- Turn the 5-URL verification workflow into a repeatable QA routine
- Lock page blueprint rules for comparison, borrower profile, industry, and tool pages
- Approve the minimum viable pSEO source-of-truth schema before template generation

## Done Criteria

Phase 0 is complete when all of the following are true:

- Brand naming is consistent across priority pages
- Crawl directives and ad inventory files are correctly separated
- Junk URLs have a disposition: keep, redirect, noindex, merge, or remove
- Trust anchors are visible and materially improved
- 5 representative URLs pass metadata, canonical, schema, and disclosure review
- A publishing checklist exists and is usable without guesswork
- Future page generation has documented inputs, templates, and QA gates
