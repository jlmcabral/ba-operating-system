# Design Patterns: BA Operating System

This document explains **how to extend** the BA Operating System. Use it when writing new skills, orchestrators, or modifying existing flows.

---

## Table of Contents

1. [Skill Design](#skill-design)
2. [Orchestrator Design](#orchestrator-design)
3. [Configuration Design](#configuration-design)
4. [Decision Trees](#decision-trees)

---

## Skill Design

### What is a Skill?

A skill is a **single, focused decision point or transformation**. It takes input, performs one job, and produces output.

**Principle:** A skill should be small enough that a BA can read it in <5 minutes.

### Routing Metadata (Frontmatter)

Every skill and orchestrator begins with YAML frontmatter:

```yaml
---
name: skill-name
description: Brief description of capability. Use when [specific triggers].
---
```

**Why:** The description is the only thing the agent sees when deciding which skill is relevant. Explicit "Use when..." triggers prevent skill thrashing (agent loads wrong skill, wastes tokens, backs out). This is a routing optimisation.

**Rules:**
- Max 1024 characters
- First sentence: what it does
- Second sentence: "Use when [specific triggers]"
- Include keywords the user might say

### Skill Naming Convention

| Purpose | Pattern | Example |
|---------|---------|---------|
| Fetch data | `fetch-{source}` | `fetch-issue-by-key`, `fetch-required-templates`, `fetch-issues-by-status` |
| Analyze/classify | `analyze-{aspect}` | `analyze-input-type` |
| Validate | `validate-{criterion}` | `validate-scope`, `validate-ac-quality`, `validate-problem-framing` |
| Transform | `{verb}-{object}` | `normalize-issue-context`, `produce-issue-draft`, `revise-draft-from-findings` |
| Ask/interact | `ask-{what}` | `ask-clarification-questions` |
| Output/format | `{action}-{output-type}` | `format-readiness-report`, `generate-follow-up-questions` |

**Why this matters:** Names make the skill's job obvious. `validate-scope` is clearer than `check-issue`. `fetch-issue-by-key` is clearer than `get-jira-data`.

---

### When to Create a New Skill (vs. Modify Existing)

Use this decision tree:

```
Does the skill do ONE thing?
  ├─ YES → Is it used by 2+ orchestrators?
  │         ├─ YES → Create new skill ✅
  │         └─ NO  → Check: Is the job <100 lines and logically standalone?
  │                  ├─ YES → Create new skill ✅
  │                  └─ NO  → Add to existing related skill ⚠️
  └─ NO → Break it into smaller skills ⚠️
```

**Examples:**

- ✅ **Create a new skill** when:
  - You need to validate a new criterion (e.g., `validate-performance-implications`)
  - You need to fetch from a new source (e.g., `fetch-confluence-docs`)
  - You need a new interaction pattern (e.g., `ask-follow-up-questions-on-scope`)

- ⚠️ **Add to existing skill** when:
  - You're adding a new validation rule to an existing criterion (e.g., "also check for ambiguous pronouns" → add to `validate-ac-quality`, not a new skill)
  - You're refining an existing transformation (e.g., "enhance problem statement detection" → modify `normalize-issue-context`)

---

### Skill Structure

Every skill file has these sections:

```markdown
# Skill: [Name]

**Purpose:** One sentence. What problem does this solve?

**Config references:**
- `config/file1.md` — What it controls
- `config/file2.md` — What it controls

---

## Input

- **field1** — Description
- **field2** — Description

---

## Applicability

| Issue Type | Applies? |
|------------|----------|
| Story      | ✅ Yes   |
| Task       | ❌ No    |
| Bug        | ✅ Yes   |

---

## Instructions

[Step-by-step process]

---

## Output

- **output_field1** — Description
- **output_field2** — Description
```

**Why this structure:**
- **Purpose** clarifies intent (for code review)
- **Config references** make dependencies explicit (for maintenance)
- **Input** defines the contract (for orchestrator writers)
- **Applicability** prevents misuse (for error prevention)
- **Instructions** are the skill logic (for the agent)
- **Output** completes the contract (for downstream skills)

---

### Input/Output Contracts

Skills are **composable** because they have clear contracts. When you write a skill:

1. **Define inputs precisely** — What fields must be present? What are the types/constraints?
2. **Document outputs precisely** — What fields will be returned? What are the types/constraints?
3. **Never assume prior state** — Every skill should be runnable independently (given inputs)
4. **Never mutate external state** — Skills produce output; they don't modify shared files or config

**Example (Good Contract):**

```
## Input
- **canonical_issue** — The normalized issue object (see schema.md)
- **issue_type** — One of: Story, Task, Bug

## Output
- **finding** — Description of the problem, or null if the check passes
- **severity** — "critical", "major", "minor", or null
```

**Example (Bad Contract):**

```
## Input
- **issue** — Some issue data

## Output
- **result** — The findings
```

The bad example is vague. Downstream skills won't know what to expect.

---

### Skill Size Heuristic

| Size | What to Do |
|------|-----------|
| <50 lines | Good. Ship it. ✅ |
| 50-100 lines | OK. Consider splitting if there are two distinct jobs. ⚠️ |
| >100 lines | Split into main skill + REFERENCE file. The main skill stays lean; advanced content loads on demand. ❌ |

### Progressive Disclosure

When a skill or config file exceeds 100 lines, apply progressive disclosure:

1. Keep the **frequently-referenced core** in the main skill file
2. Move **detailed examples, formatting rules, and edge cases** to a `REFERENCE.md` file inside the skill's directory
3. The main file links to the reference: "See [REFERENCE.md](REFERENCE.md) for examples"

```
skills/
└── validate-ac-quality/
    ├── SKILL.md                 # Lean core (<100 lines)
    ├── REFERENCE.md             # Detailed examples, loaded on demand
    └── scripts/
        └── validate-gherkin.js
```

**Why:** Smaller files mean fewer tokens loaded into context on every run. Most invocations only need the quick rules — detailed examples are loaded only when the skill specifically needs them.

### Deterministic Scripts

When a skill includes logic that doesn't require LLM judgment, extract it into a co-located script:

```
skills/
└── validate-ac-quality/
    ├── SKILL.md                 # Main skill (references script)
    └── scripts/
        └── validate-gherkin.js  # Deterministic format check
```

Every skill is a directory — even those without scripts. This keeps the structure consistent:

```
skills/
├── analyze-input-type/
│   └── SKILL.md
├── validate-ac-quality/
│   ├── SKILL.md
│   └── scripts/
│       └── validate-gherkin.js
└── validate-completeness/
    ├── SKILL.md
    └── scripts/
        └── check-completeness.js
```

| Use scripts for | Keep in LLM skills |
|-----------------|-------------------|
| Format validation (Gherkin structure) | Semantic quality (testability, coherence) |
| Field presence checks (missing/placeholder) | Context-dependent completeness |
| Schema compliance | Judgment about sufficiency |
| Consistent transformations | Creative rewriting |

**Why:** Scripts save tokens (no re-interpreting rules), improve reliability (same input → same output), and are faster. The skill calls the script first, then applies LLM judgment only to ambiguous cases.

**Co-location rule:** Scripts live inside the skill's directory, not in a global `scripts/` folder. This keeps each skill self-contained — everything it needs is in one place.

---

## Orchestrator Design

### What is an Orchestrator?

An orchestrator is a **recipe** — it chains skills together in a specific order, manages state between them, and defines pause points (where user input is needed).

**Principle:** An orchestrator is the *only* place where sequencing decisions live. Skills never call other skills.

---

### Orchestrator Naming Convention

| Pattern | Example | Purpose |
|---------|---------|---------|
| `orchestrate-{domain}` | `orchestrate-craft`, `orchestrate-assess-single` | Main workflows for a domain |
| `orchestrate-{verb}` | `orchestrate-assess-refinement` | Specialized workflows (batch processing, etc.) |

---

### When to Create a New Orchestrator

Use this decision tree:

```
Is this a new entry point? (Will users type a new command?)
  ├─ YES → Create new orchestrator ✅
  │         Define it in entry-points.md
  │
└─ NO → Is this a variation of an existing orchestrator?
         ├─ YES → Modify existing orchestrator (add conditional logic) ⚠️
         └─ NO  → This is probably a new skill, not a new orchestrator ❌
```

**Examples:**

- ✅ **Create new orchestrator** when:
  - You want `/assess-scope` (assess just one aspect of an issue)
  - You want `/extract-from-transcript` (new workflow)

- ⚠️ **Modify existing** when:
  - You want to support Task validation in `/craft` (already does, via conditional logic)
  - You want to skip optional steps (add `if` logic)

- ❌ **Neither** when:
  - You're just adding a new validation check (that's a new skill, not orchestrator)

---

### Orchestrator Structure

Every orchestrator file has this structure:

```markdown
# Orchestrator: [Name]

**Purpose:** What workflow does this orchestrate?

**Entry point:** `/command [params]`

---

## When to use

- Scenario 1
- Scenario 2

---

## Flow

[ASCII diagram showing step sequence and parallelization]

---

## Detailed Steps

### Step X — [What this does]
**Read:** `skills/skill-name/SKILL.md`

[Instructions and decision logic]

Carry forward: **state_field_1**, **state_field_2**
```

---

### State Management in Orchestrators

Orchestrators **carry state** between skills. Each step produces output that becomes input to the next step.

**Pattern:**

```
Step 1: analyze-input-type
  Output: issue_type, type_confidence
         ↓ (carry forward)
Step 2: fetch-required-templates
  Input: issue_type
  Output: template_structure
         ↓ (carry forward)
Step 3: ...
```

**Rules:**

1. **Name state explicitly** — Use `snake_case` names. Examples: `canonical_issue`, `validation_findings`, `enriched_issue`.
2. **Document state shape** — Reference `schema.md` for complex objects.
3. **Never lose state** — If a skill needs data from Step 1, don't forget to carry it forward through every step.
4. **Filter as you go** — If Step 2 only needs part of Step 1's output, be explicit: "Carry forward: **issue_type** (ignore issue_mode and type_confidence)."

---

### Parallelization in Orchestrators

Parallel steps are marked with:

```
Step 3-5: Run in parallel
    ├─ Step 3: task A
    └─ Step 4: task B
    ↓ (wait for both to complete)
Step 6: ...
```

**Rules:**

1. **Parallel tasks must be independent** — They can't depend on each other's output.
2. **Document the dispatch** — Show how to launch background agents (see `orchestrate-craft.md` Step 6 for example).
3. **Document the merge** — Show how to combine results after all agents complete.

### Shared Reference Files (DRY Dispatch)

When multiple orchestrators share the same logic pattern, extract it into a `REFERENCE-*.md` file:

```
orchestrators/
├─ orchestrate-craft.md              # References dispatch pattern
├─ orchestrate-assess-single.md      # References dispatch pattern
├─ orchestrate-assess-refinement.md  # References dispatch pattern
└─ reference-validation-dispatch.md  # Defines the pattern once
```

**Why:** Changes to dispatch logic (adding a new validator, changing the combine format) happen in one place. Orchestrators stay focused on their unique flow rather than repeating boilerplate.

**When to extract:** If the same logic block appears in 2+ orchestrators with only minor variations, extract it.

---

## Configuration Design

### Config File Purpose

| File | Controls |
|------|----------|
| `config/project.md` | Which Jira projects/statuses to track, default board columns |
| `config/quality-standards.md` | Validation rules, AC formatting standards, problem statement rules |
| `config/personas.md` | Known user roles and characteristics |
| `config/output-preferences.md` | What output to show/hide, style rules |
| `config/mcp.md` | External service connections (Jira, Confluence) |

### When to Add New Config

**Use config when:**
- The value changes per project or environment
- Multiple skills reference the same data
- You want BAs to be able to adjust behavior without reading skill code

**Use skill code when:**
- The logic is specific to one skill
- The value is a constant (not project-specific)
- You want changes to go through code review

---

## Decision Trees

### "How do I implement this new requirement?"

```
The user wants [feature].

Is this a new workflow entry point?
  ├─ YES → Create new orchestrator
  │         Reference it in entry-points.md
  │         Chain existing and/or new skills
  │
  └─ NO → Does this require new logic?
          ├─ YES, single concern
          │  └─ Create new skill
          │     Update applicable orchestrators to call it
          │
          ├─ YES, multiple concerns
          │  └─ Create 2-N skills
          │     Create/update orchestrator to chain them
          │
          └─ NO → Modify existing skill or config
                  Update applicable tests
```

### "Should I modify a skill or create a new one?"

```
I want to add behavior [X] to the system.

Does this change apply to multiple issue types?
  ├─ NO, only Stories
  │  └─ Add to applicable Story-specific skill
  │
  └─ YES, Stories, Tasks, and Bugs
     Does this require different logic per type?
     ├─ NO → Add to a general-purpose skill (e.g., normalize-issue-context)
     └─ YES → Create a new skill that handles all types conditionally
```

### "This orchestrator is getting complex. Should I split it?"

```
My orchestrator has N steps. Is it getting hard to understand?

Is it >25 steps?
  ├─ YES → Split into 2-3 orchestrators ✅
  └─ NO → Is there a clear logical boundary where one workflow ends and another begins?
          ├─ YES → Split there ✅
          └─ NO → Keep together, but add clear comments ⚠️
```

---

## Checklist: Adding a New Skill

- [ ] Skill has YAML frontmatter with `name` and `description` (includes "Use when..." trigger)
- [ ] Skill does **one thing** (test: can you explain it in one sentence?)
- [ ] Skill name follows naming convention (fetch-, validate-, analyze-, produce-, etc.)
- [ ] Skill file includes: Purpose, Input, Output, Applicability, Instructions
- [ ] Input/output contracts are **precise** (not vague)
- [ ] Skill references applicable `config/` files
- [ ] Skill is <100 lines (if not, split into main + REFERENCE file)
- [ ] Deterministic logic extracted to `scripts/` where applicable
- [ ] At least one orchestrator calls this skill
- [ ] Orchestrator updated to carry state forward

---

## Checklist: Adding a New Orchestrator

- [ ] Orchestrator has YAML frontmatter with `name` and `description` (includes "Use when..." trigger)
- [ ] Orchestrator solves a clear user problem (one entry point, one workflow)
- [ ] Orchestrator name follows convention (orchestrate-{domain} or orchestrate-{verb})
- [ ] Entry point defined in `entry-points.md`
- [ ] Flow diagram shows all steps, pause points, and parallelization
- [ ] Each step references a skill file
- [ ] State is carried forward explicitly ("Carry forward: X, Y")
- [ ] Shared patterns reference REFERENCE files (don't duplicate dispatch logic)
- [ ] Parallel steps are documented with dispatch and merge instructions
- [ ] Orchestrator is <50 steps (if more, consider splitting)

---

## Related Documents

- [schema.md](schema.md) — Exact shapes of data structures
- [architecture.md](architecture.md) — System overview
- [entry-points.md](entry-points.md) — User-facing commands
- [skills/README.md](skills/README.md) — Skill file templates
- [orchestrators/README.md](orchestrators/README.md) — Orchestrator overview
