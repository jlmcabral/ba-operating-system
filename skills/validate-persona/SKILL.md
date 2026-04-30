---
name: validate-persona
description: Check whether the affected persona is specific enough based on configured personas. Use when validating Stories or Bugs — observational only, never blocks readiness.
---

# Skill: Validate Persona

**Purpose:** Check whether the affected user or persona is specific enough to be meaningful, based on the known personas defined in configuration.

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

2. Identify the persona or user role referenced in the issue.

3. Check:
   - Does the issue reference a **specific persona** from `config/personas.md`?
   - Or does it use a **generic label** like "user", "someone", "they"?
   - If no persona from the config matches, is the issue describing a user role not yet documented?

4. If the persona is too vague or generic, suggest a more specific role from `config/personas.md` based on the issue context.

5. If `config/personas.md` has not been populated yet (TODO section still present), note this observation without making specific persona suggestions.

---

## Behaviour

- **Observational only.** Persona findings never block readiness and never drive a flag on their own.
- This check produces observations, not blockers.

---

## Output

- **finding** — Observation about persona specificity, or empty if the persona is clear
- **severity** — `observational` (always — never blocks readiness)
