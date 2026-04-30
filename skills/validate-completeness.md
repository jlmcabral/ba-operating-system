# Skill: Validate Completeness

**Purpose:** Check whether all required fields are populated, whether any contain placeholders or unresolved inferences, and whether there is enough context for engineering to understand the need.

**Config references:**
- `config/quality-standards.md` — Required fields and inference rules

---

## Input

- **canonical_issue** — The normalised issue context (or draft)
- **issue_type** — Story, Task, or Bug
- **template_structure** — The extracted template from `fetch-required-templates`

---

## Applicability

| Issue Type | Applies? |
|------------|----------|
| Story      | ✅ Yes   |
| Task       | ✅ Yes   |
| Bug        | ✅ Yes   |

---

## Instructions

1. Compare the canonical issue against the template structure to identify:

   **Empty required fields:** Any field that the template marks as required but is empty or contains only a placeholder (e.g., "[TBD]", "[TODO]", "...").

   **Unresolved inferences:** Any field marked with `[INFERRED]` that has not been confirmed by the user. These are acceptable in a draft but block readiness.

   **Insufficient context:** Is there enough information in the description for an engineer to understand:
   - What problem is being solved (for Stories/Bugs)
   - What work needs to be done (for Tasks)
   - What "done" looks like

2. **Technical approach:** A sparse or empty technical approach is **expected** at this stage. The development team defines it during refinement and sprint planning. Do **not** flag incomplete technical approach as a completeness issue.

3. For each gap found, produce a finding that identifies the specific field and what is needed.

---

## Output

- **findings** — List of completeness issues found, or empty if all required fields are populated
- **severity** — `critical` if required fields are missing; `minor` if fields are present but thin
