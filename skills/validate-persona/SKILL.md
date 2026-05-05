---
name: validate-persona
description: Check whether the persona is specific and whether role-based behavioural differences are captured in acceptance criteria. Use when validating Stories or Bugs — role differentiation failures are critical blockers.
---

# Skill: Validate Persona and Role Coverage

**Purpose:** Check two things: (1) whether the affected persona is specific enough, and (2) whether the acceptance criteria differentiate between user roles when the story context implies different roles have different access or behaviour.

**Config references:**
- `config/personas.md` — Known application personas

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
| Task       | ❌ Skip  |

If the issue type is Task, skip this check entirely and return no findings.

---

## Instructions

1. Read `config/personas.md` to review the known personas for the application.

2. Identify all user roles referenced in the issue (in the user narrative, problem statement, and acceptance criteria).

---

### Behaviour A — Persona specificity (observational)

3. Check whether the story's primary persona is a **specific role** from `config/personas.md` or a **generic label** (e.g., "the user", "someone", "they").

4. If the persona is too vague or generic, suggest a more specific role from `config/personas.md` based on the issue context.

5. If `config/personas.md` has not been populated yet (TODO section still present), note this observation without making specific persona suggestions.

**This check is always observational — it never blocks readiness.**

---

### Behaviour B — Role-based behavioural differentiation (readiness gate)

6. Determine whether the story context implies **multiple user roles with different access, permissions, or behaviour**. Signals include:
   - The problem statement or description mentions different role types (e.g., admin, viewer, operator)
   - The feature being described typically has role-gated behaviour (e.g., permissions, approval steps, visibility restrictions)
   - The `config/personas.md` list contains distinct roles that would interact with this feature differently

7. If multiple roles are implied:
   - Check whether the acceptance criteria scenarios **explicitly differentiate** between them (e.g., separate scenarios for "admin can do X" vs. "viewer cannot do X")
   - If the AC treats all roles as "the user" without differentiation, flag this as a **critical finding** — engineering cannot implement role logic they do not know about

8. If the story is clearly single-role (one persona, no access control implied), skip Behaviour B.

---

## Output

- **finding_persona** — Observation about persona specificity, or null if persona is clear
- **finding_role_coverage** — Description of missing role differentiation in AC, or null if check passes or does not apply
- **severity_persona** — `observational` (always)
- **severity_role_coverage** — `critical` when role differences are implied but AC does not capture them; `null` otherwise
