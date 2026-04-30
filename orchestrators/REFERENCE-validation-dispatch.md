# Reference: Validation Dispatch Pattern

This reference defines the standard pattern for running validation skills in parallel. Orchestrators reference this document instead of repeating the dispatch logic inline.

---

## Applicable Validators by Issue Type

| Issue Type | Validators to run |
|------------|-------------------|
| Story | validate-problem-framing, validate-scope, validate-ac-quality, validate-ac-uiux-trap, validate-completeness, validate-persona |
| Bug | validate-problem-framing, validate-scope, validate-ac-quality, validate-ac-uiux-trap, validate-completeness, validate-persona |
| Task | validate-scope, validate-ac-quality, validate-completeness |

---

## Dispatch Template

For each applicable validator, launch a background agent:

```
Launch background agent with:
  - name: "val-{validator-name}" (e.g., "val-problem-framing")
  - agent_type: "general-purpose"
  - mode: "background"
  - prompt: Include:
    1. The full skill file content
    2. The enriched_canonical_issue (or canonical_issue for /assess flows)
    3. The issue_type
    4. The template_structure (for validate-completeness)
  - Record the agent_id returned
```

Launch ALL applicable validators simultaneously. Do not wait between launches.

---

## Collecting Results

After all agents are launched:

1. Wait for all to complete using `read_agent` with `wait: true` on each agent_id
2. From each result, extract `finding` and `severity`
3. Merge into a single **validation_findings** list
4. Filter out entries where `finding` is null or empty (these passed)
5. Sort remaining findings by severity: critical → minor → observational

---

## Combined Output Format

```
validation_findings = [
  { skill: "validate-problem-framing", finding: "...", severity: "critical" },
  { skill: "validate-scope", finding: "...", severity: "critical" },
  { skill: "validate-ac-quality", finding: "...", severity: "minor" },
  ...
]
```

Only findings with non-null `finding` values proceed to downstream skills.

---

## Notes

- **Persona findings** are always `observational` severity and never affect readiness tier
- **validate-completeness** requires `template_structure` as additional input — other validators do not
- For batch operations (`/assess-refinement`), validators run per-issue inside a composite agent. The dispatch pattern is the same but executed within the agent context rather than at the orchestrator level.
