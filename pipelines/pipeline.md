# BA Operating System — Pipelines

This file defines the available pipelines. A pipeline chains multiple workflows into a single end-to-end execution. When asked to run a pipeline, read the relevant section, execute each stage in sequence, and pause at any defined human review gate before continuing.

---

## Available pipelines

| Pipeline                                  | Entry point                    | Workflows chained     | Best for                                                            |
| ----------------------------------------- | ------------------------------ | --------------------- | ------------------------------------------------------------------- |
| [Full pipeline](#full-pipeline)           | Raw meeting transcript         | W01 → W02 → W03 → W04 | Post-meeting, full cycle from transcript to refinement-ready issues |
| [Craft pipeline](#craft-pipeline)         | Loose idea, draft, or Jira key | W03 → W04             | Crafting and validating a single issue or small set of issues       |
| [Readiness pipeline](#readiness-pipeline) | Jira board status              | W04 only              | Pre-refinement health check with no upstream work needed            |

---

## Full pipeline

**Entry point:** A raw meeting transcript
**Goal:** Go from a stakeholder meeting to a set of issues assessed for refinement readiness
**Workflows:** W01 → W02 → W03 → W04

---

### Stage 1 — Meeting to Summary (Workflow 01)

**Input:** Raw transcript plus context fields
**Action:** Read and execute `workflows/workflow_01_meeting_to_summary.md`
**Output:** Structured meeting summary

> 🛑 **Human review gate.**
> Present the summary to the user before continuing. Ask:
> _"Please review this summary. Edit anything that is inaccurate or missing, then confirm you are ready to proceed to candidate issues."_
> Do not continue to Stage 2 until the user explicitly confirms.

---

### Stage 2 — Summary to Candidate Issues (Workflow 02)

**Input:** Confirmed summary from Stage 1
**Action:** Read and execute `workflows/workflow_02_summary_to_candidate_issues.md`
**Output:** A set of candidate issues with flags

> 🛑 **Human review gate.**
> Present the candidate issues and all flags to the user. Ask:
> _"Please review the candidate issues. Resolve any flags you can, and confirm which issues you want to take forward to the Issue Crafter. You can drop, merge, or note issues for follow-up here."_
> Do not continue to Stage 3 until the user confirms which issues to proceed with.

---

### Stage 3 — Issue Crafter (Workflow 03)

**Input:** Confirmed candidate issues from Stage 2
**Action:** For each confirmed issue, read and execute `workflows/workflow_03_issue_crafter.md` in MODE: draft
**Output:** Complete, critically reviewed issue drafts with follow-up questions

> 🛑 **Human review gate.**
> Present all crafted issues and their follow-up questions. Ask:
> _"Please review each issue and answer the follow-up questions. Once you are satisfied with an issue, confirm it is ready for the readiness review."_
> Process issues one at a time if the user prefers, or all together. Do not continue to Stage 4 until at least one issue is confirmed.

---

### Stage 4 — Refinement Readiness Review (Workflow 04)

**Input:** Confirmed issues from Stage 3
**Action:** Read and execute `workflows/workflow_04_refinement_readiness_review.md`

> ⚙️ **Note on input:** Workflow 04 normally fetches issues from Jira by status. When running as Stage 4 of this pipeline, use the confirmed issue drafts from Stage 3 as the input instead. If the issues have already been pushed to Jira, fetch them by key. If not, assess them from the draft content directly.

**Output:** Readiness report — summary table and detail per issue

> ✅ **End of pipeline.**
> Present the full readiness report. Issues marked ✅ Ready can be added to the refinement agenda. Issues marked ⚠️ or ❌ should be returned to Stage 3 with the specific findings from the report.

---

## Craft pipeline

**Entry point:** A loose idea, a draft you have written, or an existing Jira issue key
**Goal:** Shape a single issue or small set of issues into refinement-ready quality
**Workflows:** W03 → W04

---

### Stage 1 — Issue Crafter (Workflow 03)

**Input:** One of the following:

- A loose idea described in free text → use MODE: idea
- A draft issue pasted directly → use MODE: draft
- A Jira issue key → use MODE: jira (fetch via MCP)

**Action:** Read and execute `workflows/workflow_03_issue_crafter.md`
**Output:** Complete, critically reviewed issue draft with follow-up questions

> 🛑 **Human review gate.**
> Present the crafted issue and follow-up questions. Ask:
> _"Please answer the follow-up questions and confirm when you are happy with the issue."_
> Iterate on the issue until the user confirms it is ready. Re-run Stage 1 as many times as needed.

---

### Stage 2 — Refinement Readiness Review (Workflow 04)

**Input:** Confirmed issue draft(s) from Stage 1
**Action:** Read and execute `workflows/workflow_04_refinement_readiness_review.md`

> ⚙️ **Note on input:** Assess from the confirmed draft content directly, or fetch from Jira by key if the issue has already been pushed.

**Output:** Readiness report for the crafted issue(s)

> ✅ **End of pipeline.**
> Issues marked ✅ Ready are done. Issues marked ⚠️ or ❌ return to Stage 1 with the specific findings.

---

## Readiness pipeline

**Entry point:** Jira board — issues in eligible status columns
**Goal:** Pre-refinement health check on everything currently in scope
**Workflows:** W04 only

**Fixed parameters:** Projects [BAIKAL, DOURO] • Statuses [Analysis Review, In Refinement] — these are hardcoded in Workflow 04. If you need to scan different projects or statuses, customize Workflow 04 or use the Craft pipeline instead.

---

### Stage 1 — Refinement Readiness Review (Workflow 04)

**Input:** None — all parameters are hardcoded in Workflow 04
**Action:** Read and execute `workflows/workflow_04_refinement_readiness_review.md`
**Output:** Full readiness report — summary table and detail per issue

> ✅ **End of pipeline.**
> Present the report. ✅ Ready issues go to the refinement agenda. ⚠️ and ❌ issues return to the Craft pipeline for rework.

---
