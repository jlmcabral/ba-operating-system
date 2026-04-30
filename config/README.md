# Configuration

This directory contains all the settings that make the BA Operating System work for **your** projects. When you clone this repository to use it for your own work, these are the files you customise.

> **New here?** Start with the [Setup Guide](../SETUP.md) which walks you through configuring everything step by step.

---

## What is in here

| File                    | What it controls                                               | How often you change it     |
|-------------------------|----------------------------------------------------------------|-----------------------------|
| `project.md`           | Which Jira projects and statuses the system works with, and which issue templates to use | When you start a new project or change your board setup |
| `quality-standards.md` | The rules for writing acceptance criteria, classifying issue types, and assessing quality | Rarely — these are your house standards |
| `output-preferences.md`| How verbose the system is, what it shows and hides in its output | When you want to tune the output style |
| `personas.md`          | The known user roles for your applications                     | When your user base changes |
| `mcp.md`               | Which external services the system connects to (Jira, Confluence) | When you add or change MCP servers |

---

## How skills use configuration

Skills (the building blocks of this system) reference configuration files by path. For example, a skill that validates acceptance criteria will read `config/quality-standards.md` to know what rules to apply.

This means:
- **You change the rules in one place** and every skill that uses them picks up the change automatically
- **You never need to edit a skill file** to change project-specific settings
- **Different BAs can use different configurations** by changing these files — the skills stay the same

---

## Secrets and credentials

Connection credentials (API tokens, email, instance URL) live in a `.env` file at the **repository root** — not in this directory. The `.env` file is git-ignored so secrets are never committed.

The `.vscode/mcp.json` reads from `.env` for VS Code users. Other AI runtimes can read `.env` directly.

See [Setup Guide](../SETUP.md) for how to create your `.env` file from the provided `.env.example` template.
