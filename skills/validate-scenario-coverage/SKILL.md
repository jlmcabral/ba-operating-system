---
name: validate-scenario-coverage
description: Check whether acceptance criteria cover key unhappy paths and error states, not just the happy path. Use when validating Stories — Bugs/Tasks skip.
---

Purpose: Check whether AC cover the most important unhappy paths, error states, and boundary conditions implied by story context.

Input: canonical_issue, issue_type.

Instructions:

1. Read AC and problem statement/description.
2. Identify unhappy paths implied by story context: invalid/missing input, permission/access denial, system/dependency failure, boundary conditions (max items, zero results, duplicates), concurrent/conflicting actions.
3. Check which are covered by existing AC scenarios.
4. Flag significant gaps — unhappy paths any reasonable engineer or tester would expect but are absent. Don't flag every conceivable edge case.
5. Genuinely simple story (display-only, no input): note no gaps found.

Output:
- findings — list of finding objects, empty if coverage is adequate. Each object uses:
  - category — `scenario-coverage`
  - message — missing unhappy path or error state, including why it would be raised in refinement
  - severity — `critical` if zero unhappy paths are present and error states are clearly implied, `minor` if some are covered but significant gaps remain
