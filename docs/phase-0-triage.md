 # Phase 0 Triage

## Mission

Stabilize search trust, crawl control, and page governance for **Distilled Funding by Moonshine Capital** before any scaled page creation.

## Priority Order

1. Normalize brand identity
2. Fix `robots.txt` / `ads.txt` split
3. Triage junk URLs
4. Repair trust anchors
5. Verify 5 representative URLs
6. Build publishing controls
7. Prepare structured page generation only after the above are stable

## Triage Buckets

### Brand

- inconsistent brand names
- old or disallowed labels
- missing parent-company relationship

### Crawl and Index

- incorrect `robots.txt`
- misplaced `ads.txt`
- duplicate URLs
- thin pages
- orphaned or low-value legacy pages

### Trust

- weak About page
- missing company identity
- missing or vague disclosures
- unclear authorship or operator identity
- poor contact or credibility signals

### Schema

- missing organization schema
- missing person schema for Jason Feimster where appropriate
- missing or broken page-level schema
- breadcrumb inconsistencies

## Representative URL Verification Set

Pick five URLs that cover:

- homepage
- about or trust page
- primary service page
- problem child or junk URL
- one candidate future template type

## Operating Rule

If a page cannot be confidently classified, do not guess.

Add it to `data/action_queue.csv` with:

- why it is blocked
- what evidence is missing
- who owns the next decision

## Exit Criteria

Phase 0 is ready to hand off into controlled generation when:

- major brand inconsistencies are resolved
- crawl directives are clean
- junk URL decisions are mapped
- trust anchors materially improve the site
- five representative URLs pass review
- publishing controls are documented and reusable
