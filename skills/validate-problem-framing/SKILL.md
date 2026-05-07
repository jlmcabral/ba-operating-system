---
name: validate-problem-framing
description: Check whether an issue is grounded in a real user problem or is describing a solution/feature preference. Use when validating Stories or Bugs — critical blocker when it fails.
---

# Skill: Validate Problem Framing

**Purpose:** Check whether issue is framed around a real user problem or describing a solution, feature preference, or internal assumption.

**Config references:**
- `config/quality-standards.md` — Problem statement rules

---

## Input

- **canonical_issue** — Normalised issue context (or draft)
- **issue_type** — Story, Task, or Bug

---

## Applicability

| Issue Type | Applies? |
|------------|----------|
| Story | ✅ Yes |
| Bug | ✅ Yes |
| Task | ❌ Skip — technical work isn't grounded in user needs |

If Task, skip entirely and return no findings.

---

## Instructions

1. Read problem statement (or description if no explicit problem statement exists).

2. Check for failure signals:
   - Problem statement describes **feature or solution** rather than user need
   - Problem statement is **absent or too vague** to be actionable
   - "So that" clause in story describes **feature delivery** rather than user outcome
   - Description jumps straight into **what to build** without explaining **why**

3. If any signal present, produce finding that:
   - Explains what's wrong (be specific — quote problematic text)
   - Explains why it matters (what goes wrong downstream if not fixed)
   - Suggests how to think about reframing (don't write the fix — that's for `revise-draft-from-findings`)

---

## Output

- **finding** — Description of problem framing issue, or empty if check passes
- **severity** — `critical` (always, when this check fails — problem framing is a readiness blocker)
