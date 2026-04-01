# Wix CMS Schema: Industry Pages

Use this as the implementation spec for Phase 1 `industry pages` in Wix CMS and Dynamic Pages.

## 1) Collection Architecture

Create these 4 collections:

1. `industryPages` (primary collection; 1 row = 1 dynamic page)
2. `industryFaqs` (FAQ repeater + FAQPage schema source)
3. `industryModules` (content cards/sections, images, badges, stat callouts)
4. `industryLinks` (internal and outbound supporting links)

Optional later:

5. `industryQaRuns` (QA run history and blockers)

## 2) Primary Collection: `industryPages`

Dynamic item route target: `/industries/{slug}`

| Field Key | Wix Field Type | Required | Example | Purpose |
|---|---|---:|---|---|
| `title` | Text | Yes | `Restaurant Funding` | CMS item label for operators |
| `slug` | Text | Yes | `restaurant-funding` | Dynamic URL segment; unique per page |
| `status` | Text | Yes | `planned` | Workflow state machine value |
| `pageFamily` | Text | Yes | `industry_pages` | Keep family explicit for governance |
| `priority` | Number | Yes | `1` | Rollout sequencing |
| `launchBatch` | Text | No | `batch_01` | Controlled release grouping |
| `primaryKeyword` | Text | Yes | `restaurant funding` | Main keyword target |
| `secondaryKeywords` | Tags | No | `restaurant cash flow,restaurant working capital` | Variant terms for content guidance |
| `searchIntent` | Text | Yes | `commercial_investigation` | Intent governance |
| `funnelStage` | Text | Yes | `decision` | Funnel mapping |
| `parentPagePath` | Text | Yes | `/industries` | Internal linking parent |
| `h1` | Text | Yes | `Funding for Restaurant Businesses` | Rendered H1 |
| `heroHeadline` | Text | Yes | `Flexible Funding for Restaurant Operators` | Hero headline block |
| `heroSubhead` | Text | Yes | `Cover payroll, inventory, and timing gaps.` | Hero support copy |
| `heroImage` | Image | Yes | `restaurant-kitchen.jpg` | Hero visual |
| `heroImageAlt` | Text | Yes | `Restaurant team working in a commercial kitchen` | Accessibility + image SEO |
| `industryIcon` | Image | No | `restaurant-icon.png` | Optional visual marker |
| `heroBadge` | Text | No | `Industry Focus` | Optional visual accent |
| `industryContext` | Rich Text | Yes | `...` | Industry pain/context section |
| `financingNeedsIntro` | Rich Text | Yes | `...` | Use-of-funds intro section |
| `qualificationIntro` | Rich Text | Yes | `...` | Qualification/documentation section |
| `processOverview` | Rich Text | Yes | `...` | How process works section |
| `disclosureBlock` | Rich Text | Yes | `...` | Required trust/disclosure copy |
| `ctaType` | Text | Yes | `start_application` | CTA governance type |
| `primaryCtaLabel` | Text | Yes | `Start Your Application` | Main CTA label |
| `primaryCtaUrl` | URL | Yes | `/apply` | Main CTA destination |
| `secondaryCtaLabel` | Text | No | `Talk With Our Team` | Secondary CTA label |
| `secondaryCtaUrl` | URL | No | `/contact` | Secondary CTA destination |
| `servicePageUrl` | URL | Yes | `/revenuebased` | Required internal link target |
| `trustPageUrl` | URL | Yes | `/privacy-policy` | Required trust link target |
| `siblingFallbackUrl` | URL | Yes | `/industries/wix-seller-financing` | Required sibling-industry link target |
| `seoTitle` | Text | Yes | `Restaurant Funding | Distilled Funding by Moonshine Capital` | SEO title |
| `metaDescription` | Text | Yes | `Funding solutions for restaurant operators...` | Meta description |
| `canonicalUrl` | URL | Yes | `https://www.distilledfunding.com/industries/restaurant-funding` | Canonical governance |
| `robotsDirective` | Text | Yes | `index,follow` | Index policy control |
| `ogTitle` | Text | Yes | `Restaurant Funding` | Social title |
| `ogDescription` | Text | Yes | `Explore funding options for restaurants...` | Social description |
| `ogImage` | Image | Yes | `restaurant-social.jpg` | Social image |
| `schemaTypes` | Tags | Yes | `WebPage,Service,FAQPage,BreadcrumbList` | Required schema set |
| `serviceName` | Text | Yes | `Revenue-Based Financing` | Service schema support |
| `serviceCategory` | Text | Yes | `Business Funding` | Service schema support |
| `faqSchemaEnabled` | Boolean | Yes | `true` | Toggle FAQ schema emission |
| `metadataApproved` | Boolean | Yes | `false` | QA gate |
| `schemaApproved` | Boolean | Yes | `false` | QA gate |
| `linksApproved` | Boolean | Yes | `false` | QA gate |
| `disclosureApproved` | Boolean | Yes | `false` | QA gate |
| `contentApproved` | Boolean | Yes | `false` | QA gate |
| `qaPass` | Boolean | Yes | `false` | Final QA pass state |
| `publishReady` | Boolean | Yes | `false` | Hard publish gate |
| `publishedUrl` | URL | No | `https://www.distilledfunding.com/industries/restaurant-funding` | Live URL tracking |
| `lastQaAt` | Date and Time | No | `2026-04-01T11:30:00-04:00` | QA timestamp |
| `lastQaBy` | Text | No | `seo-ops` | QA owner |
| `blockerReason` | Rich Text | No | `Missing canonical confirmation` | Fail-loud blocker log |
| `opsNotes` | Rich Text | No | `Needs legal wording review` | Operator notes |

## 3) Supporting Collection: `industryFaqs`

| Field Key | Wix Field Type | Required | Example | Purpose |
|---|---|---:|---|---|
| `question` | Text | Yes | `How quickly can restaurants access funding?` | FAQ question |
| `answer` | Rich Text | Yes | `...` | FAQ answer body |
| `sortOrder` | Number | Yes | `1` | Display order |
| `isActive` | Boolean | Yes | `true` | Show/hide item |
| `schemaInclude` | Boolean | Yes | `true` | Include in FAQPage schema |
| `industryPageRef` | Reference (`industryPages`) | Yes | `restaurant-funding row` | Binds FAQ to page |
| `sourceNote` | Text | No | `From sales call notes` | Evidence traceability |

## 4) Supporting Collection: `industryModules`

Use this for flexible dynamic sections so pages can feel more premium without hardcoding each layout variation.

| Field Key | Wix Field Type | Required | Example | Purpose |
|---|---|---:|---|---|
| `industryPageRef` | Reference (`industryPages`) | Yes | `restaurant-funding row` | Binds module to page |
| `moduleType` | Text | Yes | `use_of_funds_card` | Render variant control |
| `headline` | Text | No | `Keep Payroll On Schedule` | Module headline |
| `body` | Rich Text | No | `...` | Module body |
| `statValue` | Text | No | `24-48 hrs` | Highlight stat |
| `statLabel` | Text | No | `Typical review window` | Stat description |
| `mediaImage` | Image | No | `payroll-team.jpg` | Section visual |
| `mediaImageAlt` | Text | No | `Restaurant manager reviewing payroll` | Accessibility + image SEO |
| `buttonLabel` | Text | No | `Start Application` | Optional module CTA |
| `buttonUrl` | URL | No | `/apply` | Optional module CTA link |
| `badgeText` | Text | No | `Common Need` | Optional badge |
| `sortOrder` | Number | Yes | `1` | Render order |
| `isActive` | Boolean | Yes | `true` | Show/hide module |

## 5) Supporting Collection: `industryLinks`

| Field Key | Wix Field Type | Required | Example | Purpose |
|---|---|---:|---|---|
| `industryPageRef` | Reference (`industryPages`) | Yes | `restaurant-funding row` | Binds link to page |
| `linkType` | Text | Yes | `sibling_industry` | Rule category for QA |
| `linkLabel` | Text | Yes | `Funding for Ecommerce Businesses` | Anchor label |
| `linkUrl` | URL | Yes | `/industries/ecommerce-business-funding` | Link target |
| `isRequired` | Boolean | Yes | `true` | Required link gate |
| `sortOrder` | Number | Yes | `1` | Display order |
| `isActive` | Boolean | Yes | `true` | Show/hide link |

## 6) Dynamic Page Wiring (Exact)

1. Create a Dynamic Item page from `industryPages` with URL pattern `/industries/{slug}`.
2. Bind hero block:
   - headline: `heroHeadline`
   - subhead: `heroSubhead`
   - image: `heroImage`
   - image alt text: `heroImageAlt`
3. Bind H1 and core sections:
   - H1: `h1`
   - body sections from `industryContext`, `financingNeedsIntro`, `qualificationIntro`, `processOverview`, `disclosureBlock`
4. Bind CTAs:
   - primary button label/url: `primaryCtaLabel` + `primaryCtaUrl`
   - optional secondary CTA from secondary fields
5. Bind repeaters:
   - FAQ repeater from `industryFaqs` filtered by `industryPageRef = current item` and `isActive = true`, sorted by `sortOrder`
   - module repeater from `industryModules` with same filtering and order
   - related links repeater from `industryLinks` with same filtering and order
6. Configure SEO settings from CMS fields:
   - title: `seoTitle`
   - meta description: `metaDescription`
   - canonical: `canonicalUrl`
   - OG: `ogTitle`, `ogDescription`, `ogImage`
7. In publish logic, block any record where `publishReady != true`.

## 7) Status Workflow (Exact Values + Gates)

Use these exact `status` values in `industryPages`:

1. `planned`
2. `brief_ready`
3. `drafting`
4. `ready_for_qa`
5. `qa_blocked`
6. `qa_passed`
7. `publish_approved`
8. `scheduled`
9. `published`
10. `monitoring`
11. `refresh_needed`
12. `retired`

Allowed transitions:

- `planned -> brief_ready -> drafting -> ready_for_qa`
- `ready_for_qa -> qa_passed` or `ready_for_qa -> qa_blocked`
- `qa_blocked -> drafting` after fixes
- `qa_passed -> publish_approved -> scheduled -> published`
- `published -> monitoring -> refresh_needed -> drafting`
- `published -> retired` when merged/redirected/noindexed by policy

Gate rules by state:

- Move to `brief_ready` only if: `primaryKeyword`, `searchIntent`, `funnelStage`, `priority` are populated.
- Move to `ready_for_qa` only if all required content/media/link/meta fields are populated.
- Move to `qa_passed` only if all booleans are true:
  - `metadataApproved`
  - `schemaApproved`
  - `linksApproved`
  - `disclosureApproved`
  - `contentApproved`
- Move to `publish_approved` only if:
  - `qaPass = true`
  - `publishReady = true`
  - `canonicalUrl` is present and final
- Move to `published` only after URL confirms live and index policy is intentional.

Fail-loud rule:

- If any required field or gate boolean is missing/false, force `status = qa_blocked` and fill `blockerReason`.

## 8) Ready-to-Implement Checklist

1. Create collection `industryPages` and add every field in Section 2.
2. Mark required fields exactly as specified; do not relax canonical/metadata/disclosure gates.
3. Create `industryFaqs`, `industryModules`, and `industryLinks` with reference fields to `industryPages`.
4. Build dynamic route `/industries/{slug}` from `industryPages`.
5. Connect page elements and repeaters exactly per Section 6.
6. Set SEO settings to read from CMS fields, not hardcoded page settings.
7. Import current seed rows from `data/phase1_rollout_candidates.csv`:
   - map `slug -> slug`
   - map `primary_keyword -> primaryKeyword`
   - map `page_family -> pageFamily`
   - map `search_intent -> searchIntent`
   - map `funnel_stage -> funnelStage`
   - map `priority -> priority`
   - map `schema_type -> schemaTypes`
   - map `parent_page -> parentPagePath`
   - map `cta_type -> ctaType`
   - map `status -> status`
   - map `notes -> opsNotes`
8. Initialize all gate booleans to `false` on import.
9. Run first batch through workflow:
   - `planned -> brief_ready -> drafting -> ready_for_qa -> qa_passed`
10. Publish only rows with:
   - `status = publish_approved` or `scheduled`
   - `publishReady = true`
   - no `blockerReason`
