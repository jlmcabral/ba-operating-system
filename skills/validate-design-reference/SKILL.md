---
name: validate-design-reference
description: Check whether a user-facing story references a design (Figma or equivalent) when one would be expected. Use when validating Stories — missing design references are a common gap raised in refinement sessions.
---

# Skill: Validate Design Reference

**Purpose:** Check whether a user-facing story involving new or significantly changed UI references a design file (Figma, prototype, or equivalent), or explicitly acknowledges design is pending.

**Config references:**
- None — reasons from issue context only

---

## Input

- **canonical_issue** — Normalised issue context (or draft)
- **issue_type** — Story, Task, or Bug

---

## Applicability

| Issue Type | Applies? |
| ---------- | -------- |
| Story | ✅ Yes |
| Task | ✅ Yes |
| Bug | ✅ Yes |

---

## Instructions

1. Determine whether issue involves **new or significantly changed user interface**. Signals:
   - Introduces new screen, page, modal, or flow
   - Changes how existing screen or interaction behaves in ways requiring visual design decisions
   - Acceptance criteria reference user-visible elements (forms, lists, dashboards, navigation)

2. If issue does **not** involve new or changed UI (e.g., behaviour-only issue about background processing, notifications, or data rules with no new visual surface), skip check and return no finding.

3. If issue **does** involve new or changed UI, check whether issue contains any of:
   - Link to Figma file, prototype, or equivalent design tool
   - Reference to design document or attachment
   - Explicit acknowledgement that design is pending (e.g., "design to follow", "Figma link TBD", "design not yet available")

4. If none present, produce finding — engineering won't know what to build without design reference or explicit acknowledgement of its absence.

---

## Output

- **finding** — Description of missing design reference, or null if reference exists or issue doesn't require one
- **severity** — `minor` (always — missing design is a gap but not always a delivery blocker if issue is behaviour-driven)
