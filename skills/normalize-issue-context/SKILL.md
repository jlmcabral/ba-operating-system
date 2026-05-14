---
name: normalize-issue-context
description: Transform raw input (idea, draft, or Jira issue) into a canonical schema for downstream skills. Use when preparing input for validation or drafting.
---

Purpose: Transform raw input — loose idea, pasted draft, or fetched Jira issue — into canonical schema all downstream skills consume consistently.

Input:
- raw_input — original input: loose idea, pasted draft, or fetched Jira issue (from fetch-issue-by-key)
- issue_type — Story, Task, or Bug (from analyze-input-type)
- input_mode — idea, draft, or jira (from analyze-input-type)

Instructions:

1. Extract following fields regardless of format. Field not present → mark [MISSING]:
   - Summary / title
   - Problem statement — situation, friction, impact
   - User / persona — who is affected
   - Candidate story (Stories only) — "As a [user], I want [what], so that [why]"
   - Acceptance criteria — existing criteria in any format
   - Additional context — links, hints, background, notes, references. Preserve exactly as found.
   - Technical approach — if present (may be empty — expected)
   - Confidence level — if stated
   - Labels, components, reporter, assignee — metadata if available

2. Fields existing but poorly structured (e.g., AC not in Gherkin): extract content as-is. Formatting happens downstream in produce-issue-draft.

3. Jira issues: preserve full description body. Don't discard sections.

4. Ideas: most fields will be [MISSING]. Expected — ask-clarification-questions will address gaps.

Output: canonical issue object with all fields above, each populated or [MISSING].
