---
name: analyze-input-type
description: Determine issue type (Story, Task, Bug) and input mode from raw user input. Use when classifying new input at the start of a craft or assess flow.
---

Purpose: Determine issue type (Story, Task, or Bug) from user's input. Runs early in orchestration to guide template fetching and validation checks.

Input:
- idea — loose description, no structure
- draft — partial or complete issue draft
- jira_issue — fetched Jira issue (from fetch-issue-by-key), has full Jira structure

Instructions:

1. Read config/quality-standards.md for issue type classification rules.
2. Determine most appropriate issue type:
   - Story: User-facing need, behaviour, or outcome
   - Task: Technical or operational work with no user-facing behaviour
   - Bug: Existing behaviour that is broken or incorrect
3. Fetched Jira issue: note type already assigned. Type appears incorrect → flag mismatch and recommend correct type.
4. Ambiguous input: default to Story and flag ambiguity.
5. Determine input mode: idea, draft, or jira.

Output:
- issue_type — Story, Task, or Bug
- input_mode — idea, draft, or jira
- type_confidence — High, Medium, or Low
- type_mismatch — if Jira-declared type differs from recommended type
