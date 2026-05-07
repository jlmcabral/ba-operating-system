---
name: ask-clarification-questions
description: Ask targeted questions to fill gaps in a canonical issue before drafting. Use when the canonical issue has [MISSING] fields or vague problem/scope definitions.
---

# Skill: Ask Clarification Questions

**Purpose:** Before drafting, ask user targeted questions to build shared understanding of problem and scope. Reduces assumptions, avoids wasteful draft-then-question cycles, saves tokens.

**Config references:**
- `config/quality-standards.md` — What a complete issue requires

---

## Input

- **canonical_issue** — Normalised issue context (from `normalize-issue-context`)
- **issue_type** — Story, Task, or Bug
- **input_mode** — idea, draft, or jira

---

## Instructions

1. Review canonical issue. Identify `[MISSING]` or too-vague fields that would produce a weak draft.

2. Focus questions on two areas:
   - **Problem understanding** — Real user need? Friction today? Outcome that matters?
   - **Scope boundaries** — What's included? Explicitly excluded? Which personas affected? What does "done" look like?

3. Don't ask about information clearly present in canonical issue.

4. **idea** mode: expect more questions. **jira** mode: expect fewer. **draft** mode: in between.

5. Ask conversationally, direct style. Group related questions. Max 5-7 — prioritise gaps with biggest impact on draft quality.

6. Input already rich enough (well-structured Jira issue or detailed draft): skip questions, proceed directly. State that sufficient context exists.

7. After answers received: proceed to next skill. Don't re-ask or expand. Use answers + canonical issue as enriched context for drafting.

---

## Output

- **questions** — Targeted questions grouped by theme (problem, scope), or statement that sufficient context exists
- **enriched_context** — After answers received: canonical issue updated with user's responses
