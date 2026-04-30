---
name: validate-scope
description: Assess whether an issue covers more than one distinct user need or independently deliverable outcome. Use when validating any issue type — critical blocker when it fails.
---

# Skill: Validate Scope

**Purpose:** Assess whether the issue is trying to do too much — covering more than one distinct user need or independently deliverable outcome.

**Config references:**
- `config/quality-standards.md` — Scope assessment rules

---

## Input

- **canonical_issue** — The normalised issue context (or draft)
- **issue_type** — Story, Task, or Bug

---

## Applicability

| Issue Type | Applies? |
|------------|----------|
| Story      | ✅ Yes   |
| Task       | ✅ Yes   |
| Bug        | ✅ Yes   |

---

## Instructions

1. Read `config/quality-standards.md` for the scope assessment rules.

2. Look for two signals:

   **Breadth:** Does the issue address more than one distinct user need or outcome?
   - For Stories/Bugs: Would a user in a different role, context, or situation need a separate mental model?
   - For Tasks: Could the work reasonably be split into separate, independently deliverable pieces?

   **AC volume:** Do the acceptance criteria scenarios cover significantly different situations or user journeys?

3. A long issue is **not** automatically a split candidate. The test is whether two parts represent **distinct user outcomes**, not whether the issue feels large.

4. If either signal is present, produce a finding that:
   - Identifies the distinct needs/outcomes present in the issue
   - Suggests a potential split (Part A / Part B) with clear descriptions
   - Notes that the user should confirm whether to split before proceeding

---

## Output

- **finding** — Description of the scope issue with suggested split, or empty if the check passes
- **severity** — `critical` (scope issues are readiness blockers)
