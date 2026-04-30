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
**Read:** `skills/analyze-input-type.md`

Determine the issue type (Story, Task, Bug) and input mode (idea, draft, jira).

- If input is a Jira issue key, first execute `skills/fetch-issue-by-key.md` to retrieve the issue content.
- Carry forward: **issue_type**, **input_mode**, **type_confidence**, **type_mismatch** (if any).

If the determined type differs from what the user declared or what Jira says, inform the user of the mismatch and your recommendation before proceeding. If this changes the issue type, note it for the next step.

### Step 2 — Fetch the right template
**Read:** `skills/fetch-required-templates.md`

Using the determined issue type from Step 1:
- Fetch **only** the template for that issue type (Story, Task, or Bug).
- If the issue type is Bug, also fetch the Quality Management Playbook.
- If the issue type changed during Step 1 (mismatch detected), fetch the template for the recommended type.

Carry forward: **template_structure**, **playbook_reference** (if fetched).

### Step 3 — Normalise the input
**Read:** `skills/normalize-issue-context.md`

Transform the raw input into the canonical schema. This ensures all downstream skills work with the same structure regardless of whether the input was an idea, draft, or Jira issue.

Carry forward: **canonical_issue** (all fields populated or marked `[MISSING]`).

### Step 4 — Ask clarification questions
**Read:** `skills/ask-clarification-questions.md`

Review the canonical issue for gaps. Ask the user targeted questions about:
- The problem and user need
- Scope boundaries (what is in/out)
- Any `[MISSING]` fields that would significantly impact draft quality

**⏸️ PAUSE HERE.** Present questions to the user and wait for answers.

If the input is already rich enough (well-structured Jira issue, detailed draft), the skill may determine that no questions are needed — proceed directly to Step 5.

After receiving answers, update the canonical issue with the user's responses. Carry forward: **enriched canonical_issue**.

### Step 5 — Produce the draft
**Read:** `skills/produce-issue-draft.md`

Using the enriched canonical issue and template structure, produce a complete issue draft. All template sections must be visible. This should look like the final version.

Carry forward: **issue_draft**.

### Step 6 — Run validations (Parallel)
Run the applicable validation skills based on the issue type **in parallel** using background agents. All agents operate on the same canonical issue and enriched_canonical_issue.

**For Stories:** Launch 6 background agents in parallel:
1. `skills/validate-problem-framing.md` → agent "val-problem-framing"
2. `skills/validate-scope.md` → agent "val-scope"
3. `skills/validate-ac-quality.md` → agent "val-ac-quality"
4. `skills/validate-ac-uiux-trap.md` → agent "val-ac-uiux"
5. `skills/validate-completeness.md` → agent "val-completeness"
6. `skills/validate-persona.md` → agent "val-persona"

**For Tasks:** Launch 3 background agents in parallel:
1. `skills/validate-scope.md` → agent "val-scope"
2. `skills/validate-ac-quality.md` → agent "val-ac-quality"
3. `skills/validate-completeness.md` → agent "val-completeness"

**For Bugs:** Launch 6 background agents in parallel (same as Stories).

**How to dispatch:**

For each applicable skill:
```
Launch background agent with:
  - name: "val-{skill-name}"
  - agent_type: "general-purpose"
  - mode: "background"
  - prompt: Include the skill file content, enriched_canonical_issue, and issue_type
  - Record the agent_id returned
```

After all agents are launched, wait for all to complete using `read_agent` with `wait: true` on each. Collect results in the order they complete.

**Combine findings:**

From all returned results, extract the `finding` and `severity` fields. Merge into a single **validation_findings** list, preserving severity levels and the order findings were discovered.

Example merged output:
```
validation_findings = [
  { skill: "validate-problem-framing", finding: "...", severity: "critical" },
  { skill: "validate-scope", finding: "...", severity: "critical" },
  { skill: "validate-ac-quality", finding: "...", severity: "medium" },
  { skill: "validate-persona", finding: null, severity: null }  # passed
]
```

Filter out findings where `finding == null` before proceeding to Step 7.

Carry forward: **validation_findings** (combined from all checks that ran, sorted by severity).

### Step 7 — Revise the draft
**Read:** `skills/revise-draft-from-findings.md`

Apply fixable findings to the draft (rewrite bad ACs, fix formatting, strengthen weak problem statements). Leave unfixable findings for follow-up questions.

Carry forward: **revised_draft**, **unresolved_findings**.

### Step 8 — Generate follow-up questions
**Read:** `skills/generate-follow-up-questions.md`

From the unresolved findings, produce a targeted list of follow-up questions.

---

## Output

Present to the user:

1. **The revised issue draft** — Complete, all sections visible, revision notes inline where changes were made.

2. **Validation findings** (failing/weak checks only) — For each finding, briefly explain why it is a problem and how to think about fixing it. Do not show passing checks.

3. **Follow-up questions available** — Mention at the end: _"I have [N] follow-up questions that would strengthen this issue. Ask me for them when you're ready."_ Deliver them separately if the user asks.

Refer to `config/output-preferences.md` for output style rules.
