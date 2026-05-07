---
name: validate-completeness
description: Check all required fields are populated with no unresolved placeholders or inferences. Use when validating any issue type during craft or assess flows.
---

# Skill: Validate Completeness

**Purpose:** Check whether all required fields are populated, any contain placeholders or unresolved inferences, and whether there's enough context for engineering to understand the need.

**Config references:**
- `config/quality-standards.md` — Required fields and inference rules

---

## Input

- **canonical_issue** — Normalised issue context (or draft)
- **issue_type** — Story, Task, or Bug
- **template_structure** — Extracted template from `fetch-required-templates`

---

## Applicability

| Issue Type | Applies? |
|------------|----------|
| Story | ✅ Yes |
| Task | ✅ Yes |
| Bug | ✅ Yes |

---

## Instructions

1. **Completeness check (deterministic):** Run `scripts/check-completeness.js` (co-located) with canonical_issue and issue_type as JSON input. Adopt script output directly.

2. For fields the script identifies, produce findings as below. Also apply judgment for:

   **Empty required fields:** Any template-required field that's empty or contains placeholder (e.g., "[TBD]", "[TODO]", "...").

   **Unresolved inferences:** Any field marked `[INFERRED]` not confirmed by user. Acceptable in draft but blocks readiness.

   **Insufficient context:** Enough information for an engineer to understand:
   - What problem is being solved (Stories/Bugs)
   - What work needs to be done (Tasks)
   - What "done" looks like

3. **Technical approach:** Sparse or empty technical approach is **expected** at this stage — dev team defines during refinement. Do **not** flag as completeness issue.

4. For each gap, produce a finding identifying the specific field and what's needed.

---

## Output

- **findings** — List of completeness issues, or empty if all required fields populated
- **severity** — `critical` if required fields missing; `minor` if fields present but thin
