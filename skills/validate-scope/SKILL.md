---
name: validate-scope
description: Assess whether an issue covers more than one distinct user need or independently deliverable outcome. Use when validating any issue type — critical blocker when it fails.
---

Purpose: Assess whether issue is trying to do too much — covering more than one distinct user need or independently deliverable outcome.

Input: canonical_issue, issue_type.

Instructions:

1. Read config/quality-standards.md for scope assessment rules.
2. Check breadth — flag if issue addresses more than one distinct user need/outcome, would need a different mental model per role, or Task work could be split independently.
3. Check AC volume — flag if scenarios cover significantly different situations or user journeys.
4. Long issue is not automatically a split candidate. Test is whether parts represent distinct user outcomes.
5. If scope issue found: identify distinct needs, suggest split (Part A / Part B), note user should confirm before proceeding.

Output:
- findings — list of finding objects, empty if check passes. Each object uses:
  - category — `scope`
  - message — description of the scope issue with suggested split
  - severity — `critical`
