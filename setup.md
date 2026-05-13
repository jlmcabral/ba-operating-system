# 🛠️ Setup Guide

This guide walks you through setting up the BA Operating System from scratch. No technical experience is assumed — every step is explained.

---

## 📋 Prerequisites

Before you start, you need:

1. **Visual Studio Code** (VS Code) — the code editor this system runs in. [Download it here](https://code.visualstudio.com/).
2. **GitHub Copilot extension** — installed in VS Code with an active subscription.
3. **Docker** — required to run the MCP server that connects to Jira/Confluence. [Install Docker Desktop](https://www.docker.com/products/docker-desktop/).
4. **Node.js** (v18+) — required to run deterministic validation scripts. [Download here](https://nodejs.org/).
5. **Git** — required to clone the repository. [Download here](https://git-scm.com/downloads). Most systems have it pre-installed.
6. **Access to your Jira and Confluence instance** — you need to be able to create API tokens.

---

## Step 1: Clone the repository

"Cloning" means downloading a copy of this project to your computer.

1. Open VS Code
2. Open the terminal (View → Terminal, or `` Ctrl+` ``)
3. Navigate to where you want the project:
   ```
   cd ~/Code
   ```
4. Clone the repository:
   ```
   git clone https://github.com/[your-org]/ba-operating-system.git
   ```
5. Open the project folder in VS Code:
   ```
   code ba-operating-system
   ```

---

## Step 2: Create your credentials file

The system needs to connect to your Jira and Confluence instance. Credentials are stored in a `.env` file that stays on your computer (it is git-ignored — never uploaded to GitHub).

1. In the project root, find `.env.example`
2. Copy it and rename the copy to `.env`:
   ```
   cp .env.example .env
   ```
3. Open `.env` and fill in your values:
   ```
   JIRA_URL=https://your-jira-instance.example.com/
   JIRA_USERNAME=your.name@company.com
   JIRA_PERSONAL_TOKEN=your_jira_token_here
   CONFLUENCE_URL=https://your-confluence-instance.example.com/
   CONFLUENCE_USERNAME=your.name@company.com
   CONFLUENCE_PERSONAL_TOKEN=your_confluence_token_here
   ```

### How to get a personal access token

The steps depend on your Atlassian instance type (Server/DC or Cloud). Check with your IT team if unsure, or see the [mcp-atlassian documentation](https://mcp-atlassian.soomiles.com/docs) for detailed instructions.

> ⚠️ **Keep your API token secret.** Never share it or commit it to GitHub. The `.gitignore` file is already configured to prevent this.

---

## Step 3: Configure your AI runtime

The [MCP server](glossary.md#mcp) is what lets the AI assistant talk to Jira and Confluence. How you configure it depends on which AI runtime you use.

### GitHub Copilot CLI

The project includes a root `.mcp.json` file for Copilot CLI. It reads credentials from your `.env` file automatically.

### Other MCP-compatible runtimes

If you use a different AI runtime (e.g., Amazon Bedrock, Claude Desktop), configure it to run the `mcp-atlassian` server with the environment variables from your `.env` file. See the [mcp-atlassian documentation](https://mcp-atlassian.soomiles.com/docs) for runtime-specific setup.

For more details on MCP configuration, see [config/mcp.md](config/mcp.md).

---

## Step 4: Customise your configuration

The `/config` directory contains settings specific to your projects. Two files need creating from examples:

1. **`config/project.md`** — Copy `config/project.md.example` to `config/project.md` and fill in your Jira project keys, statuses, and template issue keys.
2. **`config/personas.md`** — Copy `config/personas.md.example` to `config/personas.md` and add the user roles for your applications.

```
cp config/project.md.example config/project.md
cp config/personas.md.example config/personas.md
```

These files are git-ignored (like `.env`) because they contain project-specific data.

3. **Other config files** — Review but likely don't need changes yet.

See the [Configuration README](config/README.md) for details on each file.

---

## Step 5: Verify your setup

Open GitHub Copilot in VS Code (agent mode) and run this test:

```
Fetch Jira issue PROJECT-1164 and tell me its title and description structure
```

If you see real issue data come back, your MCP connection is working and you are ready to go.

---

## Step 6: Try your first command

Start with something simple:

```
/craft I need a way for operations managers to see which tasks are overdue without opening each one individually
```

The system will:

1. Determine this is a Story
2. Fetch the Story template
3. Ask you clarifying questions
4. Produce a complete draft
5. Validate it and show any findings

---

## 🔧 Troubleshooting

### "MCP fetch failed" or "Cannot connect to Jira"

- Check that your `.env` values are correct (URL, email, token)
- Verify your API token hasn't expired at [Atlassian token management](https://id.atlassian.com/manage-profile/security/api-tokens)
- If using Copilot CLI, restart the session so `.mcp.json` re-reads the `.env` file

### "Template not found"

- Check that the template issue keys in `config/project.md` match real issues in your Jira instance
- The default templates (PROJECT-1164, PROJECT-1544, PROJECT-1390) are specific to one project — update them for yours

### The AI doesn't follow the skills/orchestrators

- Make sure you're in GitHub Copilot **agent mode** (not inline or chat mode)
- Check that the `.github/copilot-instructions.md` file references the new architecture (see below)

---

## 🚀 What's next

- Read the [Architecture guide](architecture.md) to understand how the system is structured
- Browse the [Skills inventory](skills/README.md) to see what building blocks are available
- Check the [Entry Points](entry-points.md) for all available commands
