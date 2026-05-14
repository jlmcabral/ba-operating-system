---
name: validate-completeness
description: Check all required fields are populated with no unresolved placeholders or inferences. Use when validating any issue type during craft or assess flows.
---

Purpose: Check whether all required fields are populated, none contain placeholders or unresolved inferences, and enough context exists for engineering.

Input:
- canonical_issue — normalised issue context
- issue_type — Story, Task, or Bug
- template_structure — extracted template (from fetch-required-templates)

Instructions:

1. Run scripts/check-completeness.js with canonical_issue and issue_type as JSON input. Adopt script output directly.
2. Apply judgment for: empty required fields (incl. placeholders like [TBD], [TODO]), unresolved [INFERRED] fields, insufficient context for engineering to understand what problem is solved and what done looks like.
3. Sparse or empty technical approach is expected — dev team defines during refinement. Do not flag.

Output:
- findings — list of completeness issues, or empty if all required fields populated
- severity — critical if required fields missing, minor if fields present but thin
