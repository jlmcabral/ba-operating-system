---
name: validate-ac-quality
description: Check acceptance criteria for testability, coherence, Gherkin formatting, and test-case drift. Use when validating any issue type during craft or assess flows.
---

Purpose: Check whether AC are testable, coherent, correctly formatted in Gherkin, and not drifting into test case territory.

Input: canonical_issue, issue_type.

Instructions:

1. Read config/quality-standards.md for AC quality rules.
2. Run scripts/validate-gherkin.js against AC text. Adopt script output as definitive.
3. Check every criterion. Flag each issue found:
   - Testability — flag if tester cannot verify pass/fail without ambiguity
   - Coherence — flag if different readers would interpret it differently
   - Gherkin — flag if any formatting rule broken (scenario title present, step keywords on own lines, bold on keywords excluding And, blank line between scenarios)
   - Test case drift — flag if multiple scenarios differ only by column/field/entity; identify the behaviour pattern that should replace them
4. Flag missing scenarios any reasonable tester would expect.
5. For each failure: name the specific issue, explain why it matters.

Output:
- findings — list of issues, or empty if all pass
- severity — critical if majority fail, minor if 1-2 are weak
