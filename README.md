# BA Operating System

A prompt-driven framework for upstream product work. Built for business analysts who want to consistently produce requirements grounded in real user problems — not feature assumptions — and reduce the uncertainty that reaches engineering.

---

## What this is

A modular system of **skills**, **orchestrators**, and **configuration** that helps you go from a rough idea to a refinement-ready Jira issue — or assess an entire board for refinement readiness. Each skill does one thing well. Orchestrators chain them together. Configuration adapts the system to your projects.

The system runs on any AI tool that supports [MCP](GLOSSARY.md#mcp) (Model Context Protocol). It is currently configured for GitHub Copilot in agent mode.

---

## Quick start

1. Clone this repository
2. Copy `.env.example` to `.env` and add your credentials
3. Open it in your AI runtime (VS Code with Copilot, or any MCP-compatible tool)
4. Start using the commands below

→ Full setup instructions: [SETUP.md](SETUP.md)

---

## Commands

| Command | What it does |
|---------|-------------|
| `/craft [input]` | Shape an idea, draft, or Jira issue into a complete, validated issue |
| `/assess [BAIKAL-1234]` | Check if one specific issue is ready for refinement |
| `/assess-refinement` | Assess all issues in your configured columns before a refinement session |

→ Full details and examples: [entry-points.md](entry-points.md)

---

## Principles

- **Problem-first.** Features are hypotheses. The system surfaces the real problem behind every request before anything is written.
- **Modular.** Skills do one thing. Orchestrators compose them. Configuration adapts to your context.
- **Token-efficient.** Fetches only what is needed. Shows only what matters. Questions come before drafts, not after.
- **Human gates, not full automation.** The AI handles structure, fetching, and analysis. You make the decisions.
- **BA-friendly.** No technical background assumed. Every concept is explained in the [Glossary](GLOSSARY.md).
- **Designed to evolve.** Add new skills, create new orchestrators, or adjust configuration without rebuilding.

---

## How it is structured

```
ba-operating-system/
├── .vscode/
│   └── mcp.json                     # MCP config for VS Code (reads from .env)
├── config/                          # Your project settings
│   ├── project.md                   # Jira projects, statuses, templates
│   ├── quality-standards.md         # Gherkin rules, AC standards
│   ├── output-preferences.md        # Output style rules
│   ├── personas.md                  # Known user roles
│   └── mcp.md                       # External service documentation
├── skills/                          # Building blocks (one job each)
│   ├── fetch-issue-by-key/SKILL.md
│   ├── analyze-input-type/SKILL.md
│   ├── validate-problem-framing/SKILL.md
│   └── ... (16 skills total)
├── orchestrators/                   # Recipes that chain skills
│   ├── orchestrate-craft.md
│   ├── orchestrate-assess-single.md
│   └── orchestrate-assess-refinement.md
├── workflows/                       # Standalone workflows (not yet migrated to skills)
├── entry-points.md                  # Available commands
├── ARCHITECTURE.md                  # How the system is structured
├── SETUP.md                         # Getting started guide
├── GLOSSARY.md                      # Terms explained for non-technical users
├── CONTRIBUTING.md                  # How to add/modify skills
└── README.md                        # This file
```

→ Architecture details: [ARCHITECTURE.md](ARCHITECTURE.md)

---

## Documentation

| Document | What it covers |
|----------|---------------|
| [SETUP.md](SETUP.md) | Step-by-step setup from scratch |
| [ARCHITECTURE.md](ARCHITECTURE.md) | How the layers fit together |
| [GLOSSARY.md](GLOSSARY.md) | Technical terms explained simply |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to add or modify skills |
| [config/README.md](config/README.md) | Configuration guide |
| [skills/README.md](skills/README.md) | Skill inventory and how to read a skill |
| [orchestrators/README.md](orchestrators/README.md) | How orchestrators work |
| [entry-points.md](entry-points.md) | Available commands with examples |

---

## MCP servers required

| Server | Used for |
|--------|----------|
| [mcp-atlassian](https://mcp-atlassian.soomiles.com/docs) | Jira issues, templates, Confluence pages |

See [config/mcp.md](config/mcp.md) for configuration details. Credentials live in a `.env` file (git-ignored). A `.vscode/mcp.json` is included for VS Code users, but any MCP-compatible runtime can read from `.env`.
