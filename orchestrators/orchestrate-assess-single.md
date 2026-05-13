---
name: orchestrate-assess-single
description: Assess one Jira issue for refinement readiness with detailed findings. Use when user says /assess with a single Jira key.
---

# Orchestrator: Assess Single Issue

**Purpose:** Assess one Jira issue for refinement readiness. No other issues fetched. Produces detailed readiness report for that issue only.

**Entry point:** `/assess [jira-key]`

**Replaces:** Part of Workflow 04 (single-issue use case)

---

## When to use

- Check if specific issue is ready for refinement
- Don't want to assess entire board — just one issue
- Quick readiness check after crafting or updating an issue

---

## Flow

```
Step 1: fetch-issue-by-key
    ↓
Step 2: analyze-input-type
    ↓
Step 3-5: Run in parallel
    ├─ fetch-required-templates
    └─ normalize-issue-context
    ↓ (wait for both to complete)
Step 6: run validation skills (PARALLEL)
    ├─ validate-problem-framing (if Story/Bug)
    ├─ validate-scope
    ├─ validate-ac-quality
    ├─ validate-ac-uiux-trap (if Story/Bug)
    ├─ validate-completeness
    └─ validate-persona (if Story/Bug)
    ↓ (wait for all to complete)
Step 7: format-readiness-report (single mode)
    ↓
OUTPUT: Detailed readiness report
```

---

## Detailed Steps

### Step 1 — Fetch the issue
**Read:** `skills/fetch-issue-by-key/SKILL.md`

Fetch Jira issue using provided key. Fetch fails: report failure and stop.

Carry forward: **issue_content**, **issue_type** (as declared in Jira).

### Step 2 — Analyse the issue type
**Read:** `skills/analyze-input-type/SKILL.md`

Confirm issue type. Jira-declared type appears incorrect: note mismatch in report.

Carry forward: **issue_type** (confirmed or recommended), **type_mismatch** (if any).

### Step 3 — Fetch the right template
**Read:** `skills/fetch-required-templates/SKILL.md`
**Read also:** [`orchestrators/reference-agent-dispatch.md`](reference-agent-dispatch.md) — general dispatch rules for Steps 3+4.

Fetch only template for determined issue type. Bug: also fetch Quality Management Playbook.

**Launch as background agent** (parallel with Step 4):
```
Launch background agent with:
  - name: "fetch-template"
  - agent_type: "general-purpose"
  - mode: "background"
  - prompt: [include skill content + issue_type]
  - Record the agent_id returned
```

Carry forward: **template_structure**, **playbook_reference** (if fetched).

### Step 4 — Normalise the issue
**Read:** `skills/normalize-issue-context/SKILL.md`

Transform fetched issue into canonical schema.

**Launch as background agent** (parallel with Step 3):
```
Launch background agent with:
  - name: "normalize-issue"
  - agent_type: "general-purpose"
  - mode: "background"
  - prompt: [include skill content + issue_content + issue_type]
  - Record the agent_id returned
```

**Wait for both agents:**

After Step 3 and Step 4 agents complete (use `read_agent` with `wait: true` on each), proceed to Step 5.

Carry forward: **canonical_issue**, **template_structure**, **playbook_reference**.

### Step 5 — Run validations (Parallel)

**Read:** [`orchestrators/reference-validation-dispatch.md`](reference-validation-dispatch.md) + [`orchestrators/reference-agent-dispatch.md`](reference-agent-dispatch.md)

Run applicable validation skills based on issue type **in parallel** using standard dispatch pattern.

**Input to dispatch:** canonical_issue, issue_type, template_structure.

Carry forward: **validation_findings** (combined from all checks, sorted by severity).

### Step 6 — Format the report
**Read:** `skills/format-readiness-report/SKILL.md`

Generate readiness report in **single mode** — detailed assessment, all fields visible.

---

## Output

Detailed readiness report for single issue:
- Readiness tier (✅ Ready / ⚠️ Needs Minor Work / ❌ Not Ready)
- Check results table (applicable categories only, with findings)
- What needs to change before refinement (numbered, actionable list)
- Type mismatch note (if Jira type appears incorrect)

Refer to `config/output-preferences.md` for output style rules.
