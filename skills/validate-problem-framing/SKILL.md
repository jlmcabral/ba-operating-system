---
name: validate-problem-framing
description: Check whether an issue is grounded in a real user problem or is describing a solution/feature preference. Use when validating Stories or Bugs — critical blocker when it fails.
---

# Skill: Validate Problem Framing

**Purpose:** Check whether the issue is framed around a real user problem or is describing a solution, feature preference, or internal assumption.

**Config references:**
- `config/quality-standards.md` — Problem statement rules

---

## Input

- **canonical_issue** — The normalised issue context (or draft)
- **issue_type** — Story, Task, or Bug

---

## Applicability

| Issue Type | Applies? |
|------------|----------|
| Story      | ✅ Yes   |
| Bug        | ✅ Yes   |
| Task       | ❌ Skip — technical work is not grounded in user needs |

If the issue type is Task, skip this check entirely and return no findings.

---

## Instructions

1. Read the problem statement (or description if no explicit problem statement exists).

2. Check for these failure signals:
   - The problem statement describes a **feature or solution** rather than a user need
   - The problem statement is **absent or too vague** to be actionable
   - The "so that" clause in the story describes a **feature delivery** rather than a user outcome
   - The description jumps straight into **what to build** without explaining **why**

3. If any signal is present, produce a finding that:
   - Explains what is wrong (be specific — quote the problematic text)
   - Explains why it matters (what goes wrong downstream if this is not fixed)
   - Suggests how to think about reframing it (do not write the fix — that is for `revise-draft-from-findings`)

---

## Output

- **finding** — Description of the problem framing issue, or empty if the check passes
- **severity** — `critical` (always, when this check fails — problem framing is a readiness blocker)
