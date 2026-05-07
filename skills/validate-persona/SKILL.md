---
name: validate-persona
description: Check whether the persona is specific and whether role-based behavioural differences are captured in acceptance criteria. Use when validating Stories or Bugs — role differentiation failures are critical blockers.
---

# Skill: Validate Persona and Role Coverage

**Purpose:** Check two things: (1) whether affected persona is specific enough, and (2) whether acceptance criteria differentiate between user roles when story context implies different roles have different access or behaviour.

**Config references:**
- `config/personas.md` — Known application personas

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
| Task | ❌ Skip |

If Task, skip entirely and return no findings.

---

## Instructions

1. Read `config/personas.md` to review known personas.

2. Identify all user roles referenced in issue (user narrative, problem statement, and acceptance criteria).

---

### Behaviour A — Persona specificity (observational)

3. Check whether story's primary persona is **specific role** from `config/personas.md` or **generic label** (e.g., "the user", "someone", "they").

4. If too vague, suggest more specific role from `config/personas.md` based on issue context.

5. If `config/personas.md` not yet populated (TODO section still present), note observation without making specific suggestions.

**Always observational — never blocks readiness.**

---

### Behaviour B — Role-based behavioural differentiation (readiness gate)

6. Determine whether story context implies **multiple user roles with different access, permissions, or behaviour**. Signals:
   - Problem statement or description mentions different role types (admin, viewer, operator)
   - Feature typically has role-gated behaviour (permissions, approval steps, visibility restrictions)
   - `config/personas.md` contains distinct roles that would interact with feature differently

7. If multiple roles implied:
   - Check whether AC scenarios **explicitly differentiate** between them (e.g., separate scenarios for "admin can do X" vs "viewer cannot do X")
   - If AC treats all roles as "the user" without differentiation, flag as **critical finding** — engineering can't implement role logic they don't know about

8. If story is clearly single-role (one persona, no access control implied), skip Behaviour B.

---

## Output

- **finding_persona** — Observation about persona specificity, or null if persona is clear
- **finding_role_coverage** — Description of missing role differentiation in AC, or null if check passes or doesn't apply
- **severity_persona** — `observational` (always)
- **severity_role_coverage** — `critical` when role differences implied but AC doesn't capture them; `null` otherwise
