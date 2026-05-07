---
name: generate-follow-up-questions
description: Produce targeted follow-up questions from unresolved validation findings. Use when validation has gaps that require user input to resolve.
---

# Skill: Generate Follow-up Questions

**Purpose:** Based on validation findings and unresolved gaps, produce targeted list of follow-up questions that would bring issue closer to refinement-ready quality.

**Config references:** None — operates on validation output.

---

## Input

- **unresolved_findings** — Findings from validation skills that couldn't be addressed by `revise-draft-from-findings`
- **canonical_issue** — Normalised issue context (for reference)
- **issue_type** — Story, Task, or Bug

---

## Instructions

1. Review each unresolved finding. Formulate one specific question that would resolve it.

2. Group questions by theme:
   - **Problem clarity** — User need, friction, or impact
   - **Scope** — What's included/excluded, split decisions
   - **Missing information** — Empty fields or unconfirmed inferences
   - **Ambiguity** — Criteria or requirements interpretable multiple ways

3. Questions must be:
   - **Specific** — Not "Can you provide more detail?" but "What happens when user submits form with invalid date range?"
   - **Actionable** — Answer directly resolves a gap in issue
   - **One per gap** — Don't bundle multiple questions

4. Prioritise by impact — which answers improve issue most?

5. Keep concise. Many findings: focus on top 5-7 most impactful.

---

## Output

- **questions** — Numbered list of specific follow-up questions, grouped by theme
