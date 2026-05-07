---
name: orchestrate-assess-refinement
description: Assess all issues from configured columns for refinement readiness in batch. Use when user says /assess-refinement or wants a pre-refinement health check.
---

# Orchestrator: Assess Refinement Readiness

**Purpose:** Assess all issues from configured Jira project columns for refinement readiness. Produces summary table of all issues and detailed breakdowns for those not ready.

**Entry point:** `/assess-refinement`

**Replaces:** Workflow 04 — Refinement Readiness Review

---

## When to use

- Before refinement session — honest picture of what's ready and what's not
- After batch of issues crafted — verify they meet readiness standard
- Regular backlog pipeline health check

---

## Flow

```
Step 1: fetch-issues-by-status
    ↓
Step 2: classify all issues (PARALLEL)
    ├─ analyze-input-type for issue 1
    ├─ analyze-input-type for issue 2
    ├─ analyze-input-type for issue N
    ↓ (wait for all to complete)
Step 3: fetch templates ONCE per unique type (+ playbook if any bugs)
    ↓
Step 4: for each issue, run normalize + validations (PARALLEL)
    ├─ Issue 1: normalize → validate (6 validators in parallel)
    ├─ Issue 2: normalize → validate (6 validators in parallel)
    ├─ Issue N: normalize → validate (3 validators in parallel)
    ↓ (wait for all to complete)
Step 5: format-readiness-report (batch mode)
    ↓
OUTPUT: Summary table + detailed breakdowns for failures
```

---

## Detailed Steps

### Step 1 — Fetch all eligible issues
**Read:** `skills/fetch-issues-by-status/SKILL.md`

Fetch all issues from projects and statuses in `config/project.md`. Uses default refinement assessment columns.

Carry forward: **issues** (list of all fetched), **fetch_summary**.

No issues found: report and stop.

### Step 2 — Classify all issues first (Parallel)
**Read:** `skills/analyze-input-type/SKILL.md`

Before fetching templates, determine issue type for every fetched issue. **Launch all classifications in parallel as background agents:**

For each issue:
```
Launch background agent with:
  - name: "analyze-issue-{issue_key}"
  - agent_type: "general-purpose"
  - mode: "background"
  - prompt: [include skill content + issue content]
  - Record the agent_id returned
```

After all agents launched: wait for all using `read_agent` with `wait: true` on each.

**Combine results:** Merge all returned issue types into **issue_types** map (issue key → determined type).

Carry forward: **issue_types** (map of issue key → determined type).

### Step 3 — Fetch templates (deduplicated)
**Read:** `skills/fetch-required-templates/SKILL.md`

**Token optimisation:** Identify unique issue types in batch. Fetch each template **once** — not once per issue.

- Any Bug: fetch Quality Management Playbook once.
- All Stories: fetch only Story template.
- Stories + Tasks: fetch both — once each.

Carry forward: **templates** (map of issue type → template structure), **playbook_reference** (if fetched).

### Step 4 — Assess each issue (Parallel per issue)
For each issue, launch **composite agent task** running normalize + applicable validations in one shot:

```
Launch background agent with:
  - name: "assess-issue-{issue_key}"
  - agent_type: "general-purpose"
  - mode: "background"
  - prompt: [
      Include:
      - skills/normalize-issue-context/SKILL.md
      - applicable validation skills (based on issue_type from Step 2)
      - issue_content
      - canonical issue schema
      - template_structure for this issue type
      
      Task: Normalize, then run all applicable validations, return combined findings
    ]
  - Record the agent_id returned
```

**Validation logic per issue type:** See [`orchestrators/REFERENCE-validation-dispatch.md`](REFERENCE-validation-dispatch.md).

**Wait for all issue agents:**

After all launched: wait using `read_agent` with `wait: true` on each.

**Combine all assessments:** Merge all returned validation_findings into **assessments** list (map of issue key → validation findings).

Carry forward: **assessments** (issue key + validation findings for all issues).

### Step 5 — Format the batch report
**Read:** `skills/format-readiness-report/SKILL.md`

Generate readiness report in **batch mode**:

1. **Summary table** — One row per issue: key, title, type, readiness tier, failure categories. All issues shown (including ✅ Ready). Sorted: Ready first, then Needs Minor Work, then Not Ready.
2. **Detailed breakdowns** — ⚠️ and ❌ issues only. Each includes check results table and actionable items.

---

## Output

1. **Summary table** — Quick overview of all issues and readiness
2. **Detailed assessments** — Non-ready issues only, with specific findings and what needs to change

Refer to `config/output-preferences.md` for output style rules.

---

## Tone and approach

- Final gate, not coaching session. Direct, unambiguous.
- Don't upgrade readiness tiers to soften assessment. Not Ready = say so.
- Focus findings on what would cause problems in refinement session.
- Report for BA to act on — write for someone who wants truth, not reassurance.
