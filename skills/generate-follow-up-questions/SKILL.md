---
name: generate-follow-up-questions
description: Produce targeted follow-up questions from unresolved validation findings. Use when validation has gaps that require user input to resolve.
---

# Skill: Generate Follow-up Questions

**Purpose:** Based on validation findings and unresolved gaps, produce a targeted list of follow-up questions that would bring the issue closer to refinement-ready quality.

**Config references:** None directly — operates on validation output.

---

## Input

- **unresolved_findings** — Findings from validation skills that could not be addressed by `revise-draft-from-findings`
- **canonical_issue** — The normalised issue context (for reference)
- **issue_type** — Story, Task, or Bug

---

## Instructions

1. Review each unresolved finding. For each, formulate one specific question that would resolve it.

2. Group questions by theme:
   - **Problem clarity** — Questions about the user need, friction, or impact
   - **Scope** — Questions about what is included/excluded, split decisions
   - **Missing information** — Questions about empty fields or unconfirmed inferences
   - **Ambiguity** — Questions about criteria or requirements that could be interpreted multiple ways

3. Questions must be:
   - **Specific** — Not "Can you provide more detail?" but "What happens when the user submits the form with an invalid date range?"
   - **Actionable** — The answer should directly resolve a gap in the issue
   - **One per gap** — Do not bundle multiple questions together

4. Prioritise questions by impact — which answers would improve the issue the most?

5. Keep the list concise. If there are many findings, focus on the top 5-7 most impactful questions.

---

## Output

- **questions** — A numbered list of specific follow-up questions, grouped by theme
