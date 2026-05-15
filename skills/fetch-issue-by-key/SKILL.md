---
name: fetch-issue-by-key
description: Fetch a single Jira issue by key via MCP and return the relevant content for craft or assess flows. Use when a Jira key is provided as input to craft or assess flows.
---

# Skill: Fetch Issue by Key

**Purpose:** Fetch a single Jira issue by key via MCP server and return the relevant content needed downstream.

**Config references:**
- `config/mcp.md` — MCP server details

---

## Input

- **issue_key** — Jira issue key (e.g., `PROJECT-1234`)

---

## Instructions

1. Use Atlassian MCP server to fetch issue by provided key.
2. Use the MCP `mcp-atlassian_jira_get_issue` tool with `fields` parameter set to: `summary,description,status,issuetype,reporter,assignee,labels,components,comment`.
3. Fetch fails: report which issue failed and reason. Don't proceed with downstream skills until fetch succeeds.
4. Return the fetched issue content as-is — don't modify, summarise, or interpret at this stage.

---

## Output

- **issue_content** — Jira issue content limited to the requested fields
- **issue_type** — Issue type as declared in Jira (Story, Task, Bug, etc.)
- **issue_status** — Current status of issue
- **fetch_success** — Whether fetch succeeded (true/false)
