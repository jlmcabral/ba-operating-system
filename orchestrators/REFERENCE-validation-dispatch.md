# Reference: Validation Dispatch Pattern

Standard pattern for running validation skills in parallel. Orchestrators reference this instead of repeating dispatch logic inline.

---

## Applicable Validators by Issue Type

| Issue Type | Validators to run |
|------------|-------------------|
| Story | validate-problem-framing, validate-scope, validate-ac-quality, validate-ac-uiux-trap, validate-completeness, validate-persona, validate-scenario-coverage, validate-dependencies, validate-design-reference |
| Bug | validate-problem-framing, validate-scope, validate-ac-quality, validate-ac-uiux-trap, validate-completeness, validate-persona, validate-scenario-coverage, validate-dependencies |
| Task | validate-scope, validate-ac-quality, validate-completeness, validate-dependencies |

---

## Dispatch Template

For each applicable validator, launch background agent:

```
Launch background agent with:
  - name: "val-{validator-name}" (e.g., "val-problem-framing")
  - agent_type: "general-purpose"
  - mode: "background"
  - prompt: Include:
    1. Full skill file content
    2. enriched_canonical_issue (or canonical_issue for /assess flows)
    3. issue_type
    4. template_structure (for validate-completeness)
  - Record the agent_id returned
```

Launch ALL applicable validators simultaneously. Don't wait between launches.

---

## Collecting Results

After all agents launched:

1. Wait for all using `read_agent` with `wait: true` on each agent_id
2. From each result, extract `finding` and `severity`
3. Merge into single **validation_findings** list
4. Filter out entries where `finding` is null or empty (these passed)
5. Sort remaining by severity: critical → minor → observational

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

- **validate-persona** has two behaviours: persona specificity (always `observational`) and role-based coverage (can be `critical`). Both findings returned from same skill invocation.
- **validate-completeness** requires `template_structure` as additional input — other validators don't.
- **validate-design-reference** applies to Story only — skip for Bug and Task.
- Batch operations (`/assess-refinement`): validators run per-issue inside composite agent. Dispatch pattern same but executed within agent context.

---

**See also:** [`orchestrators/REFERENCE-agent-dispatch.md`](REFERENCE-agent-dispatch.md) — general agent dispatch rules (when to use agents, prompt packaging, parallel launch, result merge).
