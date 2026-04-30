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
**Read:** `skills/fetch-issue-by-key.md`

Fetch the Jira issue using the provided key. If the fetch fails, report the failure and stop.

Carry forward: **issue_content**, **issue_type** (as declared in Jira).

### Step 2 — Analyse the issue type
**Read:** `skills/analyze-input-type.md`

Confirm the issue type. If the Jira-declared type appears incorrect, note the mismatch in the report.

Carry forward: **issue_type** (confirmed or recommended), **type_mismatch** (if any).

### Step 3 — Fetch the right template
**Read:** `skills/fetch-required-templates.md`

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
**Read:** `skills/normalize-issue-context.md`

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
Run the applicable validation skills based on the issue type **in parallel** using background agents (same pattern as `/craft` Step 6).

**For Stories and Bugs:**
1. `skills/validate-problem-framing.md` → agent "val-problem-framing"
2. `skills/validate-scope.md` → agent "val-scope"
3. `skills/validate-ac-quality.md` → agent "val-ac-quality"
4. `skills/validate-ac-uiux-trap.md` → agent "val-ac-uiux"
5. `skills/validate-completeness.md` → agent "val-completeness"
6. `skills/validate-persona.md` → agent "val-persona"

**For Tasks:**
1. `skills/validate-scope.md` → agent "val-scope"
2. `skills/validate-ac-quality.md` → agent "val-ac-quality"
3. `skills/validate-completeness.md` → agent "val-completeness"

**How to dispatch:**

For each applicable skill, launch as a background agent (see `/craft` Step 6 for dispatch template). Record all agent_ids.

After all agents are launched, wait for all to complete using `read_agent` with `wait: true` on each.

**Combine findings:**

From all returned results, extract the `finding` and `severity` fields. Merge into a single **validation_findings** list. Filter out findings where `finding == null` before proceeding to Step 6.

Carry forward: **validation_findings** (combined from all checks that ran, sorted by severity).

### Step 6 — Format the report
**Read:** `skills/format-readiness-report.md`

Generate the readiness report in **single mode** — detailed assessment with all fields visible.

---

## Output

A detailed readiness report for the single issue, including:
- Readiness tier (✅ Ready / ⚠️ Needs Minor Work / ❌ Not Ready)
- Check results table (applicable categories only, with findings)
- What needs to change before refinement (numbered, actionable list)
- Type mismatch note (if the Jira type appears incorrect)

Refer to `config/output-preferences.md` for output style rules.
