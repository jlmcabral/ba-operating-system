---
name: validate-ac-quality
description: Check acceptance criteria for testability, coherence, Gherkin formatting, and test-case drift. Use when validating any issue type during craft or assess flows.
---

# Skill: Validate Acceptance Criteria Quality

**Purpose:** Check whether acceptance criteria are testable, coherent, correctly formatted in Gherkin, and not drifting into test case territory.

**Config references:**
- `config/quality-standards.md` — AC quality rules, Gherkin formatting standard, test case drift signals

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

1. Read `config/quality-standards.md` for the AC quality rules and Gherkin formatting standard. For detailed examples, read `REFERENCE.md` (co-located in this skill's directory).

2. **Format check (deterministic):** Run `scripts/validate-gherkin.js` (co-located in this skill's directory) against the acceptance criteria text. Any issues reported by the script are definitive formatting failures — do not second-guess them.

3. For every acceptance criterion, also check with LLM judgment:

   **Testability:** Can a tester verify this as pass/fail without ambiguity? If not, flag it.

   **Coherence:** Is the criterion clear enough that two different readers would understand it the same way? If not, flag it.

   **Gherkin formatting:** Does it follow the formatting standard in `config/quality-standards.md`? Check:
   - Scenario title present
   - Step keywords on their own lines
   - Step keywords in bold (except And)
   - Blank line between scenarios

   **Test case drift:** Has this criterion drifted from behaviour pattern into test plan territory?
   - Multiple scenarios differing only by which column, field, or entity they reference
   - Data-type-specific behaviour that follows standard conventions
   - Scenarios that read like test matrix rows

3. For each failing criterion, produce a finding that:
   - Identifies the specific criterion
   - Explains the problem (untestable, ambiguous, drifted, badly formatted)
   - For test case drift: identifies the underlying behaviour pattern that should replace the enumerated scenarios

4. **Missing scenarios:** If key scenarios that any reasonable tester would expect are absent, flag this as a gap.

---

## Output

- **findings** — List of AC quality issues found, or empty if all criteria pass
- **severity** — `critical` if the majority of criteria fail; `minor` if one or two are weak but the rest are solid
