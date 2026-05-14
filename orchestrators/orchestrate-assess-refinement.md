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
Step 2: read all templates from local cache (instant — no MCP)
    ↓
Step 3: classify all issues + assess (PARALLEL — per-issue composite agents)
    ├─ Issue 1: classify → normalize → validate
    ├─ Issue 2: classify → normalize → validate
    ├─ Issue N: classify → normalize → validate
    ↓ (wait for all to complete)
Step 4: format-readiness-report (batch mode)
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

### Step 2 — Read templates from cache
**Read:** `skills/fetch-required-templates/SKILL.md`

Read all templates from local cache at `.cache/templates/`. This is a local file read — zero MCP calls, zero wait. The read-through cache auto-populates from MCP on first run (or if cache is empty).

All four files are read upfront regardless of issue types in the batch:
- `.cache/templates/story.md`
- `.cache/templates/task.md`
- `.cache/templates/bug.md`
- `.cache/templates/playbook.md`

If cache is empty (fresh checkout), `fetch-required-templates` auto-fetches via MCP and populates the cache. This is a one-time cost per environment — subsequent runs read locally.

Carry forward: **templates** (map of type → template structure), **playbook_reference** (if available).

### Step 3 — Assess each issue (Parallel composite agents)
For each issue, launch **one-shot composite agent** that classifies, normalizes, and validates in a single pass. No separate classification step — each agent handles everything for its issue.

```
Launch background agent with:
  - name: "assess-issue-{issue_key}"
  - agent_type: "general-purpose"
  - mode: "background"
  - prompt: [
      Include:
      - skills/analyze-input-type/SKILL.md
      - skills/normalize-issue-context/SKILL.md
      - applicable validation skills (based on issue type — the agent first classifies, then selects validators)
      - issue_content
      - canonical issue schema
      - all template structures (all 4 — agent selects the right one after classifying)
      
      Task: 
        1. Classify issue type (Story/Task/Bug)
        2. Normalize into canonical schema
        3. Pick the right template from pre-loaded templates
        4. Run all applicable validators
        5. Return combined findings with issue_type
    ]
  - Record the agent_id returned
```

**Validation logic per issue type:** See [`orchestrators/reference-validation-dispatch.md`](reference-validation-dispatch.md).

**Wait for all issue agents:**

After all launched: wait using `read_agent` with `wait: true` on each.

**Combine all assessments:** Merge all returned validation_findings into **assessments** list (map of issue key → type + validation findings).

Carry forward: **assessments** (issue key + issue type + validation findings for all issues).

### Step 4 — Format the batch report
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
