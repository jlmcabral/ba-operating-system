---
name: validate-persona
description: Check whether the persona is specific and whether role-based behavioural differences are captured in acceptance criteria. Use when validating Stories or Bugs — role differentiation failures are critical blockers.
---

Purpose: Check (1) whether affected persona is specific enough, and (2) whether AC differentiate between user roles when story context implies different roles have different access or behaviour.

Input: canonical_issue, issue_type.

Config: config/personas.md — known application personas.

Instructions:

1. Read config/personas.md to review known personas.
2. Identify all user roles referenced in issue.

Behaviour A — Persona specificity (observational, never blocks):
- Check if primary persona is specific role from config/personas.md or generic label ("the user").
- If vague, suggest more specific role.

Behaviour B — Role-based differentiation (readiness gate):
- Determine if story context implies multiple roles: problem statement mentions different role types, feature typically has role-gated behaviour, config/personas.md contains distinct roles.
- If multiple roles implied: check whether AC explicitly differentiates (e.g., "admin can do X" vs "viewer cannot do X"). If AC treats all as "the user", flag as critical.
- Single-role story: skip Behaviour B.

Output:
- finding_persona — observation about persona specificity, or null if clear
- finding_role_coverage — description of missing role differentiation, or null if passes or doesn't apply
- severity_persona — observational (always)
- severity_role_coverage — critical when role differences implied but AC doesn't capture them; null otherwise
