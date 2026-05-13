---
name: orchestrate-craft
description: Shape an idea, draft, or Jira issue into a complete validated issue with clarification, validation, and revision. Use when user says /craft or wants to write/improve an issue.
---

# Orchestrator: Craft

**Purpose:** Transform loose idea, draft, or existing Jira issue into complete, validated issue draft — with upfront clarification, targeted validation, and available follow-up questions.

**Entry point:** `/craft [input]`

**Replaces:** Workflow 03 — Issue Crafter

---

## When to use

- Rough idea → shape into proper issue
- Draft → complete and validate
- Existing Jira issue → improve before refinement

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

Determine issue type (Story, Task, Bug) and input mode (idea, draft, jira).

- If input is Jira key: execute `skills/fetch-issue-by-key/SKILL.md` first.
- Carry forward: **issue_type**, **input_mode**, **type_confidence**, **type_mismatch** (if any).

Type differs from declared/Jira type: inform user of mismatch and recommendation before proceeding.

### Step 2 — Fetch the right template
**Read:** `skills/fetch-required-templates/SKILL.md`

Using determined issue type from Step 1:
- Fetch **only** template for that type (Story, Task, or Bug).
- Bug type: also fetch Quality Management Playbook.
- Type changed in Step 1: fetch template for recommended type.

Carry forward: **template_structure**, **playbook_reference** (if fetched).

### Step 3 — Normalise the input
**Read:** `skills/normalize-issue-context/SKILL.md`

Transform raw input into canonical schema. Ensures all downstream skills work with same structure regardless of input mode.

Carry forward: **canonical_issue** (all fields populated or marked `[MISSING]`).

### Step 4 — Ask clarification questions
**Read:** `skills/ask-clarification-questions/SKILL.md`

Review canonical issue for gaps. Ask user targeted questions about:
- Problem and user need
- Scope boundaries (what is in/out)
- `[MISSING]` fields that would significantly impact draft quality

**⏸️ PAUSE HERE.** Present questions; wait for answers.

Input already rich enough (well-structured Jira issue, detailed draft): skill may determine no questions needed — proceed to Step 5.

After answers received: update canonical issue. Carry forward: **enriched canonical_issue**.

### Step 5 — Produce the draft
**Read:** `skills/produce-issue-draft/SKILL.md`

Using enriched canonical issue and template structure, produce complete issue draft. All template sections visible — this is the final version.

Carry forward: **issue_draft**.

### Step 6 — Run validations (Parallel)

**Read:** [`orchestrators/reference-validation-dispatch.md`](reference-validation-dispatch.md) + [`orchestrators/reference-agent-dispatch.md`](reference-agent-dispatch.md)

Run applicable validation skills based on issue type **in parallel** using standard dispatch pattern. All agents operate on same enriched_canonical_issue.

**Input to dispatch:** enriched_canonical_issue, issue_type, template_structure.

Carry forward: **validation_findings** (combined from all checks, sorted by severity).

### Step 7 — Revise the draft
**Read:** `skills/revise-draft-from-findings/SKILL.md`

Apply fixable findings to draft (rewrite bad ACs, fix formatting, strengthen weak problem statements). Leave unfixable findings for follow-up questions.

Carry forward: **revised_draft**, **unresolved_findings**.

### Step 8 — Generate follow-up questions
**Read:** `skills/generate-follow-up-questions/SKILL.md`

From unresolved findings, produce targeted list of follow-up questions.

---

## Output

1. **Revised issue draft** — Complete, all sections visible, revision notes inline where changes were made.
2. **Validation findings** (failing/weak only) — For each finding: why it's a problem and how to think about fixing it. Don't show passing checks.
3. **Follow-up questions available** — Mention at end: _"I have [N] follow-up questions that would strengthen this issue. Ask me for them when you're ready."_ Deliver separately if asked.

Refer to `config/output-preferences.md` for output style rules.
