---
name: revise-draft-from-findings
description: Apply validation findings to improve an issue draft — rewrite bad ACs, fix formatting, strengthen problem statements. Use when validation has produced fixable findings.
---

# Skill: Revise Draft from Findings

**Purpose:** After validation skills produce findings, apply those findings to improve the issue draft. Rewrites problematic AC, fixes UI/UX trap issues, resolves test-case drift, strengthens weak problem statements.

**Config references:**
- `config/quality-standards.md` — Rules for correct criteria, problem framing, etc.

---

## Input

- **issue_draft** — Current draft (from `produce-issue-draft`)
- **validation_findings** — Combined findings from all validation skills
- **issue_type** — Story, Task, or Bug

---

## Instructions

1. Review each validation finding against current draft.

2. For each finding, determine whether it can be addressed by revising draft:

   **Can be addressed (apply the fix):**
   - UI/UX trap criteria → Rewrite as outcome-focused criteria
   - Test-case drift criteria → Generalise into behaviour patterns
   - Formatting errors in AC → Fix to match Gherkin standard
   - Weak problem statement where enough context exists → Strengthen it

   **Cannot be addressed (leave for follow-up):**
   - Missing info requiring user input
   - Scope splits requiring user decision
   - Ambiguity unresolvable from context alone

3. Produce revised draft with all applicable fixes applied. For each change, include brief inline note:

   > ✏️ **Revised:** [brief explanation of what changed and why]

4. Don't over-revise. Only change what validation findings specifically identified. Don't introduce new content or restructure sections that passed validation.

5. Findings that can't be addressed: leave as-is — `generate-follow-up-questions` will handle them.

---

## Output

- **revised_draft** — Improved issue draft with fixes applied and revision notes
- **applied_fixes** — List of changes made
- **unresolved_findings** — Findings that couldn't be addressed without user input
