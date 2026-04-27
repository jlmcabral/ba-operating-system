# Workflow 04 — Refinement Readiness Review

**Purpose:** Assess a batch of Jira issues against a strict readiness standard and produce a categorised report — combining a readiness tier with specific failure categories — so you know exactly what can go to refinement, what is blocked, and what type of problem is blocking it.

**When to use:** Before every business refinement session. Run this against all issues in your eligible status columns to get an honest picture of what is actually ready to present to the team.

**Input:** Issues fetched automatically from Jira via MCP, filtered by status.
**Output:** A summary table across all issues, followed by a detailed breakdown per issue.

---

## The Prompt

---

## BEFORE YOU BEGIN — Fetch templates, documentation, and issues

**Step A — Fetch quality references**

Use the Atlassian MCP server to fetch the following issue templates:

- Story template: BAIKAL-1164
- Task template: BAIKAL-1544
- Bug template: BAIKAL-1390

Use the Confluence MCP server to fetch:

- Page ID: 1922147829 (Quality Management Playbook)

Store these as your quality baseline. You will use them to assess whether each issue is correctly structured and complete.

**Step B — Fetch issues by status**

Use the Atlassian MCP server to fetch all issues from the following projects and status columns:

- Projects: [BAIKAL, DOURO]
- Eligible statuses: ["Analysis Review", "In Refinement"]

Fetch the full content of each issue — all fields, description, and acceptance criteria.

Do not proceed until all fetches are complete. If any fetch fails, report which one and why before continuing.

---

## READINESS TIERS

Readiness answers one question: can this issue go to refinement without derailing the session?

**✅ Ready**
All critical checks pass. The issue can be presented to the team as-is.

**⚠️ Needs Minor Work**
One or two non-critical issues are present that can be resolved quickly before the session. No critical blockers.

**❌ Not Ready**
One or more critical blockers are present. Presenting this issue in refinement would waste the team's time.

---

## FAILURE CATEGORIES

Failure categories answer a different question: what type of problem does this issue have? They are independent of the readiness tier — an issue can have multiple categories flagged, and the combination determines the tier.

There are six categories. Five are active quality signals. One is observational only.

**Note on issue type applicability:** Not all categories apply to all issue types. See the table at the end of this section.

---

### 🎯 Problem framing

The most critical category. The issue is solution-framed, the user need is unclear, or the problem statement is missing entirely. Everything else in the issue depends on this being right.

**Critical blocker:** Yes — automatically sets the issue to ❌ Not Ready.

**Applies to:** Stories, Bugs (all user-facing issue types)

**Does not apply to:** Tasks (technical work is not grounded in user needs; scope and completion criteria are the primary signals)

Triggers when:

- The problem statement describes a feature or solution rather than a user need
- The problem statement is absent or too vague to be actionable
- The "so that" clause in the story describes a feature delivery rather than a user outcome

---

### 📐 Scope

The issue covers more than one distinct outcome or concern. For Stories, this means two clearly distinct user needs or outcomes. For Tasks, this means work that could reasonably be split into separate, independently deliverable pieces.

**Critical blocker:** Yes — automatically sets the issue to ❌ Not Ready.

**Applies to:** Stories, Tasks, Bugs

Triggers when:

- (Stories, Bugs) Two clearly distinct user outcomes are present in one issue
- (Stories, Bugs) Acceptance criteria scenarios cover fundamentally different user journeys or contexts
- (All types) Splitting the issue would produce two independently deliverable and testable units

---

### ✅ Acceptance criteria — quality

Criteria are untestable, ambiguous, or missing important scenarios that a tester would need to verify the story is done.

**Critical blocker:** Yes if the majority of criteria fail. ⚠️ Needs Minor Work if one or two criteria are weak but the rest are solid.

Triggers when:

- A criterion cannot be verified as pass/fail
- A criterion is so vague it could be interpreted multiple ways
- Key scenarios are missing that any reasonable tester would expect

---

### 🖥️ Acceptance criteria — UI/UX trap

Criteria describe interface behaviour instead of user outcomes. Distinct from quality because the fix is not about writing more — it is about reframing what is already there.

**Critical blocker:** Yes if the majority of criteria are UI/UX focused. ⚠️ Needs Minor Work if one or two criteria carry a design debt marker but the rest are outcome-focused.

Triggers when:

- Criteria describe visual states, component behaviour, or layout rather than what must be true for the user
- Design debt markers are present from Workflow 03 that have not been resolved

---

### 📋 Completeness

Required fields are empty, contain placeholders, or have unresolved `[INFERRED]` labels that have not been confirmed. **Note:** The technical approach is expected to be sparse or empty at this stage — the development team will define it during refinement and sprint planning. Do not flag incomplete technical approach as a readiness issue.

**Critical blocker:** Yes if required fields are missing. ⚠️ Needs Minor Work if fields are present but thin.

Triggers when:

- Any required template field (problem statement, acceptance criteria, context) is empty or contains a placeholder
- `[INFERRED]` labels are present and unconfirmed
- The description lacks enough context for engineering to understand the need
- Technical approach is sparse or absent — this is **not** a trigger; it is expected

---

### 👤 Persona gap _(observational only)_

The affected user is generic or unstated. In this context, this is a low-signal check because the application has a limited, well-known user base and engineering already knows who they are building for.

**Critical blocker:** No — this category never affects the readiness tier. It is recorded for visibility only and will be reassessed after real usage to determine whether it continues to provide value.

**Applies to:** Stories, Bugs

**Does not apply to:** Tasks

Triggers when:

- The persona is entirely absent
- The story uses a completely generic label with no contextual qualifier

---

## CATEGORY APPLICABILITY BY ISSUE TYPE

| Category | Story | Task | Bug |
|----------|-------|------|-----|
| 🎯 Problem framing | ✅ Applies | ❌ N/A | ✅ Applies |
| 📐 Scope | ✅ Applies | ✅ Applies | ✅ Applies |
| ✅ AC — quality | ✅ Applies | ✅ Applies | ✅ Applies |
| 🖥️ AC — UI/UX trap | ✅ Applies | ❌ N/A (tasks are technical) | ✅ Applies |
| 📋 Completeness | ✅ Applies | ✅ Applies | ✅ Applies |
| 👤 Persona gap | ✅ Observational | ❌ N/A | ✅ Observational |

**Assessment rule:** When an issue type does not apply to a category, do not flag that category. For Tasks, skip Problem framing and Persona gap checks entirely. For Tasks, do not flag the UI/UX trap category — technical work is not expected to include UI/UX considerations.

---

## YOUR TASK

### Step 1 — Determine issue type

For each issue, identify its type: Story, Task, or Bug. Use this to apply only the applicable failure categories.

### Output 1 — Summary table

Produce a table with one row per issue assessed. Columns:

| Issue Key                               | Title   | Type               | Readiness    | Failure categories                                    |
| --------------------------------------- | ------- | ------------------ | ------------ | ----------------------------------------------------- |
| [[key](https://jira.int.kn/browse/KEY)] | [title] | Story / Task / Bug | ✅ / ⚠️ / ❌ | [list applicable category icons and names, or "None"] |

Sort the table: Ready first, then Needs Minor Work, then Not Ready.

**Type-specific guidance:**
- For **Stories and Bugs:** Check all six categories (with persona gap as observational).
- For **Tasks:** Check only Scope, AC — quality, and Completeness. Omit Problem framing, UI/UX trap, and Persona gap.

---

### Output 2 — Detailed assessment (issues not ready only)

**For each issue marked ⚠️ or ❌ only,** produce a detailed assessment using the following structure. **Do not include detailed assessments for ✅ Ready issues.**

Only include rows in the results table for categories that apply to the issue type.

---

**[[ISSUE KEY](https://jira.int.kn/browse/ISSUE-KEY)] — [Title]**
**Type:** Story / Task / Bug
**Readiness:** ⚠️ Needs Minor Work / ❌ Not Ready
**Reporter:** [reporter name]

**Check results:**

| Category           | Result                   | Finding                                                    |
| ------------------ | ------------------------ | ---------------------------------------------------------- |
| [applicable categories only] | ⚠️ / ❌ | [brief finding]                                            |

**What needs to change before refinement:**
A numbered list of specific, actionable items — one per failing or weak check, excluding persona gap.

---

## TONE AND APPROACH

- This is a final gate, not a coaching session. Be direct and unambiguous about what is and is not ready.
- Do not upgrade an issue's readiness tier to soften the assessment. If it is Not Ready, say so.
- Focus findings on what would actually cause problems in a refinement session — not every minor observation.
- The report is for you to act on, not to share with stakeholders. Write for a BA who wants the truth, not reassurance.
