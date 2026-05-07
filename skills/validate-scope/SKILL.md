---
name: validate-scope
description: Assess whether an issue covers more than one distinct user need or independently deliverable outcome. Use when validating any issue type — critical blocker when it fails.
---

# Skill: Validate Scope

**Purpose:** Assess whether issue is trying to do too much — covering more than one distinct user need or independently deliverable outcome.

**Config references:**
- `config/quality-standards.md` — Scope assessment rules

---

## Input

- **canonical_issue** — Normalised issue context (or draft)
- **issue_type** — Story, Task, or Bug

---

## Applicability

| Issue Type | Applies? |
|------------|----------|
| Story | ✅ Yes |
| Task | ✅ Yes |
| Bug | ✅ Yes |

---

## Instructions

1. Read `config/quality-standards.md` for scope assessment rules.

2. Look for two signals:

   **Breadth:** Does issue address more than one distinct user need or outcome?
   - Stories/Bugs: Would a user in different role, context, or situation need a separate mental model?
   - Tasks: Could work reasonably be split into separate, independently deliverable pieces?

   **AC volume:** Do AC scenarios cover significantly different situations or user journeys?

3. Long issue is **not** automatically a split candidate. Test is whether two parts represent **distinct user outcomes**, not whether issue feels large.

4. If either signal present, produce finding that:
   - Identifies distinct needs/outcomes present
   - Suggests potential split (Part A / Part B) with clear descriptions
   - Notes user should confirm whether to split before proceeding

---

## Output

- **finding** — Description of scope issue with suggested split, or empty if check passes
- **severity** — `critical` (scope issues are readiness blockers)
