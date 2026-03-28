# Cleanup Triage Prompt

## Objective

Classify an existing URL or asset for Phase 0 cleanup.

## Inputs Required

- URL or asset name
- current page purpose
- traffic or business value if known
- canonical target if known
- trust issues if any
- duplicate or thin-content notes

## Instructions

1. Classify each asset as keep, improve, merge, redirect, noindex, remove, or investigate.
2. Do not invent redirect targets.
3. Explain the business and SEO reason for the classification.
4. Flag if brand naming or trust anchors are broken.
5. If the evidence is incomplete, return `investigate`.

## Output Format

- classification
- reason
- prerequisites before implementation
- data row to add to `data/action_queue.csv`
