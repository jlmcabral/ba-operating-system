# Reference: Readiness Report Formatting

This file contains detailed tier definitions, failure categories, and output templates for the readiness report skill.

---

## Readiness Tier Logic

Determine the readiness tier for each issue based on its validation findings:

| Tier                 | Condition                                                                |
|----------------------|--------------------------------------------------------------------------|
| ✅ Ready             | All applicable checks pass. No critical or minor findings.               |
| ⚠️ Needs Minor Work | One or two non-critical findings present. No critical blockers.          |
| ❌ Not Ready         | One or more critical findings present.                                   |

**Critical blockers:**
- Problem framing failure → Always ❌
- Scope failure → Always ❌
- AC quality failure (majority of criteria) → ❌
- AC UI/UX trap (majority of criteria) → ❌
- Completeness failure (required fields missing) → ❌

**Minor issues:**
- AC quality (one or two weak criteria) → ⚠️
- AC UI/UX trap (one or two design debt markers) → ⚠️
- Completeness (fields present but thin) → ⚠️

**Observational only (never affects tier):**
- Persona findings

---

## Failure Categories

| Category              | Icon | Applies to          |
|-----------------------|------|---------------------|
| Problem framing       | 🎯   | Story, Bug          |
| Scope                 | 📐   | Story, Task, Bug    |
| AC — quality          | ✅   | Story, Task, Bug    |
| AC — UI/UX trap       | 🖥️   | Story, Bug          |
| Completeness          | 📋   | Story, Task, Bug    |

Only include rows for categories that apply to the issue type.

---

## Single Mode Output Template (`/assess`)

Produce a detailed assessment for one issue:

```
**[ISSUE KEY](https://jira.int.kn/browse/ISSUE-KEY) — [Title]**
**Type:** Story / Task / Bug
**Readiness:** ✅ / ⚠️ / ❌
**Reporter:** [reporter name]

**Check results:**

| Category | Result | Finding |
|----------|--------|---------|
| [applicable categories only] | ⚠️ / ❌ | [brief finding] |

**What needs to change before refinement:**
[numbered list of specific, actionable items — one per failing check]
```

---

## Batch Mode Output Template (`/assess-refinement`)

**Output 1 — Summary table:**

| Issue Key | Title | Type | Readiness | Failure categories |
|-----------|-------|------|-----------|-------------------|
| [linked key] | [title] | Story/Task/Bug | ✅/⚠️/❌ | [icons + names, or "None"] |

Sort: ✅ Ready first, then ⚠️, then ❌.

**Output 2 — Detailed assessment (⚠️ and ❌ only):**

For each issue that is not ✅ Ready, produce the same detailed format as single mode.

Do **not** produce detailed assessments for ✅ Ready issues.
