---
name: validate-ac-uiux-trap
description: Check whether acceptance criteria describe user outcomes or interface behaviour. Use when validating Stories or Bugs — skip for Tasks.
---

# Skill: Validate AC — UI/UX Trap

**Purpose:** Check whether acceptance criteria describe user outcomes or interface behaviour. Criteria describing how UI looks — instead of what must be true for users — constrain engineering unnecessarily and become wrong when design changes.

**Config references:**
- `config/quality-standards.md` — Outcome focus rules

---

## Input

- **canonical_issue** — Normalised issue context (or draft)
- **issue_type** — Story, Task, or Bug

---

## Applicability

| Issue Type | Applies? |
|------------|----------|
| Story | ✅ Yes |
| Bug | ✅ Yes |
| Task | ❌ Skip — technical work doesn't include UI/UX considerations |

If Task, skip entirely and return no findings.

---

## Instructions

1. For every criterion, ask: **is this describing a user outcome, or an interface?**

2. Signals of UI/UX trap:
   - Criteria mention visual states (greyed out, highlighted, red border)
   - Criteria describe component behaviour (dropdown shows X items, button disabled)
   - Criteria specify layout or positioning details

3. For each criterion describing UI/UX behaviour rather than user outcome:

   **If UI detail is unnecessary** (outcome-focused criterion can capture same requirement):
   - Flag as UI/UX trap
   - Suggest outcome-focused rewrite (e.g., "The user cannot submit until all required fields are valid" instead of "The submit button is greyed out")

   **If UI detail is genuinely necessary** (no design exists and behaviour would otherwise be ambiguous):
   - Flag as design debt — not permanent criterion
   - Note it should be replaced with proper design reference when available

4. Absence of design file is **not** reason to describe UI in acceptance criteria. It's reason to write outcome-focused criteria leaving design decision open.

---

## Output

- **findings** — List of UI/UX trap issues with suggested rewrites, or empty if all pass
- **severity** — `critical` if majority of criteria are UI/UX-focused; `minor` if one or two carry design debt markers
