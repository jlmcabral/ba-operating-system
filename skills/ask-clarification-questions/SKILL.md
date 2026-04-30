---
name: ask-clarification-questions
description: Ask targeted questions to fill gaps in a canonical issue before drafting. Use when the canonical issue has [MISSING] fields or vague problem/scope definitions.
---

# Skill: Ask Clarification Questions

**Purpose:** Before producing a draft, ask the user targeted questions to build a shared understanding of the problem and scope. This reduces assumptions, avoids wasteful draft-then-question cycles, and saves tokens.

**Config references:**
- `config/quality-standards.md` — To understand what a complete issue requires

---

## Input

- **canonical_issue** — The normalised issue context (from `normalize-issue-context`)
- **issue_type** — Story, Task, or Bug
- **input_mode** — idea, draft, or jira

---

## Instructions

1. Review the canonical issue object. Identify which fields are `[MISSING]` or too vague to produce a meaningful draft.

2. Focus questions on two areas:
   - **Problem understanding** — What is the real user need? What friction exists today? What outcome matters?
   - **Scope boundaries** — What is included? What is explicitly excluded? Which personas are affected? What does "done" look like?

3. Consider what is already provided. Do not ask about information that is clearly present in the canonical issue.

4. For **idea** mode: expect more questions (less context provided). For **jira** mode: expect fewer questions (more context already available). For **draft** mode: somewhere in between.

5. Ask questions in a conversational, direct style. Group related questions together. Do not ask more than 5-7 questions — prioritise the gaps that would have the biggest impact on draft quality.

6. If the input is already rich enough to produce a solid draft (e.g., a well-structured Jira issue or detailed draft), skip questions and proceed directly. State that you have enough context.

7. After receiving answers, proceed to the next skill in the orchestration flow. Do not re-ask or expand. Use the answers together with the canonical issue as the enriched context for drafting.

---

## Output

- **questions** — A list of targeted questions grouped by theme (problem, scope), or a statement that sufficient context exists
- **enriched_context** — After answers are received: the canonical issue updated with the user's responses
