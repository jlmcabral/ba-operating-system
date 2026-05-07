# MCP Service Configuration

External services (via [MCP — Model Context Protocol](../GLOSSARY.md#mcp)) skills use to fetch/update data.

---

## How it is configured

Credentials live in `.env` at repo root (git-ignored). Copy `.env.example` to `.env` and fill in values.

| Variable                    | Purpose                          | Example                                   |
| --------------------------- | -------------------------------- | ----------------------------------------- |
| `JIRA_URL`                  | Jira instance URL                | `https://jira.example.com/`               |
| `JIRA_USERNAME`             | Jira account email               | `your-email@example.com`                  |
| `JIRA_PERSONAL_TOKEN`       | Jira personal access token       | _(generate from your Jira profile)_       |
| `CONFLUENCE_URL`            | Confluence instance URL          | `https://wiki.example.com/`               |
| `CONFLUENCE_USERNAME`       | Confluence account email         | `your-email@example.com`                  |
| `CONFLUENCE_PERSONAL_TOKEN` | Confluence personal access token | _(generate from your Confluence profile)_ |

### VS Code users

`.vscode/mcp.json` included — reads `.env` automatically. Runs MCP server via Docker. Ensure Docker Desktop running before opening project.

### Other runtimes

Configure runtime to launch `mcp-atlassian` server with env vars from `.env`. See [mcp-atlassian docs](https://mcp-atlassian.soomiles.com/docs).

---

## Available MCP Servers

### mcp-atlassian

Connects to Jira and Confluence — reads issues, fetches templates, queries boards, reads docs.

**Used by skills:**

- `fetch-issue-by-key` — reads single Jira issue
- `fetch-issues-by-status` — reads multiple issues filtered by project and status
- `fetch-required-templates` — reads issue template structures from Jira; reads Quality Management Playbook from Confluence (bug classification)

**Credentials (from `.env`):**

| Variable                    | Purpose                          | Example                                   |
| --------------------------- | -------------------------------- | ----------------------------------------- |
| `JIRA_URL`                  | Jira instance URL                | `https://jira.example.com/`               |
| `JIRA_USERNAME`             | Jira account email               | `your-email@example.com`                  |
| `JIRA_PERSONAL_TOKEN`       | Jira personal access token       | _(generate from your Jira profile)_       |
| `CONFLUENCE_URL`            | Confluence instance URL          | `https://wiki.example.com/`               |
| `CONFLUENCE_USERNAME`       | Confluence account email         | `your-email@example.com`                  |
| `CONFLUENCE_PERSONAL_TOKEN` | Confluence personal access token | _(generate from your Confluence profile)_ |

**Docs:** [mcp-atlassian docs](https://mcp-atlassian.soomiles.com/docs)

---

## How Skills Use MCP

Skills instruct AI agent to use connected MCP server. Each skill specifies:

1. **What to fetch** (e.g., "Fetch Jira issue PROJECT-1164")
2. **What to extract** (e.g., "Extract all field names and descriptions")
3. **What to do if fetch fails** (e.g., "Report failure and stop")

Agent handles MCP communication. Skills define intent only.

---

## Verifying MCP Connection

Before running any orchestrator first time:

```
Fetch Jira issue PROJECT-1164 and tell me its title and description structure
```

Real data returned = MCP connection ready.
