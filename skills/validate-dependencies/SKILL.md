---
name: validate-dependencies
description: Check whether the issue implicitly relies on external capabilities, decisions, or other teams that are not acknowledged. Use when validating any issue type.
---

Purpose: Check whether issue implicitly depends on external capabilities, unreleased features, pending decisions, or work from other teams — and whether those dependencies are acknowledged.

Input: canonical_issue, issue_type.

Instructions:

1. Read full issue context.
2. Look for implicit dependencies: external systems/APIs not confirmed available, unreleased capabilities from other teams/stories, pending decisions assumed resolved, data/state assumptions undocumented, infrastructure/environment changes not scoped.
3. For each: unacknowledged and potentially blocking → critical; known but undocumented → minor.
4. Don't flag dependencies clearly resolved and evidenced in issue.
5. Phrase findings as signals to investigate, not confirmed blockers.

Output:
- findings — list of finding objects, empty if none are found. Each object uses:
  - category — `dependencies`
  - message — identified dependency and delivery risk
  - severity — `critical` if it could block delivery, `minor` if it is likely known or already resolved
