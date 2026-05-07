---
name: analyze-input-type
description: Determine issue type (Story, Task, Bug) and input mode from raw user input. Use when classifying new input at the start of a craft or assess flow.
---

# Skill: Analyse Input Type

**Purpose:** Determine issue type (Story, Task, or Bug) from user's input. Runs early in orchestration to guide template fetching and validation checks.

**Config references:**
- `config/quality-standards.md` — Issue type classification rules

---

## Input

One of:
- **idea** — Loose description of need, problem, or feature direction
- **draft** — Partial or complete issue draft
- **jira_issue** — Content of fetched Jira issue (from `fetch-issue-by-key`)

---

## Instructions

1. Read `config/quality-standards.md` for issue type classification rules.
2. Determine most appropriate issue type:
   - **Story:** User-facing need, behaviour, or outcome
   - **Task:** Technical or operational work with no user-facing behaviour
   - **Bug:** Existing behaviour that is broken or incorrect
3. Fetched Jira issue: note type already assigned. Type appears incorrect → flag mismatch and recommend correct type.
4. Ambiguous input: default to Story (most common) and flag ambiguity for clarification.
5. Determine input mode:
   - **idea** — Loose description, no structure
   - **draft** — Some issue structure (fields, criteria, etc.)
   - **jira** — Fetched from Jira

---

## Output

- **issue_type** — Story, Task, or Bug
- **input_mode** — idea, draft, or jira
- **type_confidence** — High (clear match), Medium (reasonable inference), Low (ambiguous — flag for clarification)
- **type_mismatch** — If Jira-declared type differs from recommended type: describe mismatch and reasoning
