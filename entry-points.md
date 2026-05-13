# Entry Points

Entry points are the commands you use to interact with the BA Operating System. Each one triggers an [orchestrator](orchestrators/README.md) that chains the right [skills](skills/README.md) together.

> **Tip:** You don't need to remember the exact wording. These are plain-language triggers — the AI understands variations. The examples below show the recommended phrasing.

---

## Available commands

### `/craft` — Shape an issue

**What it does:** Takes your input (an idea, a draft, or a Jira issue key) and produces a complete, validated issue draft. Asks clarifying questions first, then writes the draft, validates it, and flags any issues.

**How to use it:**

From an idea:

```
/craft I need a way for operations managers to see which tasks are overdue without opening each one individually
```

From a Jira issue:

```
/craft PROJECT-1234
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
/assess PROJECT-1234
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
