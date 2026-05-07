# Reference: Agent Dispatch Pattern

General pattern for BA orchestrators when main thread offloads independent work to sub-agents. Use for validation, normalization, classification, batch assessment, other repeatable reasoning blocks.

---

## Agent vs Inline

Rule: spawn agent when work is **independent** + **slow**. Keep main thread for quick work or dependency-bound steps.

| Situation | Do inline | Spawn agent |
|---|---|---|
| Single quick lookup | ✅ | |
| One step that needs prior step's output | ✅ | |
| Multiple validators, all independent | | ✅ |
| N issues, each needing same processing | | ✅ |
| Normalize then validate (sequential dep) | ✅ for normalize | ✅ for validate |
| Already know answer | ✅ | |

---

## Prompt Packaging Template

Stateless agents. No shared context. Main thread must pack all needed text into prompt.

Always include:
- full skill text agent must execute
- full input payload agent must inspect
- config or template text agent needs
- exact output contract

```
[SKILL CONTENT]
Include the full text of each skill the agent must execute.

[INPUT DATA]
- canonical_issue / raw issue content
- issue_type
- template_structure (if running validate-completeness)

[OUTPUT INSTRUCTION]
Return ONLY: [describe exact output format expected]
Do not explain your reasoning. Do not include passing checks. Do not add commentary.
```

Never write: "issue above", "context already loaded", "use fetched template". Agent has none unless prompt embeds it.

If agent needs fetch step, say so explicitly. Else assume no fetch.

---

## Parallel Launch Pattern

Rule: launch all independent agents in one turn. No staggered launch. No wait between launches.

```
# Correct — all launched in same turn
agent_a = task(name="val-scope", mode="background", prompt=...)
agent_b = task(name="val-ac-quality", mode="background", prompt=...)
agent_c = task(name="val-persona", mode="background", prompt=...)

# Then collect
result_a = read_agent(agent_a, wait=true)
result_b = read_agent(agent_b, wait=true)
result_c = read_agent(agent_c, wait=true)
```

Wrong pattern: launch one, wait, launch next. Burns time. No gain.

---

## Collecting and Merging Results

After all launches:

1. Use `read_agent(agent_id, wait: true)` for each agent
2. Extract `finding` + `severity` from each result
3. Drop null or empty `finding`
4. Merge remaining into single `validation_findings` list
5. Sort: critical → minor → observational

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

For non-validation flows, same merge rule. Swap list name to fit downstream contract.

---

## Sequential vs Parallel

Decision flow:
- Does task B need task A output? → Sequential
- Can task A and task B start from same inputs? → Parallel
- One fast, one slow, both independent? → Parallel anyway

Common BA patterns:

| Pattern | Dispatch |
|---|---|
| Validation dispatch | All validators independent → always parallel |
| Normalize → validate | Normalize first, then validator fan-out |
| Classify → fetch-template | Classify first, then fetch template for chosen type |
| Batch assess | One composite agent per issue, all issues in parallel |

---

## Naming Conventions

| Purpose | Agent name |
|---|---|
| Type classification | `classify-{issue_key}` |
| Normalization | `normalize-{issue_key}` |
| Template fetch | `fetch-template` |
| Single validator | `val-{validator-name}` |
| Composite assessment | `assess-{issue_key}` |

Keep names short, stable, grepable.

---

## Common Errors to Avoid

- launching agents sequentially when same-input work could run in parallel
- missing skill, config, template, or issue text in prompt
- expecting agent to read main-thread context implicitly
- using background agent for trivial single-step work
- forgetting to collect all results before downstream merge or synthesis
- making agent fetch short files instead of embedding them directly

---

## Notes

- Main thread owns dispatch decision, prompt packaging, result merge.
- Sub-agent owns only work described in prompt.
- Prefer embedded file content over extra tool calls when file short.
- `orchestrators/REFERENCE-validation-dispatch.md` stays narrow validator guide. This file covers broader dispatch pattern.
