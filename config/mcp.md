# MCP Service Configuration

This file documents the external services (via [MCP — Model Context Protocol](../GLOSSARY.md#mcp)) that skills use to fetch and update data. Skills reference this file to know which services are available and how to use them.

For a guide on what MCP is and why it matters, see the [Glossary](../GLOSSARY.md#mcp).

---

## How it is configured

Credentials live in a `.env` file at the repository root (git-ignored). Copy `.env.example` to `.env` and fill in your values.

| Variable                    | Purpose                          | Example                                  |
|-----------------------------|----------------------------------|------------------------------------------|
| `JIRA_URL`                  | Your Jira instance URL           | `https://jira.example.com/`              |
| `JIRA_USERNAME`             | Your Jira account email          | `your-email@example.com`                 |
| `JIRA_PERSONAL_TOKEN`       | Jira personal access token       | _(generate from your Jira profile)_      |
| `CONFLUENCE_URL`            | Your Confluence instance URL     | `https://wiki.example.com/`              |
| `CONFLUENCE_USERNAME`       | Your Confluence account email    | `your-email@example.com`                 |
| `CONFLUENCE_PERSONAL_TOKEN` | Confluence personal access token | _(generate from your Confluence profile)_|

### VS Code users

A `.vscode/mcp.json` file is included and reads from your `.env` automatically. It runs the MCP server via Docker — ensure Docker Desktop is running before opening the project.

### Other runtimes

If you use a different AI runtime, configure it to launch the `mcp-atlassian` server with the environment variables from `.env`. See the [mcp-atlassian docs](https://mcp-atlassian.soomiles.com/docs) for runtime-specific instructions.

---

## Available MCP Servers

### mcp-atlassian

**What it does:** Connects to Jira and Confluence so the system can read issues, fetch templates, query project boards, and read documentation pages.

**Used by skills:**
- `fetch-issue-by-key` — Reads a single Jira issue
- `fetch-issues-by-status` — Reads multiple issues filtered by project and status
- `fetch-required-templates` — Reads issue template structures from Jira
- `fetch-required-templates` — Reads the Quality Management Playbook from Confluence (when classifying bugs)

**Credentials (from `.env`):**

| Variable                    | Purpose                          | Example                                  |
|-----------------------------|----------------------------------|------------------------------------------|
| `JIRA_URL`                  | Your Jira instance URL           | `https://jira.example.com/`              |
| `JIRA_USERNAME`             | Your Jira account email          | `your-email@example.com`                 |
| `JIRA_PERSONAL_TOKEN`       | Jira personal access token       | _(generate from your Jira profile)_      |
| `CONFLUENCE_URL`            | Your Confluence instance URL     | `https://wiki.example.com/`              |
| `CONFLUENCE_USERNAME`       | Your Confluence account email    | `your-email@example.com`                 |
| `CONFLUENCE_PERSONAL_TOKEN` | Confluence personal access token | _(generate from your Confluence profile)_|

**Documentation:** [mcp-atlassian docs](https://mcp-atlassian.soomiles.com/docs)

---

## How Skills Use MCP

Skills do not call MCP directly — they instruct the AI agent to use the connected MCP server. Each skill specifies:

1. **What to fetch** (e.g., "Fetch Jira issue BAIKAL-1164")
2. **What to extract** (e.g., "Extract all field names and their descriptions")
3. **What to do if the fetch fails** (e.g., "Report the failure and stop")

The AI agent handles the actual MCP communication. Skills only define the intent.

---

## Verifying Your MCP Connection

Before running any orchestrator for the first time, confirm MCP is working:

```
Fetch Jira issue BAIKAL-1164 and tell me its title and description structure
```

If it returns real data, your MCP connection is ready.
