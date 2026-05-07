---
name: fetch-issues-by-status
description: Fetch all issues from configured Jira project columns. Use when running batch refinement assessment across the backlog.
---

# Skill: Fetch Issues by Status

**Purpose:** Fetch all issues from configured Jira projects and status columns. Used by batch readiness assessment orchestrator.

**Config references:**
- `config/project.md` — Projects and statuses to query
- `config/mcp.md` — MCP server details

---

## Input

No user input required. Reads default projects and statuses from `config/project.md`.

---

## Instructions

1. Read `config/project.md` to identify projects and statuses to query.
2. Use Atlassian MCP server to fetch all issues matching those projects and statuses.
3. For each issue, retrieve full content: summary, description, status, issue type, reporter, assignee, labels, acceptance criteria, and additional context sections.
4. Any fetch fails: report which project/status combination failed and why. Continue fetching the rest.
5. Return all successfully fetched issues as list.

---

## Output

- **issues** — List of full Jira issue contents, one per fetched issue
- **fetch_summary** — Count of issues fetched, any failures reported
