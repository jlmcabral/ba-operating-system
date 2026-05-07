# Quality Standards

Single source of truth for AC formatting, issue quality rules, and validation standards. All skills reference this file — don't duplicate rules elsewhere.

---

## Gherkin Formatting Standard

All acceptance criteria must use Gherkin format. Full rules with examples: [`skills/validate-ac-quality/REFERENCE.md`](../skills/validate-ac-quality/REFERENCE.md).

**Quick reference:**

- `Scenario :` + descriptive title (entire title line bold, numbered sequentially)
- **Given** / **When** / **Then** bold, one per line
- **And** keyword NOT bold
- Blank line between scenarios

Deterministic format validation: `skills/validate-ac-quality/scripts/validate-gherkin.js`.

---

## Issue Type Classification Rules

| Issue Type | Use when...                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------------- |
| Story      | Any user-facing need, behaviour, or outcome                                                       |
| Task       | Clearly technical or operational work with no user-facing behaviour                               |
| Bug        | Existing behaviour broken or incorrect — apply Quality Management Playbook classification |

Bug type: fetch Quality Management Playbook (see `config/project.md` for Confluence page ID) to classify severity.

---

## Acceptance Criteria Quality Rules

Rubric used by validation skills. Detailed examples: [`skills/validate-ac-quality/REFERENCE.md`](../skills/validate-ac-quality/REFERENCE.md).

### Testability

Every criterion verifiable as pass/fail without ambiguity. If tester can't determine whether criterion is met, it fails.

### Outcome Focus

Criteria describe **what outcome must be true** — not **how interface looks or behaves**. See `skills/validate-ac-quality/REFERENCE.md` for correct/incorrect examples.

### Test Case Drift

Criteria define **behaviour pattern**. Test cases verify **exhaustive permutations**. See `skills/validate-ac-quality/REFERENCE.md` for drift signals.

---

## Problem Statement Rules

Every issue with user-facing outcome (Story, Bug) must include problem statement that:

1. Describes **situation** — what is happening today
2. Describes **friction** — what makes current situation problematic
3. Describes **impact** — what happens if not solved
4. Grounded in **real user need** — not feature preference or internal assumption

Input describes only solution: reframe as problem first, note reframe explicitly.

---

## Inference Rules

When info is missing and reasonable inference possible:

- Mark with `[INFERRED]`
- Don't leave required fields empty — infer and mark
- Don't invent requirements — only infer what's reasonable from context
- Every inference must be confirmable or correctable by user

---

## Scope Assessment Rules

Flag for scope if:

1. **Breadth:** More than one distinct user need or outcome
2. **AC volume:** Scenarios cover significantly different situations or user journeys

Long issue ≠ split candidate. Test: do two parts represent **distinct user outcomes**, not whether issue feels large.
