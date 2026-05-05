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
- Scenario coverage failure (zero unhappy paths when context implies error states exist) → ❌
- Dependencies failure (unacknowledged dependency that could block delivery) → ❌
- Persona role coverage failure (story implies role-differentiated behaviour but AC does not capture it) → ❌

**Minor issues:**
- AC quality (one or two weak criteria) → ⚠️
- AC UI/UX trap (one or two design debt markers) → ⚠️
- Completeness (fields present but thin) → ⚠️
- Scenario coverage (some unhappy paths covered but significant gaps remain) → ⚠️
- Dependencies (dependency exists but likely known/resolved) → ⚠️
- Design reference (user-facing story with no design link and no acknowledgement) → ⚠️

**Observational only (never affects tier):**
- Persona specificity findings (Behaviour A — generic persona label)

---

## Failure Categories

| Category              | Icon | Applies to          |
|-----------------------|------|---------------------|
| Problem framing       | 🎯   | Story, Bug          |
| Scope                 | 📐   | Story, Task, Bug    |
| AC — quality          | ✅   | Story, Task, Bug    |
| AC — UI/UX trap       | 🖥️   | Story, Bug          |
| Completeness          | 📋   | Story, Task, Bug    |
| Scenario coverage     | 🔀   | Story, Bug          |
| Dependencies          | 🔗   | Story, Task, Bug    |
| Design reference      | 🎨   | Story               |
| Persona — role coverage | 👥 | Story, Bug          |

Only include rows for categories that apply to the issue type. The Persona — role coverage row only appears when the `validate-persona` skill returns a role differentiation finding (Behaviour B). Generic persona observations (Behaviour A) are never shown in the check results table.

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
