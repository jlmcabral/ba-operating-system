---
name: analyze-input-type
description: Determine issue type (Story, Task, Bug) and input mode from raw user input. Use when classifying new input at the start of a craft or assess flow.
---

# Skill: Analyse Input Type

**Purpose:** Determine the issue type (Story, Task, or Bug) from the user's input. This runs early in the orchestration flow to guide which templates to fetch and which validation checks to apply.

**Config references:**
- `config/quality-standards.md` — Issue type classification rules

---

## Input

One of the following:
- **idea** — A loose description of a need, problem, or feature direction
- **draft** — A partial or complete issue draft
- **jira_issue** — The content of a fetched Jira issue (from `fetch-issue-by-key`)

---

## Instructions

1. Read `config/quality-standards.md` to review the issue type classification rules.
2. Examine the input to determine the most appropriate issue type:
   - **Story:** Any user-facing need, behaviour, or outcome
   - **Task:** Clearly technical or operational work with no user-facing behaviour
   - **Bug:** Existing behaviour that is broken or incorrect
3. If the input is a fetched Jira issue, note the type already assigned in Jira. If that type appears incorrect based on the classification rules, flag the mismatch and recommend the correct type.
4. If the input is ambiguous, default to Story (most common) and flag the ambiguity for clarification.
5. Determine the input mode:
   - **idea** — Input is a loose description with no structure
   - **draft** — Input has some issue structure (fields, criteria, etc.)
   - **jira** — Input was fetched from Jira

---

## Output

- **issue_type** — Story, Task, or Bug
- **input_mode** — idea, draft, or jira
- **type_confidence** — High (clear match), Medium (reasonable inference), Low (ambiguous — flag for clarification)
- **type_mismatch** — If the Jira-declared type differs from the recommended type, describe the mismatch and reasoning
