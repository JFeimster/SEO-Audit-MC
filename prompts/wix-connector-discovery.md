# Wix Connector Discovery Prompt

Use this prompt in ChatGPT with the Wix connector enabled.

## Goal

Discover the current CMS state for Wave 1 industry pages and output patch candidates only.

Do not perform any writes.

## Instructions

1. List available Wix CMS collections for this site.
2. Identify the collection named `industryPages` or the closest equivalent collection used for `/industries/{slug}` pages.
3. Fetch the schema for that collection, including field keys and field types.
4. If related collections exist for FAQs, modules, or links, list them separately and show their schema keys.
5. Query the Wave 1 industry items for these slugs:
   - `wix-seller-financing`
   - `ecommerce-business-funding`
   - `restaurant-funding`
   - `trucking-funding`
   - `construction-contractor-funding`
6. For each Wave 1 item, inspect these fields when present:
   - `slug`
   - `seoTitle`
   - `metaDescription`
   - `canonicalUrl`
   - `ogTitle`
   - `ogDescription`
   - `robotsDirective`
   - `h1`
   - `heroHeadline`
   - `heroSubhead`
   - any publish or page-link related fields
7. Identify:
   - missing values
   - blank values
   - obvious value mismatches against approved repo expectations
   - missing items
   - missing collection capabilities relevant to patching
8. Output patch candidates only. Do not write to Wix.

## Required Output Format

### 1. Collection Inventory

For each relevant collection, provide:

- collection name
- collection ID if available
- display field if available
- whether read or update capability appears available
- whether publish or page-link related fields or plugins are visible

### 2. Wave 1 Item Audit

For each Wave 1 slug, provide:

- slug
- item ID if available
- whether the item exists
- current values for the inspected fields
- fields that are blank or missing

### 3. Patch Candidates

Output a flat table with:

- `collection_id`
- `item_id`
- `slug`
- `field_key`
- `current_value`
- `proposed_value`
- `reason`
- `recommended_status`

Rules:

- `recommended_status` must be one of `draft_pending_discovery`, `needs_approval`, or `ready_for_approval`
- if a field is already correct, do not create a patch candidate for it
- if a required value cannot be determined from repo evidence, say `needs_repo_decision`

### 4. Editor-Only Findings

List anything that appears unpatchable through CMS fields alone, such as:

- route creation or repair
- dynamic page binding
- SEO binding in page settings
- repeater or widget binding

## Safety Rules

- Never perform writes.
- Never modify page routes, template layout, or publish state.
- Never invent item IDs or field keys.
- Never mark anything complete without evidence returned by the connector.
