# Entry Points

Entry points are the commands you use to interact with the BA Operating System. Each one triggers an [orchestrator](orchestrators/README.md) that chains the right [skills](skills/README.md) together.

> **Tip:** You don't need to remember the exact wording. These are plain-language triggers — the AI understands variations. The examples below show the recommended phrasing.

---

## Quick Decision Tree

Not sure which command to use? Run `/help` — it will guide you to the right one.

---

## Available commands

### `/help` — Get guidance

**What it does:** Interactive guide to help you choose the right command based on what you're trying to do.

**How to use it:**

```
/help
```

**What you get back:**
- A simple question about your goal
- A recommendation for which command to use
- Explanations of all available commands

**Best for:** You're new to the system or unsure which command to run next.

---

### `/craft` — Shape an issue

**What it does:** Takes your input (an idea, a draft, or a Jira issue key) and produces a complete, validated issue draft. Asks clarifying questions first, then writes the draft, validates it, and flags any issues.

**How to use it:**

From an idea:
```
/craft I need a way for operations managers to see which tasks are overdue without opening each one individually
```

From a Jira issue:
```
/craft BAIKAL-1234
```

From a draft:
```
/craft [paste your draft here]
```

**What you get back:**
1. Clarifying questions (if needed) — answer these first
2. A complete issue draft with all template sections
3. Validation findings (only problems — not a checklist of passes)
4. A note that follow-up questions are available if you want them

---

### `/assess` — Check one issue

**What it does:** Fetches a single Jira issue and assesses whether it is ready for refinement. No other issues are fetched — just the one you specify.

**How to use it:**

```
/assess BAIKAL-1234
```

**What you get back:**
- A readiness tier: ✅ Ready, ⚠️ Needs Minor Work, or ❌ Not Ready
- A detailed breakdown of what passes and what fails
- Specific, actionable items for anything that needs to change

---

### `/assess-refinement` — Pre-refinement health check

**What it does:** Fetches all issues from your configured project columns (see `config/project.md`) and assesses every one for refinement readiness. Use this before a refinement session to know what is ready and what needs work.

**How to use it:**

```
/assess-refinement
```

No parameters needed — it uses the projects and statuses defined in your configuration.

**What you get back:**
1. A summary table showing every issue, its type, readiness tier, and failure categories
2. Detailed breakdowns for issues that are ⚠️ or ❌ (ready issues are in the table but don't get a breakdown)

---
