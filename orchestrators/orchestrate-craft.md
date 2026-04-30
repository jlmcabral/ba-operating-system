---
name: orchestrate-craft
description: Shape an idea, draft, or Jira issue into a complete validated issue with clarification, validation, and revision. Use when user says /craft or wants to write/improve an issue.
---

# Orchestrator: Craft

**Purpose:** Transform a loose idea, a draft, or an existing Jira issue into a complete, validated issue draft — with upfront clarification, targeted validation, and available follow-up questions.

**Entry point:** `/craft [input]`

**Replaces:** Workflow 03 — Issue Crafter

---

## When to use

- You have a rough idea and want to shape it into a proper issue
- You have a draft and want it completed and validated
- You have an existing Jira issue that needs improvement before refinement

---

## Flow

```
Step 1: analyze-input-type
    ↓
Step 2: fetch-required-templates
    ↓
Step 3: normalize-issue-context
    ↓
Step 4: ask-clarification-questions  ← PAUSE (wait for user answers)
    ↓
Step 5: produce-issue-draft
    ↓
Step 6: run validation skills (PARALLEL)
    ├─ validate-problem-framing (if Story/Bug)
    ├─ validate-scope
    ├─ validate-ac-quality
    ├─ validate-ac-uiux-trap (if Story/Bug)
    ├─ validate-completeness
    └─ validate-persona (if Story/Bug)
    ↓ (wait for all to complete)
Step 7: revise-draft-from-findings
    ↓
Step 8: generate-follow-up-questions
    ↓
OUTPUT: Revised draft + mention of available follow-up questions
```

---

## Detailed Steps

### Step 1 — Analyse the input
**Read:** `skills/analyze-input-type/SKILL.md`

Determine the issue type (Story, Task, Bug) and input mode (idea, draft, jira).

- If input is a Jira issue key, first execute `skills/fetch-issue-by-key/SKILL.md` to retrieve the issue content.
- Carry forward: **issue_type**, **input_mode**, **type_confidence**, **type_mismatch** (if any).

If the determined type differs from what the user declared or what Jira says, inform the user of the mismatch and your recommendation before proceeding. If this changes the issue type, note it for the next step.

### Step 2 — Fetch the right template
**Read:** `skills/fetch-required-templates/SKILL.md`

Using the determined issue type from Step 1:
- Fetch **only** the template for that issue type (Story, Task, or Bug).
- If the issue type is Bug, also fetch the Quality Management Playbook.
- If the issue type changed during Step 1 (mismatch detected), fetch the template for the recommended type.

Carry forward: **template_structure**, **playbook_reference** (if fetched).

### Step 3 — Normalise the input
**Read:** `skills/normalize-issue-context/SKILL.md`

Transform the raw input into the canonical schema. This ensures all downstream skills work with the same structure regardless of whether the input was an idea, draft, or Jira issue.

Carry forward: **canonical_issue** (all fields populated or marked `[MISSING]`).

### Step 4 — Ask clarification questions
**Read:** `skills/ask-clarification-questions/SKILL.md`

Review the canonical issue for gaps. Ask the user targeted questions about:
- The problem and user need
- Scope boundaries (what is in/out)
- Any `[MISSING]` fields that would significantly impact draft quality

**⏸️ PAUSE HERE.** Present questions to the user and wait for answers.

If the input is already rich enough (well-structured Jira issue, detailed draft), the skill may determine that no questions are needed — proceed directly to Step 5.

After receiving answers, update the canonical issue with the user's responses. Carry forward: **enriched canonical_issue**.

### Step 5 — Produce the draft
**Read:** `skills/produce-issue-draft/SKILL.md`

Using the enriched canonical issue and template structure, produce a complete issue draft. All template sections must be visible. This should look like the final version.

Carry forward: **issue_draft**.

### Step 6 — Run validations (Parallel)

**Read:** [`orchestrators/REFERENCE-validation-dispatch.md`](REFERENCE-validation-dispatch.md)

Run the applicable validation skills based on the issue type **in parallel** using the standard dispatch pattern. All agents operate on the same enriched_canonical_issue.

**Input to dispatch:** enriched_canonical_issue, issue_type, template_structure.

Carry forward: **validation_findings** (combined from all checks that ran, sorted by severity).

### Step 7 — Revise the draft
**Read:** `skills/revise-draft-from-findings/SKILL.md`

Apply fixable findings to the draft (rewrite bad ACs, fix formatting, strengthen weak problem statements). Leave unfixable findings for follow-up questions.

Carry forward: **revised_draft**, **unresolved_findings**.

### Step 8 — Generate follow-up questions
**Read:** `skills/generate-follow-up-questions/SKILL.md`

From the unresolved findings, produce a targeted list of follow-up questions.

---

## Output

Present to the user:

1. **The revised issue draft** — Complete, all sections visible, revision notes inline where changes were made.

2. **Validation findings** (failing/weak checks only) — For each finding, briefly explain why it is a problem and how to think about fixing it. Do not show passing checks.

3. **Follow-up questions available** — Mention at the end: _"I have [N] follow-up questions that would strengthen this issue. Ask me for them when you're ready."_ Deliver them separately if the user asks.

Refer to `config/output-preferences.md` for output style rules.
