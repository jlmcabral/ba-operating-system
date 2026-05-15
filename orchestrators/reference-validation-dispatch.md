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

For each applicable validator, launch background agent. **Orchestrator pre-loads config files and embeds them** — validators use embedded content instead of reading config files individually.

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
     5. [EMBEDDED CONFIG: config/quality-standards.md]
        (orchestrator inlines content here)
     6. [EMBEDDED CONFIG: config/personas.md]
        (orchestrator inlines content here)
     
     Note: Config content is above. Skill may say "Read config/...md" — skip that instruction, use the embedded content.
  - Record the agent_id returned
```

Launch ALL applicable validators simultaneously. Don't wait between launches.

---

## Collecting Results

After all agents launched:

1. Wait for all using `read_agent` with `wait: true` on each agent_id
2. From each result, extract the `findings` list
3. Flatten all non-empty lists into a single **validation_findings** list
4. Drop empty results (these passed)
5. Sort remaining findings by severity: critical → minor → observational

---

## Combined Output Format

```
validation_findings = [
  { skill: "validate-problem-framing", category: "problem-framing", message: "...", severity: "critical" },
  { skill: "validate-scope", category: "scope", message: "...", severity: "critical" },
  { skill: "validate-ac-quality", category: "ac-quality", message: "...", severity: "minor" },
  ...
]
```

Only non-empty `findings` entries proceed to downstream skills.

---

## Notes

- **validate-persona** may return up to two findings from one invocation: `persona-specificity` (`observational`) and `persona-role-coverage` (`critical` when applicable).
- **validate-completeness** requires `template_structure` as additional input — other validators don't.
- **validate-design-reference** applies to Story only — skip for Bug and Task.
- Batch operations (`/assess-refinement`): validators run per-issue inside composite agent. The orchestrator pre-determines issue type from Jira data (deterministic field read) and loads **only validators applicable to that type** — reducing prompt size 30-55% per agent. The agent still classifies independently and flags type mismatches.

---

**See also:** [`orchestrators/reference-agent-dispatch.md`](reference-agent-dispatch.md) — general agent dispatch rules (when to use agents, prompt packaging, parallel launch, result merge).
