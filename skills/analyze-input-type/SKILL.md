---
name: analyze-input-type
description: Determine issue type (Story, Task, Bug, or Request for Jira containers) and input mode from raw user input. Use when classifying new input at the start of a craft or assess flow.
---

# Skill: Analyse Input Type

**Purpose:** Determine issue type from user's input. Runs early in orchestration to guide template fetching and the appropriate pipeline (craft/validate for Story/Task/Bug, child-breakdown for Request).

**Config references:**
- `config/quality-standards.md` — Issue type classification rules
- `config/project.md` — Issue Hierarchy section (Request container type)

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
   - **Request** (Jira input only): A container issue that groups related work. See `config/project.md` Issue Hierarchy section.

3. Fetched Jira issue:
   - Jira-declared type is "Request": pass through as Request with High confidence. **Do not** flag as mismatch — Request is a recognised container type in this project.
   - Jira-declared type is something else but appears incorrect for the type: flag mismatch and recommend correct type (Story/Task/Bug).

4. Ambiguous input: default to Story (most common) and flag ambiguity for clarification.

5. Determine input mode:
   - **idea** — Loose description, no structure
   - **draft** — Some issue structure (fields, criteria, etc.)
   - **jira** — Fetched from Jira

---

## Output

- **issue_type** — Story, Task, Bug, or Request (Jira input only)
- **input_mode** — idea, draft, or jira
- **type_confidence** — High (clear match), Medium (reasonable inference), Low (ambiguous — flag for clarification)
- **type_mismatch** — If Jira-declared type differs from recommended type: describe mismatch and reasoning
