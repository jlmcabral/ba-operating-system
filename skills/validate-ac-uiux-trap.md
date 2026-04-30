# Skill: Validate AC — UI/UX Trap

**Purpose:** Check whether acceptance criteria describe user outcomes or interface behaviour. When criteria describe how the UI looks instead of what must be true for the user, they constrain engineering unnecessarily and become wrong the moment the design changes.

**Config references:**
- `config/quality-standards.md` — Outcome focus rules

---

## Input

- **canonical_issue** — The normalised issue context (or draft)
- **issue_type** — Story, Task, or Bug

---

## Applicability

| Issue Type | Applies? |
|------------|----------|
| Story      | ✅ Yes   |
| Bug        | ✅ Yes   |
| Task       | ❌ Skip — technical work does not include UI/UX considerations |

If the issue type is Task, skip this check entirely and return no findings.

---

## Instructions

1. For every acceptance criterion, ask: **is this describing a user outcome, or is it describing an interface?**

2. Signals of a UI/UX trap:
   - Criteria mention visual states (greyed out, highlighted, red border)
   - Criteria describe component behaviour (dropdown shows X items, button is disabled)
   - Criteria specify layout or positioning details

3. For each criterion that describes UI/UX behaviour rather than a user outcome:

   **If the UI detail is unnecessary** (an outcome-focused criterion can capture the same requirement):
   - Flag it as a UI/UX trap
   - Suggest the outcome-focused rewrite (e.g., "The user cannot submit until all required fields are valid" instead of "The submit button is greyed out")

   **If the UI detail is genuinely necessary** (no design exists and the behaviour would otherwise be ambiguous):
   - Flag it as design debt — not a permanent criterion
   - Note that it should be replaced with a proper design reference when one becomes available

4. The absence of a design file is **not** a reason to describe UI in acceptance criteria. It is a reason to write outcome-focused criteria that leave the design decision open.

---

## Output

- **findings** — List of UI/UX trap issues found, with suggested rewrites, or empty if all criteria pass
- **severity** — `critical` if the majority of criteria are UI/UX-focused; `minor` if one or two carry design debt markers
