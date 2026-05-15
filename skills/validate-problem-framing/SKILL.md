---
name: validate-problem-framing
description: Check whether an issue is grounded in a real user problem or is describing a solution/feature preference. Use when validating Stories or Bugs — critical blocker when it fails.
---

Purpose: Check whether issue is framed around a real user problem or describing a solution, feature preference, or internal assumption.

Input: canonical_issue, issue_type.

Instructions:

1. Read problem statement (or description if no explicit problem statement exists).
2. Check for failure signals: problem describes feature/solution rather than user need, absent or too vague to be actionable, "so that" clause describes feature delivery rather than user outcome, description jumps straight into what to build without explaining why.
3. If any signal present: quote problematic text, explain why it matters downstream, suggest how to think about reframing (don't write the fix).

Output:
- findings — list of finding objects, empty if check passes. Each object uses:
  - category — `problem-framing`
  - message — description of the problem framing issue
  - severity — `critical`
