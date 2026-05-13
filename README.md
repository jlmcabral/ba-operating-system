<p align="center">
  <img src="https://em-content.zobj.net/source/apple/391/compass_1f9ed.png" width="120" />
</p>

<h1 align="center">BA Operating System</h1>

<p align="center">
  <strong>A prompt-driven framework for upstream product work</strong>
</p>

<p align="center">
  <a href="#-what-it-is">What it is</a> •
  <a href="#-commands">Commands</a> •
  <a href="#-principles">Principles</a> •
  <a href="#-getting-started">Getting started</a> •
  <a href="#-docs">Docs</a>
</p>

---

## 🧭 What it is

A modular system of **skills**, **orchestrators**, and **configuration** that takes you from a rough idea to a refinement-ready Jira issue — or assesses an entire board for refinement readiness.

Each skill does one thing. Orchestrators chain them together. Configuration adapts the system to your projects. Runs on any AI tool that supports [MCP](glossary.md#mcp) — currently configured for [GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/about-copilot-cli) in agent mode.

---

## ⚡ Commands

| Command | What it does |
| ------- | ------------ |
| `/craft [input]` | Shape an idea, draft, or Jira issue into a complete, validated issue |
| `/assess [PROJECT-1234]` | Check if one specific issue is ready for refinement |
| `/assess-refinement` | Assess all issues in your configured columns before a refinement session |

→ Full details and examples: [entry-points.md](entry-points.md)

> [!NOTE]
> The system is designed to be AI runtime agnostic — skills, orchestrators, and configuration are plain Markdown and work with any MCP-compatible tool. However, it is currently configured and tested for **GitHub Copilot** (CLI and VS Code agent mode). Support for other runtimes (e.g. Claude Code) is planned but not yet available. A migration guide will be added when that support lands.

---

## 🧱 Principles

- **Problem-first.** Features are hypotheses. The system surfaces the real problem behind every request before anything is written.
- **Modular.** Skills do one thing. Orchestrators compose them. Configuration adapts to your context.
- **Token-efficient.** Fetches only what is needed. Shows only what matters. Questions come before drafts, not after.
- **Human gates, not full automation.** The AI handles structure, fetching, and analysis. You make the decisions.
- **BA-friendly.** No technical background assumed. Every concept is explained in the [Glossary](glossary.md).
- **Designed to evolve.** Add new skills, create new orchestrators, or adjust configuration without rebuilding.

---

## 🚀 Getting started

Requires [GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli) — install that first.

Full setup walkthrough → [setup.md](setup.md)

How the layers fit together → [architecture.md](architecture.md)

---

## 📚 Docs

| Document | What it covers |
| -------- | -------------- |
| [setup.md](setup.md) | Step-by-step setup from scratch |
| [architecture.md](architecture.md) | How the layers fit together |
| [entry-points.md](entry-points.md) | Available commands with examples |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to add or modify skills |
| [glossary.md](glossary.md) | Technical terms explained simply |
| [config/README.md](config/README.md) | Configuration guide |
| [skills/README.md](skills/README.md) | Skill inventory |
| [orchestrators/README.md](orchestrators/README.md) | How orchestrators work |
