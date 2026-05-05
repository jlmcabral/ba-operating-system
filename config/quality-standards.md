# Quality Standards

This file is the single source of truth for acceptance criteria formatting, issue quality rules, and validation standards. All skills reference this file — do not duplicate these rules elsewhere.

---

## Gherkin Formatting Standard

All acceptance criteria must use Gherkin format. For the full formatting rules with examples, see [`skills/validate-ac-quality/REFERENCE.md`](../skills/validate-ac-quality/REFERENCE.md).

**Quick reference:**

- `Scenario :` + descriptive title (entire title line bold, numbered sequentially)
- **Given** / **When** / **Then** in bold, one per line
- **And** keyword is NOT bold
- Blank line between scenarios

For deterministic format validation, use `skills/validate-ac-quality/scripts/validate-gherkin.js`.

---

## Issue Type Classification Rules

Use these rules to determine the correct issue type when it is not declared or appears misclassified:

| Issue Type | Use when...                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------------- |
| Story      | Any user-facing need, behaviour, or outcome                                                       |
| Task       | Clearly technical or operational work with no user-facing behaviour                               |
| Bug        | Existing behaviour that is broken or incorrect — apply Quality Management Playbook classification |

When the issue type is Bug, the Quality Management Playbook (see `config/project.md` for the Confluence page ID) must be fetched to classify severity.

---

## Acceptance Criteria Quality Rules

These rules define what makes an acceptance criterion valid. Validation skills use these as their assessment rubric. For detailed examples, see [`skills/validate-ac-quality/REFERENCE.md`](../skills/validate-ac-quality/REFERENCE.md).

### Testability

Every criterion must be verifiable as pass/fail without ambiguity. If a tester cannot determine whether the criterion is met, it fails this check.

### Outcome Focus

Criteria describe **what outcome must be true** — not **how the interface should look or behave**. See `skills/validate-ac-quality/REFERENCE.md` for correct/incorrect examples.

### Test Case Drift

Criteria define the **behaviour pattern**. Test cases verify the **exhaustive permutations**. See `skills/validate-ac-quality/REFERENCE.md` for drift signals.

---

## Problem Statement Rules

Every issue with a user-facing outcome (Story, Bug) must include a problem statement that:

1. Describes the **situation** — what is happening today
2. Describes the **friction** — what makes the current situation problematic
3. Describes the **impact** — what happens if this is not solved
4. Is grounded in a **real user need** — not a feature preference or internal assumption

If the input only describes a solution, the system must reframe it as a problem first and note the reframe explicitly.

---

## Inference Rules

When information is genuinely missing and a reasonable inference can be made:

- Mark the inference with the label `[INFERRED]`
- Do not leave required fields empty — infer and mark
- Do not invent requirements — only infer what is reasonable from context
- Every inference must be confirmable or correctable by the user

---

## Scope Assessment Rules

An issue should be flagged for scope if:

1. **Breadth:** It addresses more than one distinct user need or outcome
2. **AC volume:** Scenarios cover significantly different situations or user journeys

A long issue is not automatically a split candidate. The test is whether two parts represent **distinct user outcomes**, not whether the issue feels large.
