---
name: fetch-required-templates
description: Fetch the Jira issue template for a given type (Story, Task, Bug) and optionally the Quality Management Playbook. Use when preparing to draft or validate an issue.
---

# Skill: Fetch Required Templates

**Purpose:** Fetch only the Jira issue template(s) needed for the current work, based on the determined issue type. Optionally fetch the Quality Management Playbook when classifying bugs.

**Config references:**
- `config/project.md` — Template issue keys and Playbook page ID

---

## Input

- **issue_type** — The determined issue type: Story, Task, or Bug
- **fetch_playbook** — Whether to also fetch the Quality Management Playbook (true for Bugs, false otherwise)

---

## Instructions

1. Read `config/project.md` to find the template issue key for the given issue type.
2. Use the Atlassian MCP server to fetch that template issue.
3. From the template, extract:
   - All field names and their descriptions
   - Any placeholder text or formatting instructions in the description body
   - Any required vs optional field distinctions
4. If `fetch_playbook` is true, also fetch the Quality Management Playbook from Confluence using the page ID in `config/project.md`. Use this as the reference for bug classification and severity.
5. If any fetch fails, report which resource failed and why. Do not proceed until required templates are available.
6. Store the extracted template structure internally — do not reproduce it in the output to the user.

**Token optimisation for batch runs:** When an orchestrator processes multiple issues, this skill should be called once per unique issue type encountered — not once per issue. The orchestrator is responsible for deduplicating these calls.

---

## Output

- **template_structure** — The extracted field structure for the relevant issue type
- **playbook_reference** — The Quality Management Playbook content (only when fetched)
- **fetch_success** — Whether all required fetches succeeded
