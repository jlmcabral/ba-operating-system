---
name: validate-dependencies
description: Check whether the issue implicitly relies on external capabilities, decisions, or other teams that are not acknowledged. Use when validating any issue type — unacknowledged dependencies are a common cause of issues being sent back from refinement.
---

# Skill: Validate Dependencies

**Purpose:** Check whether the issue implicitly depends on external capabilities, unreleased features, pending decisions, or work from other teams — and whether those dependencies are acknowledged.

**Config references:**
- None — this skill reasons from issue context only

---

## Input

- **canonical_issue** — The normalised issue context (or draft)
- **issue_type** — Story, Task, or Bug

---

## Applicability

| Issue Type | Applies? |
|------------|----------|
| Story      | ✅ Yes   |
| Task       | ✅ Yes   |
| Bug        | ✅ Yes   |

---

## Instructions

1. Read the full issue context: problem statement, description, acceptance criteria, scope, and related issues.

2. Look for **implicit dependencies** — things the issue assumes exist or will be true, without acknowledging them. Check for:

   **External systems or APIs** — Does the story assume an integration with an external service, API, or data source? Is that integration confirmed to exist and be available?

   **Unreleased or in-progress capabilities** — Does the story depend on functionality from another team, another story, or a feature currently in development? Is that dependency linked or named?

   **Pending decisions** — Does the story assume a product, design, legal, or technical decision has been made that may not have been? Look for language like "once we know", "TBD", "depending on", or implicit assumptions in the AC.

   **Data or state assumptions** — Does the story assume certain data exists, is in a certain state, or has been migrated? Is that assumption documented?

   **Infrastructure or environment** — Does the story require infrastructure, configuration, or environment changes that are not part of this issue?

3. For each implicit dependency found, assess whether it is:
   - **Unacknowledged and potentially blocking** — the dependency is not mentioned and its absence could block delivery → `critical`
   - **Known but undocumented** — the dependency likely exists but is not explicitly referenced → `minor`

4. Do not flag dependencies that are clearly resolved and evidenced in the issue (e.g., a linked story that is already done, a confirmed integration already in production).

**Scope of reasoning:** This skill reasons from issue text only — it cannot verify whether a referenced system, API, or capability actually exists in the product, or whether a linked story is actually complete. Flag what the issue *implies but does not acknowledge*. Do not assert that a dependency is broken or missing — only that it is unacknowledged and should be confirmed. Phrase findings as signals to investigate, not as confirmed blockers.

---

## Output

- **findings** — List of unacknowledged dependencies, each identifying the dependency and explaining the delivery risk if unresolved. Empty if no implicit dependencies are found.
- **severity** — `critical` if any dependency could block delivery and is not acknowledged; `minor` if dependencies exist but are likely known/resolved
