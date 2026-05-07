---
name: orchestrate-help
description: Guide the user to the right entry point with an interactive decision tree. Use when user says /help or is unsure which command to run.
---

# Orchestrator: Help

**Purpose:** Guide user to right entry point based on what they're trying to do. Interactive decision tree.

**Entry point:** `/help`

---

## When to use

- New to system, don't know which command to run
- Unsure whether to use `/craft`, `/assess`, or `/assess-refinement`
- Want to understand what each command does before choosing

---

## Flow

```
Step 1: ask-user-goal
    ↓ (PAUSE — wait for answer)
Step 2: interpret-goal
    ↓
Step 3: recommend-entry-point
    ↓
OUTPUT: Recommended command + brief explanation
```

---

## Detailed Steps

### Step 1 — Ask the User's Goal

**Present simple multiple-choice question:**

```
What are you trying to do right now?

Options:
  A) I have an idea or draft that I want to turn into a complete, validated issue
  B) I have an existing Jira issue and want to check if it's ready for refinement
  C) I have multiple issues to assess, and I want to know which are ready for our refinement session
  D) I just want to understand the commands available
```

**⏸️ PAUSE HERE.** Wait for user to select A, B, C, or D.

User selects D → jump to Step 4 (show all commands).

---

### Step 2 — Interpret the Goal

Based on user's answer:

- **A** → `recommended_command = "/craft"`
- **B** → `recommended_command = "/assess"`
- **C** → `recommended_command = "/assess-refinement"`

Carry forward: **recommended_command**, **user_goal**.

---

### Step 3 — Recommend the Entry Point

```
🎯 Recommended command: {recommended_command}

Here's what it does:
[Explanation — see OUTPUT section]

Ready to run it?
  Yes, let's go!
  No, show me all commands
```

**⏸️ PAUSE HERE.** Wait for response.

- "Yes" → Output recommendation and end.
- "No" → Proceed to Step 4.

---

### Step 4 — Show All Commands

```
Here are all the BA Operating System commands:

📝 `/craft [input]`
   Use this to: Shape an idea, draft, or existing issue into a complete, validated issue
   Input: Brief description, detailed draft, or Jira issue key
   Output: Complete issue draft with validation findings
   Best for: Day-to-day issue writing

🔍 `/assess [JIRA-KEY]`
   Use this to: Check if a specific issue is ready for refinement
   Input: Jira issue key (e.g., PROJECT-1234)
   Output: Readiness report with specific, actionable feedback
   Best for: Quick sanity checks after crafting

📊 `/assess-refinement`
   Use this to: Check all issues in backlog columns before refinement session
   Input: None (uses configured project settings)
   Output: Summary table of all issues + detailed breakdowns for non-ready ones
   Best for: Pre-refinement health checks

❓ `/help`
   Use this to: Get guidance on which command to use
   Input: Answer a simple question
   Output: Recommendation + explanation

---

Choose the command that fits. Then use it!
```

---

## Output

**If user chose a command (A, B, or C):**

```
✅ Recommendation: {recommended_command}

{Explanation}

To use it, type:
  {recommended_command} [params]

Need more details? Run `/help` again and choose "Show me all commands".
```

**If user asked to see all commands (D):**

```
Here are all the BA Operating System commands:

[Show all commands table — see Step 4]
```

---

## Implementation Notes

Simpler than other orchestrators:
- No skills chained (pure presentation)
- No state carried between steps
- All logic is conditional branching and UI presentation

**AI handles:**
1. Asking the question naturally
2. Interpreting user's answer (even if not word-for-word)
3. Explaining recommendation in user's own language

---

## Related Documents

- [entry-points.md](../entry-points.md) — Full command reference
- [ARCHITECTURE.md](../ARCHITECTURE.md) — System overview
- [README.md](../README.md) — Getting started
