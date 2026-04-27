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

---

### 🎯 Problem framing

The most critical category. The issue is solution-framed, the user need is unclear, or the problem statement is missing entirely. Everything else in the issue depends on this being right.

**Critical blocker:** Yes — automatically sets the issue to ❌ Not Ready.

Triggers when:

- The problem statement describes a feature or solution rather than a user need
- The problem statement is absent or too vague to be actionable
- The "so that" clause in the story describes a feature delivery rather than a user outcome

---

### 📐 Scope

The issue covers more than one distinct user need or outcome. A refinement session on an oversized issue goes in circles because the team cannot agree on boundaries.

**Critical blocker:** Yes — automatically sets the issue to ❌ Not Ready.

Triggers when:

- Two clearly distinct user outcomes are present in one issue
- Acceptance criteria scenarios cover fundamentally different user journeys or contexts
- Splitting the issue would produce two independently deliverable and testable stories

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

Required fields are empty, contain placeholders, or have unresolved `[INFERRED]` labels that have not been confirmed.

**Critical blocker:** Yes if required fields are missing. ⚠️ Needs Minor Work if fields are present but thin.

Triggers when:

- Any required template field is empty or contains a placeholder
- `[INFERRED]` labels are present and unconfirmed
- The description lacks enough context for engineering to understand the need

---

### 👤 Persona gap _(observational only)_

The affected user is generic or unstated. In this context, this is a low-signal check because the application has a limited, well-known user base and engineering already knows who they are building for.

**Critical blocker:** No — this category never affects the readiness tier. It is recorded for visibility only and will be reassessed after real usage to determine whether it continues to provide value.

Triggers when:

- The persona is entirely absent
- The story uses a completely generic label with no contextual qualifier

---

## YOUR TASK

### Output 1 — Summary table

Produce a table with one row per issue assessed. Columns:

| Issue Key | Title   | Type               | Readiness    | Failure categories                                    |
| --------- | ------- | ------------------ | ------------ | ----------------------------------------------------- |
| [key]     | [title] | Story / Task / Bug | ✅ / ⚠️ / ❌ | [list applicable category icons and names, or "None"] |

Sort the table: Ready first, then Needs Minor Work, then Not Ready.

After the table, provide:

- Total issues assessed and breakdown by readiness tier
- Failure category frequency: which categories appear most often across the batch — this is where systemic patterns surface
- One honest sentence on the overall health of the batch

---

### Output 2 — Detail per issue

For each issue, produce a detailed assessment using the following structure:

---

**[ISSUE KEY] — [Title]**
**Type:** Story / Task / Bug
**Readiness:** ✅ Ready / ⚠️ Needs Minor Work / ❌ Not Ready

**Check results:**

| Category           | Result                             | Finding                                                    |
| ------------------ | ---------------------------------- | ---------------------------------------------------------- |
| 🎯 Problem framing | ✅ Pass / ⚠️ Weak / ❌ Fail        | [brief finding]                                            |
| 📐 Scope           | ✅ Pass / ⚠️ Flag / ❌ Fail        | [brief finding]                                            |
| ✅ AC — quality    | ✅ Pass / ⚠️ Weak / ❌ Fail        | [brief finding]                                            |
| 🖥️ AC — UI/UX trap | ✅ Pass / ⚠️ Design debt / ❌ Fail | [brief finding]                                            |
| 📋 Completeness    | ✅ Pass / ⚠️ Weak / ❌ Fail        | [brief finding]                                            |
| 👤 Persona gap     | ✅ / ⚠️ Note                       | [brief finding — observational only, does not affect tier] |

**What needs to change before refinement:**
A numbered list of specific, actionable items — one per failing or weak check, excluding persona gap. Each item must say exactly what needs to be fixed, not just that something is wrong. If the issue is Ready, write "None — this issue is ready to present."

---

## TONE AND APPROACH

- This is a final gate, not a coaching session. Be direct and unambiguous about what is and is not ready.
- Do not upgrade an issue's readiness tier to soften the assessment. If it is Not Ready, say so.
- Focus findings on what would actually cause problems in a refinement session — not every minor observation.
- The report is for you to act on, not to share with stakeholders. Write for a BA who wants the truth, not reassurance.
