# Data Schema: BA Operating System

This document defines the exact shape and type of data structures flowing between skills. Use this when writing skills or orchestrators — it's your single source of truth for what "canonical_issue" means, what shape "validation_findings" has, etc.

---

## Core Objects

### canonical_issue

The normalized representation of an issue, used as the working object throughout all skills.

```typescript
canonical_issue = {
  // Identification
  issue_key: string | null,           // Jira key (e.g., "PROJECT-1234"), or null if draft
  issue_type: "Story" | "Task" | "Bug",
  source: "jira" | "idea" | "draft",

  // Core narrative (Story/Bug only)
  user_role: string,                  // WHO (the user)
  user_goal: string,                  // WHAT (their objective)
  user_motivation: string,            // WHY (the outcome they want)
  problem_statement: string,          // The user problem (not the solution)

  // Scope and constraints
  scope_in: string[],                 // What IS included
  scope_out: string[],                // What IS NOT included
  non_goals: string[],                // Explicit non-goals

  // Acceptance criteria
  acceptance_criteria: ac_scenario[],

  // Implementation notes (Tasks/Bugs)
  implementation_notes: string | null,
  definition_of_done: string[] | null,

  // Metadata
  is_spike: boolean,
  is_enhancement: boolean,
  related_issues: string[],           // Jira keys of related issues
  personas_involved: string[],        // From config/personas.md

  // Quality markers
  status: "draft" | "enriched" | "validated",
  confidence: 0.0 to 1.0,
  flags: string[],                    // [MISSING], [AMBIGUOUS], etc.
}
```

**When populated:**

- `analyze-input-type` → sets issue_type, source, is_spike
- `normalize-issue-context` → populates ALL fields (missing ones marked `[MISSING]`)
- `ask-clarification-questions` → enriches with user answers (status → "enriched")
- `validate-*` skills → populate flags (status remains enriched, not yet validated)

**Note:** Tasks do NOT have user_role/goal/motivation. Use implementation_notes instead.

---

### ac_scenario

An individual acceptance criterion (one Gherkin scenario).

```typescript
ac_scenario = {
  id: string,                         // "AC-001", "AC-002", etc.
  scenario_title: string,             // Gherkin scenario title
  given: string[],                    // Given steps
  when: string[],                     // When steps
  then: string[],                     // Then steps
  data_context: string | null,        // Optional: specific data needed for this scenario
  edge_cases: string[],               // Known edge cases
}
```

**Rules:**

- Each field is a list of step strings (including the keyword, e.g., "Given the user is logged in")
- Steps must be testable (not vague)
- Do NOT include "And" keywords at the start of a string; use separate entries in the array

**Example:**

```typescript
ac_scenario = {
  id: "AC-001",
  scenario_title: "Overdue task is highlighted in red",
  given: [
    "Given the current date is 2026-05-15",
    "Given a task with due_date = 2026-05-10",
  ],
  when: ["When the user opens the task list"],
  then: ["Then the task row background is red"],
  data_context: null,
  edge_cases: [
    "Task completed before due date is not highlighted",
    "Task due today is not highlighted (only AFTER due date)",
  ],
};
```

---

### validation_finding

Output from any validation skill.

```typescript
validation_finding = {
  skill: string, // Which skill found this (e.g., "validate-scope")
  criterion: string, // What was being checked (e.g., "scope-single-outcome")
  severity: "critical" | "major" | "minor" | null,
  finding: string | null, // Description of the problem, or null if passed
  context: object, // Optional: context for debugging
  suggested_fix: string | null, // Optional: hint for how to fix (not the fix itself)
};
```

**Rules:**

- `severity` is `null` when `finding` is `null` (i.e., check passed)
- `critical` findings block readiness (e.g., missing problem statement)
- `major` findings should be addressed before refinement (e.g., ambiguous AC)
- `minor` findings are nice-to-have (e.g., formatting)
- `suggested_fix` is a hint, not the fix itself (the `revise-draft-from-findings` skill applies fixes)

**Example (Finding):**

```typescript
validation_finding = {
  skill: "validate-scope",
  criterion: "scope-single-outcome",
  severity: "critical",
  finding:
    "Issue addresses two distinct user needs: (1) override approval workflow, (2) audit trail. These should be split.",
  context: {
    identified_outcomes: [
      "Allow managers to override approval workflow",
      "Maintain audit trail of all overrides",
    ],
  },
  suggested_fix:
    "Create PROJECT-1234a (override workflow) and PROJECT-1234b (audit trail)",
};
```

**Example (Passed check):**

```typescript
validation_finding = {
  skill: "validate-ac-quality",
  criterion: "ac-gherkin-format",
  severity: null,
  finding: null,
  context: null,
  suggested_fix: null,
};
```

---

### issue_draft

The formatted issue ready for presentation or saving to Jira.

```typescript
issue_draft = {
  // Header
  key: string | null,                 // Jira key (if updating existing)
  type: "Story" | "Task" | "Bug",
  title: string,

  // Body (format: Markdown)
  problem_statement: string,          // Story/Bug only
  implementation_notes: string,       // Task only; may be empty
  scope: {
    in: string,                       // Bullet list
    out: string,                      // Bullet list
    non_goals: string                 // Bullet list
  },
  acceptance_criteria: string,        // Formatted Gherkin (ready for copy-paste)
  definition_of_done: string | null,  // Task/Bug only

  // Metadata
  related_issues: string[],
  spike: boolean,
  enhancement: boolean,

  // Revisions
  revision_notes: string[],           // List of changes made (for transparency)
}
```

**When populated:**

- `produce-issue-draft` → populates ALL fields based on template + canonical_issue
- `revise-draft-from-findings` → updates fields, appends to revision_notes

**Format rules:**

- `acceptance_criteria` is a formatted Gherkin block (ready to paste into Jira description)
- `scope.in`, `scope.out`, `scope.non_goals` are Markdown bullet lists
- `revision_notes` is ["✏️ Rewrote AC-001 to be testable", "✏️ Strengthened problem statement"]

---

### readiness_tier

Enum for readiness assessment outcomes.

```typescript
readiness_tier = "ready" | "minor_work" | "not_ready";
```

**Definitions:**

- `"ready"` — Issue can enter refinement as-is. No blockers found.
- `"minor_work"` — Issue needs small fixes (formatting, clarification) before refinement. No scope/logic problems.
- `"not_ready"` — Issue has structural problems (scope split needed, missing acceptance criteria, weak problem framing). Cannot enter refinement.

---

### readiness_assessment

The assessment result from validation skills, used to determine readiness_tier.

```typescript
readiness_assessment = {
  issue_key: string,
  issue_type: string,
  readiness_tier: readiness_tier,
  passed_checks: {
    problem_framing: boolean,
    scope: boolean,
    ac_quality: boolean,
    ac_uiux: boolean,
    completeness: boolean,
    persona: boolean
  },
  failed_checks: validation_finding[],  // Only critical or major findings
  summary: string,                       // One-sentence summary for readiness tier
}
```

**Rules:**

- If ANY critical finding exists → readiness_tier = "not_ready"
- If 3+ major findings exist → readiness_tier = "not_ready"
- If 1-2 major findings exist → readiness_tier = "minor_work"
- If only minor findings exist → readiness_tier = "ready"

---

## Collection Objects

### validation_findings (array)

Array of validation_finding objects, produced by running all applicable validators for an issue type.

```typescript
validation_findings = validation_finding[]
```

**When populated:**

- In `/craft` Step 6, all applicable validators run in parallel
- Results are merged into one array
- Findings where finding == null are filtered out

**Example (3 findings, 2 critical):**

```typescript
validation_findings = [
  {
    skill: "validate-problem-framing",
    criterion: "problem-not-solution",
    severity: "critical",
    finding:
      "Problem statement describes the solution (a new 'Override' button) rather than the user need (managers cannot override blocked approvals)",
  },
  {
    skill: "validate-scope",
    criterion: "scope-single-outcome",
    severity: "critical",
    finding: "Issue addresses two outcomes...",
  },
  {
    skill: "validate-ac-quality",
    criterion: "ac-gherkin-format",
    severity: null,
    finding: null,
  },
];
```

---

### assessments (array)

Array of readiness_assessment objects, one per issue being assessed in batch mode (e.g., `/assess-refinement`).

```typescript
assessments = readiness_assessment[]
```

**When populated:**

- In `/assess-refinement` Step 4, each issue is validated
- Results are combined into one array, sorted by readiness_tier

---

## Template Structures

### template_structure

The shape of an issue template (Story, Task, or Bug).

```typescript
template_structure = {
  type: "Story" | "Task" | "Bug",
  sections: {
    user_narrative: string,          // "As a [role], I want to [goal], so that [outcome]"
    problem_statement: string,       // Markdown placeholder text
    scope: {
      in: string,                    // Placeholder for in-scope items
      out: string,                   // Placeholder for out-of-scope items
      non_goals: string              // Placeholder for explicit non-goals
    },
    acceptance_criteria: string,     // Example Gherkin scenario
    definition_of_done: string | null // Task/Bug only
  },
  quality_rules: string[],           // Links to quality-standards.md sections
}
```

---

## Enums and Constants

### issue_type

```typescript
issue_type = "Story" | "Task" | "Bug";
```

**Definitions:**

- `"Story"` — User-facing feature or capability
- `"Task"` — Technical work (refactoring, infrastructure, chores)
- `"Bug"` — Unintended behavior, defect

---

### severity

```typescript
severity = "critical" | "major" | "minor" | null;
```

**Definitions:**

- `"critical"` — Blocks refinement readiness
- `"major"` — Should be fixed before refinement
- `"minor"` — Nice-to-have improvement
- `null` — Check passed (finding == null)

---

### status

```typescript
status = "draft" | "enriched" | "validated";
```

**Definitions:**

- `"draft"` — Raw input, no questions asked yet
- `"enriched"` — Questions asked and answered by user
- `"validated"` — Validation skills have run (may have findings)

---

## Quick Reference

| Object                 | Used By                                | Created By                        | Purpose                              |
| ---------------------- | -------------------------------------- | --------------------------------- | ------------------------------------ |
| `canonical_issue`      | All skills                             | normalize-issue-context           | Working object for all processing    |
| `ac_scenario`          | validate-ac-\*, produce-issue-draft    | analyze from issue                | Individual acceptance criterion      |
| `validation_finding`   | orchestrators, format-readiness-report | Any validate-\* skill             | One validation check result          |
| `issue_draft`          | format-readiness-report, revise-draft  | produce-issue-draft, revise-draft | Formatted issue ready for use        |
| `readiness_tier`       | format-readiness-report                | Computed from findings            | High-level readiness status          |
| `readiness_assessment` | format-readiness-report (batch mode)   | All validators                    | Full assessment of one issue         |
| `validation_findings`  | revise-draft, format-readiness-report  | All validators (merged)           | All validation results for one issue |
| `template_structure`   | produce-issue-draft                    | fetch-required-templates          | Issue template structure             |

---

## Extending This Schema

When adding new data structures:

1. Add to this file with full TypeScript notation
2. Document when it's populated (which skills create it)
3. Document when it's used (which skills consume it)
4. Add to "Quick Reference" table
5. Update relevant skill files to reference SCHEMA.md

---

## Related Documents

- [DESIGN_PATTERNS.md](DESIGN_PATTERNS.md) — How to make design decisions
- [skills/README.md](skills/README.md) — Skill file template
- [config/quality-standards.md](config/quality-standards.md) — Validation rules (references this schema)
