---
name: orchestrate-assess-single
description: Assess one Jira issue for refinement readiness with detailed findings. Use when user says /assess with a single Jira key.
---

# Orchestrator: Assess Single Issue

**Purpose:** Assess one Jira issue for refinement readiness without fetching other issues. Produces a detailed readiness report for that issue only.

**Entry point:** `/assess [jira-key]`

**Replaces:** Part of Workflow 04 (single-issue use case — previously not available)

---

## When to use

- You want to check if a specific issue is ready for refinement
- You do not want to assess the entire board — just one issue
- You want a quick readiness check after crafting or updating an issue

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

Fetch the Jira issue using the provided key. If the fetch fails, report the failure and stop.

Carry forward: **issue_content**, **issue_type** (as declared in Jira).

### Step 2 — Analyse the issue type
**Read:** `skills/analyze-input-type/SKILL.md`

Confirm the issue type. If the Jira-declared type appears incorrect, note the mismatch in the report.

Carry forward: **issue_type** (confirmed or recommended), **type_mismatch** (if any).

### Step 3 — Fetch the right template
**Read:** `skills/fetch-required-templates/SKILL.md`

Fetch only the template for the determined issue type. If Bug, also fetch the Quality Management Playbook.

**Launch as a background agent** (parallel with Step 4):
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

Transform the fetched issue into the canonical schema.

**Launch as a background agent** (parallel with Step 3):
```
Launch background agent with:
  - name: "normalize-issue"
  - agent_type: "general-purpose"
  - mode: "background"
  - prompt: [include skill content + issue_content + issue_type]
  - Record the agent_id returned
```

**Wait for both agents to complete:**

After both Step 3 and Step 4 agents complete (use `read_agent` with `wait: true` on each), proceed to Step 5.

Carry forward: **canonical_issue**, **template_structure**, **playbook_reference**.

### Step 5 — Run validations (Parallel)

**Read:** [`orchestrators/REFERENCE-validation-dispatch.md`](REFERENCE-validation-dispatch.md)

Run the applicable validation skills based on the issue type **in parallel** using the standard dispatch pattern.

**Input to dispatch:** canonical_issue, issue_type, template_structure.

Carry forward: **validation_findings** (combined from all checks that ran, sorted by severity).

### Step 6 — Format the report
**Read:** `skills/format-readiness-report/SKILL.md`

Generate the readiness report in **single mode** — detailed assessment with all fields visible.

---

## Output

A detailed readiness report for the single issue, including:
- Readiness tier (✅ Ready / ⚠️ Needs Minor Work / ❌ Not Ready)
- Check results table (applicable categories only, with findings)
- What needs to change before refinement (numbered, actionable list)
- Type mismatch note (if the Jira type appears incorrect)

Refer to `config/output-preferences.md` for output style rules.
