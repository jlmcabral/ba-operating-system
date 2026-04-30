---
name: normalize-issue-context
description: Transform raw input (idea, draft, or Jira issue) into a canonical schema for downstream skills. Use when preparing input for validation or drafting.
---

# Skill: Normalise Issue Context

**Purpose:** Transform raw input — whether it is a loose idea, a pasted draft, or a fetched Jira issue — into a canonical schema that all downstream skills can consume consistently.

This is the bridge between "what we received" and "what validators, drafters, and reporters expect." Without this normalisation step, every downstream skill would need conditional logic for each input format.

**Config references:**
- `config/quality-standards.md` — For understanding required fields

---

## Input

- **raw_input** — The original input in any of these forms:
  - A loose idea (free text)
  - A pasted draft (partial structure)
  - A fetched Jira issue (from `fetch-issue-by-key`)
- **issue_type** — As determined by `analyze-input-type`
- **input_mode** — idea, draft, or jira (from `analyze-input-type`)

---

## Instructions

1. Extract the following fields from the input, regardless of its format. If a field is not present, mark it as `[MISSING]`:

   - **Summary / title**
   - **Problem statement** — The situation, friction, and impact
   - **User / persona** — Who is affected
   - **Candidate story** (Stories only) — "As a [user], I want [what], so that [why]"
   - **Acceptance criteria** — Existing criteria in any format
   - **Additional context** — Any links, hints, background, notes, or references. **Preserve this content exactly as found** — this represents prior thinking that someone invested effort in.
   - **Technical approach** — If present (may be empty — this is expected)
   - **Confidence level** — If stated
   - **Labels, components, reporter, assignee** — Metadata if available

2. For fields that exist but are poorly structured (e.g., acceptance criteria not in Gherkin format), extract the content as-is. Formatting corrections happen downstream in `produce-issue-draft`.

3. For Jira issues: preserve the full description body. Do not discard sections that don't map to known fields — they may contain valuable context.

4. For ideas: most fields will be `[MISSING]`. That is expected — the `ask-clarification-questions` skill will address gaps.

---

## Output

A canonical issue object with all fields listed above, each populated or marked `[MISSING]`. This object is the input for all downstream skills.
