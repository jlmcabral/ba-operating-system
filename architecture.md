# 🗺️ Architecture

This document explains how the BA Operating System is structured and how the pieces fit together. For a quick-start guide, see [setup.md](setup.md). For term definitions, see the [Glossary](glossary.md).

---

## 🔭 The big picture

The system has five layers. Each layer has a clear job:

```
┌─────────────────────────────────────────────┐
│      Entry Points (/craft, /assess)          │  ← What you interact with
├─────────────────────────────────────────────┤
│           Orchestrators                      │  ← Recipes that chain skills
├─────────────────────────────────────────────┤
│           Skills                             │  ← Building blocks (one job each)
├─────────────────────────────────────────────┤
│           Configuration                      │  ← Your project settings
├─────────────────────────────────────────────┤
│           External Services (MCP)            │  ← Jira, Confluence
└─────────────────────────────────────────────┘
```

**Information flows downward.** You type a command (entry point), which triggers an orchestrator, which runs skills in order. Skills read your configuration and fetch data from external services when needed.

---

## 🚪 Layer 1: Entry Points

**Location:** `entry-points.md`

These are the day-to-day commands you use. There are three:

| Command              | What it does                                              |
| -------------------- | --------------------------------------------------------- |
| `/craft [input]`     | Shape an idea, draft, or Jira issue into a complete issue |
| `/assess [key]`      | Check if one specific issue is ready for refinement       |
| `/assess-refinement` | Check all issues in your configured columns               |

Entry points are just triggers — they tell the system which orchestrator to run.

Internal maintenance workflows such as `/refresh-templates` are documented in `orchestrators/README.md`, not in `entry-points.md`.

→ [Full details](entry-points.md)

---

## 🔗 Layer 2: Orchestrators

**Location:** `orchestrators/`

Orchestrators are recipes. They define which skills to run, in what order, and where to pause for your input.

| Orchestrator                    | Skills chained                                                                                     |
| ------------------------------- | -------------------------------------------------------------------------------------------------- |
| `orchestrate-craft`             | analyse → fetch template → ask questions → normalise → draft → validate → revise → follow-up       |
| `orchestrate-assess-single`     | fetch issue → analyse → fetch template → normalise → validate → format report                      |
| `orchestrate-assess-refinement` | fetch all issues → classify → fetch templates (deduplicated) → validate each → format batch report |
| `orchestrate-refresh-templates` | fetch templates and playbook → refresh local cache                                                  |

Orchestrators carry **state** between skills — the output of one skill becomes the input of the next.

→ [Full details](orchestrators/README.md)

---

## 🧱 Layer 3: Skills

**Location:** `skills/`

Skills are the building blocks. Each one does one thing:

| Category    | Skills   | What they do                                                                           |
| ----------- | -------- | -------------------------------------------------------------------------------------- |
| Fetching    | 3 skills | Get data from Jira/Confluence                                                          |
| Analysis    | 2 skills | Understand and normalise input                                                         |
| Interaction | 1 skill  | Ask you clarifying questions                                                           |
| Production  | 2 skills | Write and revise issue drafts                                                          |
| Validation  | 9 skills | Check quality (problem framing, scope, AC quality, UI/UX traps, completeness, persona and role coverage, scenario coverage, dependencies, design reference) |
| Output      | 2 skills | Format follow-up questions and readiness reports                                       |

**Key design principle:** Skills don't know about each other. They receive input, do their job, and produce output. Only orchestrators decide what runs when.

→ [Full details](skills/README.md)

---

## ⚙️ Layer 4: Configuration

**Location:** `config/`

Configuration files hold your project-specific settings. Skills reference these files — so you change settings in one place and every skill picks up the change.

| File                    | What it controls                                     |
| ----------------------- | ---------------------------------------------------- |
| `project.md`            | Jira projects, statuses, template IDs                |
| `quality-standards.md`  | Gherkin rules, AC standards, problem statement rules |
| `output-preferences.md` | What the system shows/hides in output                |
| `personas.md`           | Known user roles for your applications               |
| `mcp.md`                | External service connections                         |

**Secrets** (API tokens, emails) live in `.env` at the repository root — git-ignored, never committed. The root `.mcp.json` reads from `.env` for Copilot CLI users.

→ [Full details](config/README.md)

---

## 🌐 Layer 5: External Services

**Connection:** Via [MCP](glossary.md#mcp) (Model Context Protocol)

The system connects to:

- **Jira** — to fetch issues, read templates, and (when instructed) create/update issues
- **Confluence** — to fetch reference documentation (Quality Management Playbook)

Skills instruct the AI to fetch data; the AI handles the actual MCP communication.

> [!NOTE]
> The system is designed to be AI runtime agnostic — skills, orchestrators, and configuration are plain Markdown and work with any MCP-compatible tool. It is currently configured and tested for **GitHub Copilot** (CLI and VS Code agent mode). Support for other runtimes (e.g. Claude Code) is planned. A migration guide covering configuration differences between runtimes will be added when that support lands.

---

## 📋 How a typical `/craft` run works

Here is what happens when you type `/craft PROJECT-1234`:

1. The entry point triggers `orchestrate-craft`
2. The orchestrator reads `skills/fetch-issue-by-key/SKILL.md` → fetches PROJECT-1234 from Jira
3. It reads `skills/analyze-input-type/SKILL.md` → determines it is a Story
4. It reads `skills/fetch-required-templates/SKILL.md` → fetches only the Story template
5. It reads `skills/normalize-issue-context/SKILL.md` → converts the issue into a standard format
6. It reads `skills/ask-clarification-questions/SKILL.md` → asks you 3-5 questions about gaps
7. **You answer the questions**
8. It reads `skills/produce-issue-draft/SKILL.md` → writes the full draft
9. It runs validation skills → finds two issues (weak problem statement, one UI/UX trap)
10. It reads `skills/revise-draft-from-findings/SKILL.md` → fixes the UI/UX trap, strengthens the problem statement
11. It reads `skills/generate-follow-up-questions/SKILL.md` → prepares 2 follow-up questions
12. **You see:** The revised draft + 2 validation findings with explanations + note about follow-up questions

---

## 💡 Design principles

1. **Single responsibility.** Each skill does one thing. Each config file controls one concern.
2. **DRY.** Validation logic is defined once in skills, used by multiple orchestrators.
3. **Configuration over code.** Project settings live in config files, not embedded in skills.
4. **Token efficiency.** Fetch only what is needed. Show only what matters.
5. **BA-friendly.** Documentation assumes no technical background. Every concept is explained.

---

## 📁 Project structure

Keep the repo structure simple and intentional:

| Path | Purpose |
| --- | --- |
| `skills/` | Atomic building blocks. One skill per directory. |
| `orchestrators/` | Workflow recipes that chain skills together. |
| `config/` | Project-specific settings and standards. |
| `.cache/` | Disposable fetched artifacts such as cached templates. Not source-of-truth docs. |
| root docs (`architecture.md`, `design-patterns.md`, `entry-points.md`, `CONTRIBUTING.md`) | Persistent guidance on how the system works and how to change it. |

If a document describes lasting system behavior or contributor rules, keep it in the normal repo docs, not in `.cache/`.
