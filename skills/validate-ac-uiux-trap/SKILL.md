---
name: validate-ac-uiux-trap
description: Check whether acceptance criteria describe user outcomes or interface behaviour. Use when validating Stories or Bugs — skip for Tasks.
---

Purpose: Check whether AC describe user outcomes or interface behaviour. Criteria describing how UI looks constrains engineering unnecessarily and becomes wrong when design changes.

Input: canonical_issue, issue_type.

Instructions:

1. For every criterion, ask: is this describing a user outcome or an interface?
2. Signals of UI/UX trap: criteria mention visual states (greyed out, highlighted, red border), describe component behaviour (dropdown shows X items, button disabled), specify layout or positioning.
3. For each criterion describing UI behaviour:
   - If UI detail is unnecessary: flag as UI/UX trap, suggest outcome-focused rewrite.
   - If UI detail is genuinely necessary (no design exists): flag as design debt — not permanent criterion.
4. Absence of design file is not reason to describe UI in AC. Write outcome-focused criteria leaving design decisions open.

Output:
- findings — list of finding objects, empty if all pass. Each object uses:
  - category — `ac-uiux-trap`
  - message — issue description with suggested rewrite or design-debt note
  - severity — `critical` if majority are UI/UX-focused, `minor` if 1-2 carry design debt markers
