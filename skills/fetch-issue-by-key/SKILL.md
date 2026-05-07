---
name: fetch-issue-by-key
description: Fetch a single Jira issue by key via MCP and return its full content. Use when a Jira key is provided as input to craft or assess flows.
---

# Skill: Fetch Issue by Key

**Purpose:** Fetch single Jira issue by key via MCP server and return full content.

**Config references:**
- `config/mcp.md` — MCP server details

---

## Input

- **issue_key** — Jira issue key (e.g., `PROJECT-1234`)

---

## Instructions

1. Use Atlassian MCP server to fetch issue by provided key.
2. Retrieve all fields: summary, description, status, issue type, reporter, assignee, labels, acceptance criteria, and any additional context sections.
3. Fetch fails: report which issue failed and reason. Don't proceed with downstream skills until fetch succeeds.
4. Return full issue content as-is — don't modify, summarise, or interpret at this stage.

---

## Output

- **issue_content** — Full Jira issue content including all fields
- **issue_type** — Issue type as declared in Jira (Story, Task, Bug, etc.)
- **issue_status** — Current status of issue
- **fetch_success** — Whether fetch succeeded (true/false)
