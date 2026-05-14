---
name: validate-design-reference
description: Check whether a user-facing story references a design (Figma or equivalent) when one would be expected. Use when validating Stories — missing design references are a common gap raised in refinement sessions.
---

Purpose: Check whether a user-facing story involving new or significantly changed UI references a design file, or explicitly acknowledges design is pending.

Input: canonical_issue, issue_type.

Instructions:

1. Determine whether issue involves new or significantly changed UI: new screen/page/modal/flow, changes requiring visual design decisions, AC referencing user-visible elements.
2. If no new/changed UI (behaviour-only, background processing): skip check.
3. If new/changed UI: check for Figma link, design document reference, or explicit acknowledgement that design is pending.
4. If none present: produce finding — engineering won't know what to build.

Output:
- finding — description of missing design reference, or null if reference exists or issue doesn't require one
- severity — minor (always — missing design is a gap but not always a delivery blocker)
