---
name: normalize-issue-context
description: Transform raw input (idea, draft, or Jira issue) into a canonical schema for downstream skills. Use when preparing input for validation or drafting.
---

# Skill: Normalise Issue Context

**Purpose:** Transform raw input — loose idea, pasted draft, or fetched Jira issue — into canonical schema all downstream skills consume consistently.

Bridge between "what we received" and "what validators, drafters, and reporters expect." Without normalisation, every downstream skill needs conditional logic for each input format.

**Config references:**
- `config/quality-standards.md` — Required fields

---

## Input

- **raw_input** — Original input in any form: loose idea (free text), pasted draft (partial structure), or fetched Jira issue (from `fetch-issue-by-key`)
- **issue_type** — As determined by `analyze-input-type`
- **input_mode** — idea, draft, or jira (from `analyze-input-type`)

---

## Instructions

1. Extract following fields from input regardless of format. Field not present → mark `[MISSING]`:

   - **Summary / title**
   - **Problem statement** — Situation, friction, and impact
   - **User / persona** — Who is affected
   - **Candidate story** (Stories only) — "As a [user], I want [what], so that [why]"
   - **Acceptance criteria** — Existing criteria in any format
   - **Additional context** — Links, hints, background, notes, references. **Preserve exactly as found** — represents prior thinking someone invested effort in.
   - **Technical approach** — If present (may be empty — expected)
   - **Confidence level** — If stated
   - **Labels, components, reporter, assignee** — Metadata if available

2. Fields existing but poorly structured (e.g., AC not in Gherkin): extract content as-is. Formatting corrections happen downstream in `produce-issue-draft`.

3. Jira issues: preserve full description body. Don't discard sections that don't map to known fields — may contain valuable context.

4. Ideas: most fields will be `[MISSING]`. Expected — `ask-clarification-questions` will address gaps.

---

## Output

Canonical issue object with all fields above, each populated or marked `[MISSING]`. Input for all downstream skills.
