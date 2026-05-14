# Skills

Skills are the building blocks of the BA Operating System. Each skill does **one thing** and does it well — like a specialist you can call on when needed.

> **New to this system?** Think of skills like individual tools in a toolbox. A hammer drives nails, a screwdriver turns screws. You don't use them all at once — you pick the right ones for the job. [Orchestrators](../orchestrators/README.md) are the instructions that tell you which tools to use and in what order.

---

## How skills work

1. **You never run a skill directly.** Orchestrators chain skills together in the right order for your task.
2. **Each skill has a clear input and output.** It knows what it needs to receive and what it produces.
3. **Skills read from configuration.** Project-specific settings live in `/config` — skills stay generic and reusable.
4. **Skills don't know about each other.** They don't call other skills or decide what runs next. That's the orchestrator's job.

---

## Skill inventory

### Fetching skills
These retrieve data from external systems (Jira, Confluence) via [MCP](../glossary.md#mcp).

| Skill | Purpose |
|-------|---------|
| [`fetch-issue-by-key`](fetch-issue-by-key/SKILL.md) | Fetch a single Jira issue by its key |
| [`fetch-issues-by-status`](fetch-issues-by-status/SKILL.md) | Fetch all issues from configured project columns |
| [`fetch-required-templates`](fetch-required-templates/SKILL.md) | Fetch the right issue template based on issue type |

### Analysis skills
These examine input to determine what it is and prepare it for processing.

| Skill | Purpose |
|-------|---------|
| [`analyze-input-type`](analyze-input-type/SKILL.md) | Determine if the input is a Story, Task, or Bug |
| [`normalize-issue-context`](normalize-issue-context/SKILL.md) | Transform any input format into a standard shape |

### Interaction skills
These involve direct communication with you.

| Skill | Purpose |
|-------|---------|
| [`ask-clarification-questions`](ask-clarification-questions/SKILL.md) | Ask targeted questions before writing a draft |

### Production skills
These create or improve issue content.

| Skill | Purpose |
|-------|---------|
| [`produce-issue-draft`](produce-issue-draft/SKILL.md) | Write a complete issue draft from the template |
| [`propose-child-breakdown`](propose-child-breakdown/SKILL.md) | Analyse a Request and propose a breakdown into child issues |
| [`revise-draft-from-findings`](revise-draft-from-findings/SKILL.md) | Improve a draft based on validation feedback |

### Validation skills
These check specific quality aspects of an issue. They all operate on the same standardised input format (produced by `normalize-issue-context`).

| Skill | Purpose | Applies to |
|-------|---------|------------|
| [`validate-problem-framing`](validate-problem-framing/SKILL.md) | Is this grounded in a real user need? | Story, Bug |
| [`validate-scope`](validate-scope/SKILL.md) | Is this trying to do too much? | All types |
| [`validate-ac-quality`](validate-ac-quality/SKILL.md) | Are acceptance criteria testable and coherent? | All types |
| [`validate-ac-uiux-trap`](validate-ac-uiux-trap/SKILL.md) | Are criteria describing outcomes, not interfaces? | Story, Bug |
| [`validate-completeness`](validate-completeness/SKILL.md) | Are all required fields filled? | All types |
| [`validate-persona`](validate-persona/SKILL.md) | Is the persona specific, and do AC differentiate between roles when behaviour differs by role? | Story, Bug |
| [`validate-scenario-coverage`](validate-scenario-coverage/SKILL.md) | Do AC cover unhappy paths and error states, not just the happy path? | Story, Bug |
| [`validate-dependencies`](validate-dependencies/SKILL.md) | Are external dependencies, pending decisions, or cross-team reliances acknowledged? | All types |
| [`validate-design-reference`](validate-design-reference/SKILL.md) | Does the story reference a design file when one is expected? | Story |

### Output skills
These format results for presentation.

| Skill | Purpose |
|-------|---------|
| [`generate-follow-up-questions`](generate-follow-up-questions/SKILL.md) | Create targeted questions from validation gaps |
| [`format-readiness-report`](format-readiness-report/SKILL.md) | Generate readiness reports (single or batch) |

---

## How to read a skill file

Every skill file follows the same structure:

1. **Frontmatter** — YAML metadata (`name`, `description` with "Use when..." trigger)
2. **Purpose** — What the skill does (one sentence)
3. **Config references** — Which configuration files it reads
4. **Input** — What it needs to receive
5. **Applicability** (validation skills only) — Which issue types it applies to
6. **Instructions** — Step-by-step logic the AI follows
7. **Output** — What it produces for downstream skills

### Frontmatter format

Every skill begins with YAML frontmatter:

```yaml
---
name: skill-name
description: Brief description of capability. Use when [specific triggers].
---
```

The `description` field is critical for agent routing — it must clearly communicate what the skill does and when to use it. Keep it under 1024 characters. The "Use when..." sentence provides explicit triggers.

---

## Adding a new skill

1. Create a new directory in `skills/` named after the skill (kebab-case)
2. Add a `SKILL.md` file inside (e.g., `skills/my-skill/SKILL.md`) — the directory name IS the skill identity
3. Add YAML frontmatter with `name` and `description` (include "Use when..." trigger)
4. Follow the structure above (Purpose → Config → Input → Instructions → Output)
5. If the skill includes deterministic logic (formatting validation, field checking), add a co-located `scripts/` directory:
   ```
   skills/
   └── my-skill/
       ├── SKILL.md           # Main skill instructions
       └── scripts/
           └── helper.js      # Deterministic logic
   ```
6. Keep the skill under 100 lines. If it exceeds this, split reference material into a `REFERENCE.md` file inside the skill's directory
7. Add the skill to the inventory table in this README
8. Reference it in any orchestrators that should use it
9. Update the [Architecture guide](../architecture.md) if the skill introduces a new category
