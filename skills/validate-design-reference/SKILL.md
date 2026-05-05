---
name: validate-design-reference
description: Check whether a user-facing story references a design (Figma or equivalent) when one would be expected. Use when validating Stories — missing design references are a common gap raised in refinement sessions.
---

# Skill: Validate Design Reference

**Purpose:** Check whether a user-facing story that involves new or significantly changed UI references a design file (Figma, prototype, or equivalent), or explicitly acknowledges that design is pending.

**Config references:**

- None — this skill reasons from issue context only

---

## Input

- **canonical_issue** — The normalised issue context (or draft)
- **issue_type** — Story, Task, or Bug

---

## Applicability

| Issue Type | Applies? |
| ---------- | -------- |
| Story      | ✅ Yes   |
| Task       | ✅ Yes   |
| Bug        | ✅ Yes   |

---

## Instructions

1. Determine whether the issue involves **new or significantly changed user interface**. Signals include:
   - The issue introduces a new screen, page, modal, or flow
   - The issue changes how an existing screen or interaction behaves in a way that would require visual design decisions
   - The acceptance criteria reference user-visible elements (forms, lists, dashboards, navigation)

2. If the issue does **not** involve new or changed UI (e.g., a behaviour-only issue about background processing, notifications, or data rules with no new visual surface), skip the check and return no finding.

3. If the issue **does** involve new or changed UI, check whether the issue contains any of the following:
   - A link to a Figma file, prototype, or equivalent design tool
   - A reference to a design document or attachment
   - An explicit acknowledgement that design is pending (e.g., "design to follow", "Figma link TBD", "design not yet available")

4. If none of the above are present, produce a finding — engineering will not know what to build without a design reference or an explicit acknowledgement of its absence.

---

## Output

- **finding** — Description of the missing design reference, or null if a reference exists or the issue does not require one
- **severity** — `minor` (always — missing design is a gap but not always a delivery blocker if the issue is behaviour-driven)
