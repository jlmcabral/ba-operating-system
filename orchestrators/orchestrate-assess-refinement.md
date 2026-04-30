# Orchestrator: Assess Refinement Readiness

**Purpose:** Assess all issues from configured Jira project columns for refinement readiness. Produces a summary table of all issues and detailed breakdowns for those that are not ready.

**Entry point:** `/assess-refinement`

**Replaces:** Workflow 04 — Refinement Readiness Review

---

## When to use

- Before a refinement session — run this to get an honest picture of what is ready and what is not
- After a batch of issues have been crafted — verify they meet the readiness standard
- Regularly, as a health check on your backlog pipeline

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
**Read:** `skills/fetch-issues-by-status.md`

Fetch all issues from the projects and statuses configured in `config/project.md`. This uses the default refinement assessment columns.

Carry forward: **issues** (list of all fetched issues), **fetch_summary**.

If no issues are found, report this and stop.

### Step 2 — Classify all issues first (Parallel)
**Read:** `skills/analyze-input-type.md`

Before fetching any templates, determine the issue type for every fetched issue. **Launch all classifications in parallel as background agents:**

For each issue:
```
Launch background agent with:
  - name: "analyze-issue-{issue_key}"
  - agent_type: "general-purpose"
  - mode: "background"
  - prompt: [include skill content + issue content]
  - Record the agent_id returned
```

After all agents are launched, wait for all to complete using `read_agent` with `wait: true` on each.

**Combine results:**

Merge all returned issue types into **issue_types** map (issue key → determined type).

Carry forward: **issue_types** (map of issue key → determined type).

### Step 3 — Fetch templates (deduplicated)
**Read:** `skills/fetch-required-templates.md`

**Token optimisation:** Identify the unique issue types present in the batch. Fetch each template **once** — not once per issue.

- If any issue is a Bug, fetch the Quality Management Playbook once.
- If all issues are Stories, fetch only the Story template.
- If the batch contains Stories and Tasks, fetch both templates — but only once each.

Carry forward: **templates** (map of issue type → template structure), **playbook_reference** (if fetched).

### Step 4 — Assess each issue (Parallel per issue)
For each issue in the batch, create a **composite agent task** that runs normalize + applicable validations in one shot:

**For each issue, launch a background agent:**
```
Launch background agent with:
  - name: "assess-issue-{issue_key}"
  - agent_type: "general-purpose"
  - mode: "background"
  - prompt: [
      Include:
      - skills/normalize-issue-context.md
      - applicable validation skills (based on issue_type from Step 2)
      - issue_content
      - canonical issue schema
      - template_structure for this issue type
      
      Task: Normalize, then run all applicable validations, return combined findings
    ]
  - Record the agent_id returned
```

**Validation logic per issue type (same as `/craft`):**

**For Stories and Bugs (6 validators):**
- `skills/validate-problem-framing.md`
- `skills/validate-scope.md`
- `skills/validate-ac-quality.md`
- `skills/validate-ac-uiux-trap.md`
- `skills/validate-completeness.md`
- `skills/validate-persona.md`

**For Tasks (3 validators):**
- `skills/validate-scope.md`
- `skills/validate-ac-quality.md`
- `skills/validate-completeness.md`

**Wait for all issue agents to complete:**

After all issue assessment agents are launched, wait for all to complete using `read_agent` with `wait: true` on each.

**Combine all assessments:**

Merge all returned validation_findings into a single **assessments** list (map of issue key → validation findings).

Carry forward: **assessments** (list of issue key + validation findings for all issues).

### Step 5 — Format the batch report
**Read:** `skills/format-readiness-report.md`

Generate the readiness report in **batch mode**:

1. **Summary table** — One row per issue, showing key, title, type, readiness tier, and failure categories. All issues shown (including ✅ Ready). Sorted: Ready first, then Needs Minor Work, then Not Ready.

2. **Detailed breakdowns** — Only for ⚠️ and ❌ issues. Each includes check results table and actionable items.

---

## Output

1. **Summary table** — Quick overview of all issues and their readiness
2. **Detailed assessments** — For non-ready issues only, with specific findings and what needs to change

Refer to `config/output-preferences.md` for output style rules.

---

## Tone and approach

- This is a final gate, not a coaching session. Be direct and unambiguous.
- Do not upgrade readiness tiers to soften the assessment. If it is Not Ready, say so.
- Focus findings on what would actually cause problems in a refinement session.
- The report is for the BA to act on — write for someone who wants the truth, not reassurance.
