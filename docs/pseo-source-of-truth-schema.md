# pSEO Source-of-Truth Schema

## Purpose

Define the minimum controlled inputs required before future structured page generation starts.

## Core Tables

### `data/url_inventory.csv`

Use for live-site inventory and URL disposition.

Suggested meanings:

- `url`: absolute URL or controlled path
- `page_type`: homepage, about, service, comparison, tool, profile, legacy, other
- `status_code`: last known HTTP status
- `index_state`: indexable, noindex, blocked, unknown
- `canonical_target`: approved canonical target or blank
- `owner`: decision owner
- `action`: keep, improve, merge, redirect, remove, investigate
- `notes`: short rationale

### `data/redirects.csv`

Use only for approved redirect mappings.

- `source_url`
- `target_url`
- `redirect_type`
- `reason`
- `status`

### `data/canonicals.csv`

Use for canonical governance.

- `url`
- `canonical_url`
- `canonical_status`
- `reason`
- `notes`

### `data/keyword_clusters.csv`

Use for future opportunities, not immediate page generation.

- `cluster_id`
- `topic`
- `intent`
- `primary_keyword`
- `secondary_keywords`
- `target_page_type`
- `priority`
- `notes`

### `data/five_url_verification.csv`

Use for controlled representative QA.

- `url`
- `page_type`
- `metadata_pass`
- `canonical_pass`
- `schema_pass`
- `trust_pass`
- `crawl_pass`
- `notes`

### `data/action_queue.csv`

Use for operator work management.

- `task_id`
- `category`
- `priority`
- `asset`
- `owner`
- `status`
- `next_step`
- `notes`

## Required Inputs Before Page Generation

Do not generate a structured page family until these inputs are available:

- approved page blueprint
- approved target keyword cluster
- canonical rule
- disclosure rule
- schema requirement
- QA checklist

## Failure Conditions

Stop and escalate if any of the following are missing:

- canonical target
- brand-safe naming
- trust/disclosure requirement
- template-level schema mapping
- indexation intent
