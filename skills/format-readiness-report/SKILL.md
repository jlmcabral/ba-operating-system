---
name: format-readiness-report
description: Generate readiness assessment output in single or batch mode with tier classification and actionable findings. Use when presenting validation results to the user.
---

# Skill: Format Readiness Report

**Purpose:** Generate readiness assessment output — detailed report for single issue, or summary table with failure details for batch.

**Config references:**
- `config/output-preferences.md` — Output style rules

---

## Input

- **mode** — `single` or `batch`
- **assessments** — One or more issue assessments, each containing:
  - Issue key, title, type, status
  - Validation findings from all applicable checks
  - Reporter name

**Reference:** See `REFERENCE.md` for tier definitions and examples.

---

## Instructions

1. **Classify each issue** into readiness tier (✅ Ready, ⚠️ Needs Minor Work, ❌ Not Ready) using tier logic in `REFERENCE.md`.

2. **Single mode** (`/assess`): Produce detailed assessment for one issue using single mode template in `REFERENCE.md`.

3. **Batch mode** (`/assess-refinement`): Produce summary table of all issues sorted by tier (✅ first, then ⚠️, then ❌), followed by detailed assessments for non-ready issues only. See `REFERENCE.md` for templates.

4. Only include failure categories applicable to the issue type.

---

## Output

- **report** — Formatted readiness report in appropriate mode
