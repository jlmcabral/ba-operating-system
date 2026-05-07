---
name: validate-dependencies
description: Check whether the issue implicitly relies on external capabilities, decisions, or other teams that are not acknowledged. Use when validating any issue type — unacknowledged dependencies are a common cause of issues being sent back from refinement.
---

# Skill: Validate Dependencies

**Purpose:** Check whether issue implicitly depends on external capabilities, unreleased features, pending decisions, or work from other teams — and whether those dependencies are acknowledged.

**Config references:**
- None — reasons from issue context only

---

## Input

- **canonical_issue** — Normalised issue context (or draft)
- **issue_type** — Story, Task, or Bug

---

## Applicability

| Issue Type | Applies? |
|------------|----------|
| Story | ✅ Yes |
| Task | ✅ Yes |
| Bug | ✅ Yes |

---

## Instructions

1. Read full issue context: problem statement, description, acceptance criteria, scope, and related issues.

2. Look for **implicit dependencies** — things issue assumes exist or will be true, without acknowledging them:

   **External systems or APIs** — Assumes integration with external service, API, or data source? Is that integration confirmed available?

   **Unreleased or in-progress capabilities** — Depends on functionality from another team, story, or feature in development? Is dependency linked or named?

   **Pending decisions** — Assumes product, design, legal, or technical decision has been made that may not have been? Look for "once we know", "TBD", "depending on", or implicit assumptions in AC.

   **Data or state assumptions** — Assumes certain data exists, is in certain state, or has been migrated? Documented?

   **Infrastructure or environment** — Requires infrastructure, configuration, or environment changes not part of this issue?

3. For each implicit dependency, assess:
   - **Unacknowledged and potentially blocking** — not mentioned and absence could block delivery → `critical`
   - **Known but undocumented** — likely exists but not explicitly referenced → `minor`

4. Don't flag dependencies clearly resolved and evidenced in issue (e.g., linked story already done, confirmed integration already in production).

**Scope of reasoning:** Reasons from issue text only — cannot verify whether referenced system, API, or capability exists, or whether linked story is complete. Flag what issue *implies but doesn't acknowledge*. Don't assert dependency is broken — only that it's unacknowledged and should be confirmed. Phrase findings as signals to investigate, not confirmed blockers.

---

## Output

- **findings** — List of unacknowledged dependencies, each identifying dependency and explaining delivery risk. Empty if none found.
- **severity** — `critical` if any could block delivery and isn't acknowledged; `minor` if likely known/resolved
