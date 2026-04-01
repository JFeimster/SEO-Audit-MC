# Robots Meta Policy

## Decision
Absence of a robots meta tag is acceptable on indexable pages.

## Policy Rules
- Default indexable pages do NOT need explicit `<meta name="robots" content="index, follow">`.
- Only add robots meta when a non-default directive is required (e.g., `noindex`, `nofollow`, `max-snippet`, etc.).
