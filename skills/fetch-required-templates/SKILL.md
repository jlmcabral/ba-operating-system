---
name: fetch-required-templates
description: Fetch the Jira issue template for a given type (Story, Task, Bug) and optionally the Quality Management Playbook. Use when preparing to draft or validate an issue.
---

# Skill: Fetch Required Templates

**Purpose:** Fetch only Jira issue template(s) needed for current work, based on determined issue type. Optionally fetch Quality Management Playbook when classifying bugs.

**Config references:**
- `config/project.md` — Template issue keys and Playbook page ID

---

## Input

- **issue_type** — Determined issue type: Story, Task, or Bug
- **fetch_playbook** — Whether to also fetch Quality Management Playbook (true for Bugs, false otherwise)

---

## Instructions

1. Read `config/project.md` to find template issue key for given issue type.
2. Use Atlassian MCP server to fetch that template issue.
3. From template, extract:
   - All field names and descriptions
   - Placeholder text or formatting instructions in description body
   - Required vs optional field distinctions
4. `fetch_playbook` is true: also fetch Quality Management Playbook from Confluence using page ID in `config/project.md`. Use as reference for bug classification and severity.
5. Any fetch fails: report which resource failed and why. Don't proceed until required templates available.
6. Store extracted template structure internally — don't reproduce in output to user.

**Token optimisation for batch runs:** Call once per unique issue type — not once per issue. Orchestrator responsible for deduplicating calls.

---

## Output

- **template_structure** — Extracted field structure for relevant issue type
- **playbook_reference** — Quality Management Playbook content (only when fetched)
- **fetch_success** — Whether all required fetches succeeded
