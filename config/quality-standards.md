# Quality Standards

This file is the single source of truth for acceptance criteria formatting, issue quality rules, and validation standards. All skills reference this file — do not duplicate these rules elsewhere.

---

## Gherkin Formatting Standard

All acceptance criteria must follow this format without exception.

**Structure rules:**

- Each scenario begins with `Scenario:` followed by a short descriptive title
- Each step keyword (**Given**, **When**, **Then**, **And**) is on its own line
- Step keywords are in **bold** with the exception of **And** steps
- The rest of the sentence is not bold
- One blank line between scenarios

**Example of correct formatting:**

Scenario: User filters results by date range

**Given** the user is on the search results page
And the UI has fully loaded
**When** they select a start date and an end date
**Then** only results within that date range are displayed
And the filter selection is visually indicated

---

## Issue Type Classification Rules

Use these rules to determine the correct issue type when it is not declared or appears misclassified:

| Issue Type | Use when...                                                                                  |
|------------|----------------------------------------------------------------------------------------------|
| Story      | Any user-facing need, behaviour, or outcome                                                  |
| Task       | Clearly technical or operational work with no user-facing behaviour                          |
| Bug        | Existing behaviour that is broken or incorrect — apply Quality Management Playbook classification |

When the issue type is Bug, the Quality Management Playbook (see `config/project.md` for the Confluence page ID) must be fetched to classify severity.

---

## Acceptance Criteria Quality Rules

These rules define what makes an acceptance criterion valid. Validation skills use these as their assessment rubric.

### Testability
Every criterion must be verifiable as pass/fail without ambiguity. If a tester cannot determine whether the criterion is met, it fails this check.

### Outcome Focus
Criteria describe **what outcome must be true** — not **how the interface should look or behave**.

**Correct (outcome-focused):**
- "The user cannot submit the form until all required fields are valid"
- "The system prevents duplicate entries for the same date range"

**Incorrect (UI/UX-focused):**
- "The submit button is greyed out when fields are incomplete"
- "A red border appears around invalid fields"

When no design exists and UI detail is genuinely necessary to avoid ambiguity, mark it as design debt — not as a permanent acceptance criterion.

### Test Case Drift
Criteria define the **behaviour pattern**. Test cases verify the **exhaustive permutations**. When criteria enumerate every column, field, or data combination, they have drifted from acceptance criteria into test plan territory.

**Signals of drift:**
- Multiple scenarios differing only by which column, field, or entity they reference
- Criteria specifying data-type-specific behaviour that follows standard conventions
- Scenarios that read like a test matrix row rather than a user outcome

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
