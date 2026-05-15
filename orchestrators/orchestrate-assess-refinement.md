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
Step 2: read templates + config (cache — instant)
    ↓
Step 3: extract issue types from Jira data (deterministic — no LLM)
    ↓
Step 4: assess each issue (PARALLEL — targeted validators per type)
    ├─ Issue 1 (Story): 9 validators
    ├─ Issue 2 (Task):  4 validators
    ├─ Issue N (Bug):   8 validators
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

Extract from fetch result `data.issues` and carry forward: **issues** (list of all fetched), **fetch_metadata**.

No issues found: report and stop.

### Step 2 — Read templates and config files from cache
**Read:** `skills/fetch-required-templates/SKILL.md`

Read all templates from local cache at `.cache/templates/` **and** the config files validators reference. These are local file reads — zero MCP calls, zero wait. The read-through cache auto-populates templates from MCP on first run.

Templates (all four read upfront):
- `.cache/templates/story.md`
- `.cache/templates/task.md`
- `.cache/templates/bug.md`
- `.cache/templates/playbook.md`

Config files (read once, embedded in every composite agent prompt):
- `config/quality-standards.md` — referenced by most validators
- `config/personas.md` — referenced by validate-persona

If cache is empty (fresh checkout), `fetch-required-templates` auto-fetches via MCP and populates the cache. This is a one-time cost per environment — subsequent runs read locally.

Extract from fetch result `data.templates` and carry forward: **templates** (map of type → template structure), **playbook_reference** (if available), **config_content** (inline text of quality-standards.md and personas.md).

### Step 3 — Extract issue types from Jira data (deterministic)
For each fetched issue, read `fields.issuetype.name` from the Jira response. No LLM call — this is a deterministic field access. Use the Jira-declared type to determine which validators to include for each issue.

Map to issue type: Story, Task, or Bug. Unknown type: default to Story.

Build an **issue_type_map** (issue key → declared type). Carry this forward so each composite agent receives validators matching its declared type.

Carry forward: **issue_type_map** (map of issue key → declared type).

### Step 4 — Assess each issue (Parallel — targeted per type)
For each issue, launch **one-shot composite agent** that classifies, normalizes, and validates in a single pass. Each agent receives **only the validators applicable to its declared type** (from Step 3) — not all 9. This reduces prompt size per agent by 30-55% depending on type.

**Build per-type prompt sets** using validators from [`orchestrators/reference-validation-dispatch.md`](reference-validation-dispatch.md):

| Declared type | Validators to include | Templates to include |
|---|---|---|
| Story | all 9 validators | story.md only |
| Bug | all 8 validators (excl. design-reference) | bug.md + playbook.md |
| Task | scope, ac-quality, completeness, dependencies | task.md only |

```
Launch background agent with:
  - name: "assess-issue-{issue_key}"
  - agent_type: "general-purpose"
  - mode: "background"
  - prompt: [
      Include:
      - skills/analyze-input-type/SKILL.md
      - skills/normalize-issue-context/SKILL.md
      - issue_content
      - canonical issue schema
      - template structure (only the one matching declared type, plus playbook if Bug)
      - validation skills (only those applicable to declared type)
      - [EMBEDDED CONFIG: config/quality-standards.md]
        (content of config/quality-standards.md goes here)
      - [EMBEDDED CONFIG: config/personas.md]
        (content of config/personas.md goes here)
      
      Note: Config content is above. Skills may say "Read config/...md" — skip that instruction, use the embedded content.
      
      Task: 
        1. Classify issue type (Story/Task/Bug) — flag if different from declared type
        2. Normalize into canonical schema
        3. Run all applicable validators below
        4. If type mismatch detected and some validators weren't loaded for the correct type, flag which checks are missing and recommend re-assessment
        5. Return combined findings with issue_type
    ]
  - Record the agent_id returned
```

**Type mismatch handling:** The agent may determine a different type than Jira declared. It should flag the mismatch and note any validators that were missing because the prompt was built for the declared type. This is an edge case — most Jira types are correct.

**Wait for all issue agents:**

After all launched: wait using `read_agent` with `wait: true` on each.

**Combine all assessments:** Merge all returned validation_findings into **assessments** list (map of issue key → type + validation findings).

Carry forward: **assessments** (issue key + issue type + validation findings for all issues).

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
