---
name: validate-scenario-coverage
description: Check whether acceptance criteria cover key unhappy paths and error states, not just the happy path. Use when validating Stories or Bugs — missing error coverage is a common source of refinement back-and-forth.
---

# Skill: Validate Scenario Coverage

**Purpose:** Check whether acceptance criteria cover the most important unhappy paths, error states, and boundary conditions implied by story context — not just the success scenario.

**Config references:**
- `config/quality-standards.md` — AC quality rules

---

## Input

- **canonical_issue** — Normalised issue context (or draft)
- **issue_type** — Story, Task, or Bug

---

## Applicability

| Issue Type | Applies? |
| ---------- | -------- |
| Story | ✅ Yes |
| Bug | ❌ Skip — bugs usually don't have acceptance criteria defined. AC typically validates new functionality, not existing behaviour. |
| Task | ❌ Skip — tasks describe work to be done, not user-facing behaviour |

---

## Instructions

1. Read acceptance criteria and problem statement / description.

2. Identify unhappy paths, error states, and boundary conditions implied by story context:
   - **Invalid or missing input** — what happens if required data is absent, malformed, or out of range?
   - **Permission or access denial** — what happens when user doesn't have right to perform action?
   - **System or dependency failure** — what happens when downstream service, API, or resource is unavailable?
   - **Boundary conditions** — what happens at edge of defined limit (max items, zero results, duplicate entries)?
   - **Concurrent or conflicting actions** — what happens if action triggered twice, or two users act simultaneously?

3. Check which are covered by existing AC scenarios. A scenario "covers" an unhappy path if it explicitly addresses what should happen in that situation.

4. Identify **significant gaps** — unhappy paths any reasonable engineer or tester would expect specified, but absent from AC. Don't flag every conceivable edge case — only those plausibly raised in refinement.

5. If story is genuinely simple (display-only feature, no user input or system interaction) and happy path truly covers all meaningful scenarios, note no gaps found.

---

## Output

- **findings** — List of missing unhappy paths or error states, each naming gap and explaining why it'd be raised in refinement. Empty if coverage adequate.
- **severity** — `critical` if zero unhappy paths present and story context clearly implies error states exist; `minor` if some covered but significant gaps remain
