---
name: fetch-issue-by-key
description: Fetch a single Jira issue by key via MCP and return its full content. Use when a Jira key is provided as input to craft or assess flows.
---

# Skill: Fetch Issue by Key

**Purpose:** Fetch a single Jira issue by its key via the MCP server and return its full content.

**Config references:**

- `config/mcp.md` — MCP server details

---

## Input

- **issue_key** — A Jira issue key (e.g., `PROJECT-1234`)

---

## Instructions

1. Use the Atlassian MCP server to fetch the issue identified by the provided key.
2. Retrieve all fields: summary, description, status, issue type, reporter, assignee, labels, acceptance criteria, and any additional context sections.
3. If the fetch fails, report which issue failed and the reason. Do not proceed with downstream skills until the fetch succeeds.
4. Return the full issue content as-is — do not modify, summarise, or interpret it at this stage.

---

## Output

- **issue_content** — The full Jira issue content including all fields
- **issue_type** — The issue type as declared in Jira (Story, Task, Bug, etc.)
- **issue_status** — The current status of the issue
- **fetch_success** — Whether the fetch succeeded (true/false)
