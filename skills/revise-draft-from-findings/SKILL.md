---
name: revise-draft-from-findings
description: Apply validation findings to improve an issue draft — rewrite bad ACs, fix formatting, strengthen problem statements. Use when validation has produced fixable findings.
---

# Skill: Revise Draft from Findings

**Purpose:** After validation skills have run and produced findings, apply those findings to improve the issue draft. This skill rewrites problematic acceptance criteria, fixes UI/UX trap issues, resolves test-case drift, and strengthens weak problem statements — producing a revised draft.

**Config references:**
- `config/quality-standards.md` — Rules for correct criteria, problem framing, etc.

---

## Input

- **issue_draft** — The current draft (from `produce-issue-draft`)
- **validation_findings** — Combined findings from all validation skills that ran
- **issue_type** — Story, Task, or Bug

---

## Instructions

1. Review each validation finding against the current draft.

2. For each finding, determine whether it can be addressed by revising the draft:

   **Can be addressed (apply the fix):**
   - UI/UX trap criteria → Rewrite as outcome-focused criteria
   - Test-case drift criteria → Generalise into behaviour patterns
   - Formatting errors in acceptance criteria → Fix to match Gherkin standard
   - Weak problem statement where enough context exists → Strengthen it

   **Cannot be addressed (leave for follow-up):**
   - Missing information that requires user input
   - Scope splits that require user decision
   - Ambiguity that cannot be resolved from context alone

3. Produce a revised draft with all applicable fixes applied. For each change made, include a brief inline note explaining what was changed and why, using this format:

   > ✏️ **Revised:** [brief explanation of what changed and why]

4. Do not over-revise. Only change what the validation findings specifically identified. Do not introduce new content or restructure sections that passed validation.

5. For findings that cannot be addressed, leave them as-is — the `generate-follow-up-questions` skill will handle them.

---

## Output

- **revised_draft** — The improved issue draft with fixes applied and revision notes
- **applied_fixes** — List of changes made (for transparency)
- **unresolved_findings** — List of findings that could not be addressed without user input
