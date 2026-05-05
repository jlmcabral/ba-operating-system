---
name: validate-scenario-coverage
description: Check whether acceptance criteria cover key unhappy paths and error states, not just the happy path. Use when validating Stories or Bugs — missing error coverage is a common source of refinement back-and-forth.
---

# Skill: Validate Scenario Coverage

**Purpose:** Check whether the acceptance criteria cover the most important unhappy paths, error states, and boundary conditions implied by the story context — not just the success scenario.

**Config references:**

- `config/quality-standards.md` — AC quality rules

---

## Input

- **canonical_issue** — The normalised issue context (or draft)
- **issue_type** — Story, Task, or Bug

---

## Applicability

| Issue Type | Applies?                                                                                                                                                        |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Story      | ✅ Yes                                                                                                                                                          |
| Bug        | ❌ Skip - Bugs usually don't have acceptance criteria defined. The acceptance criteria are typically used to validate new functionality, not existing behavior. |
| Task       | ❌ Skip — tasks describe work to be done, not user-facing behaviour                                                                                             |

---

## Instructions

1. Read the acceptance criteria and the problem statement / description.

2. Identify what unhappy paths, error states, and boundary conditions the story context implies. Consider:
   - **Invalid or missing input** — what happens if required data is absent, malformed, or out of range?
   - **Permission or access denial** — what happens when the user does not have the right to perform the action?
   - **System or dependency failure** — what happens when a downstream service, API, or resource is unavailable?
   - **Boundary conditions** — what happens at the edge of a defined limit (e.g., maximum items, zero results, duplicate entries)?
   - **Concurrent or conflicting actions** — what happens if the same action is triggered twice, or if two users act simultaneously?

3. Check which of these are covered by existing AC scenarios. A scenario "covers" an unhappy path if it explicitly addresses what should happen in that situation.

4. Identify **significant gaps** — unhappy paths that any reasonable engineer or tester would expect to be specified, but are absent from the AC. Do not flag every conceivable edge case — only those that would plausibly be raised in a refinement session.

5. If the story is genuinely simple (e.g., a display-only feature with no user input or system interaction), and the happy path truly covers all meaningful scenarios, note that no gaps were found.

---

## Output

- **findings** — List of missing unhappy paths or error states, each naming the gap and explaining why it would be raised in refinement. Empty if coverage is adequate.
- **severity** — `critical` if zero unhappy paths are present and the story context clearly implies error states exist; `minor` if some unhappy paths are covered but significant gaps remain
