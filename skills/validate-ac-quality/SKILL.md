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

1. Read `config/quality-standards.md` for AC quality rules and Gherkin formatting standard. For detailed examples, read `REFERENCE.md` (co-located).

2. **Format check (deterministic):** Run `scripts/validate-gherkin.js` (co-located) against acceptance criteria text. Script output is definitive — do not second-guess it.

3. For every criterion, check with LLM judgment:

   **Testability:** Can a tester verify pass/fail without ambiguity? If not, flag.

   **Coherence:** Would two different readers interpret it the same way? If not, flag.

   **Gherkin formatting:** Follows standard in `config/quality-standards.md`? Check:
   - Scenario title present
   - Step keywords on own lines
   - Step keywords in bold (except And)
   - Blank line between scenarios

   **Test case drift:** Drifted from behaviour pattern into test plan territory?
   - Multiple scenarios differing only by column, field, or entity referenced
   - Data-type-specific behaviour following standard conventions
   - Scenarios reading like test matrix rows

4. For each failing criterion, produce a finding that:
   - Identifies the specific criterion
   - Explains the problem (untestable, ambiguous, drifted, badly formatted)
   - For test case drift: identifies underlying behaviour pattern that should replace enumerated scenarios

5. **Missing scenarios:** If key scenarios any reasonable tester would expect are absent, flag as a gap.

---

## Output

- **findings** — List of AC quality issues found, or empty if all pass
- **severity** — `critical` if majority of criteria fail; `minor` if one or two are weak
