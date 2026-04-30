# Contributing

This guide explains how to add, modify, or extend the BA Operating System. Whether you are adding a new skill, creating an orchestrator, or updating quality standards, this document shows you how.

---

## Adding a new skill

1. **Create the file:** Add a new directory in `skills/` with a `SKILL.md` file inside. Use kebab-case naming for the directory (e.g., `skills/validate-new-check/SKILL.md`).

2. **Add YAML frontmatter:** Every skill must begin with:
   ```yaml
   ---
   name: skill-name
   description: Brief description of capability. Use when [specific triggers].
   ---
   ```
   The `description` must clearly state what the skill does (first sentence) and when to use it (second sentence with "Use when..."). Max 1024 characters.

3. **Follow the structure:** Every skill must have these sections:
   - **Purpose** — One sentence: what does this skill do?
   - **Config references** — Which config files does it read?
   - **Input** — What does it need to receive?
   - **Instructions** — Step-by-step logic for the AI to follow
   - **Output** — What does it produce?

   For validation skills, also include:
   - **Applicability** — Which issue types does this check apply to?

4. **Consider scripts for deterministic logic:** If the skill includes checks that don't require LLM judgment (format validation, field presence checks), add a co-located `scripts/` directory inside the skill:
   ```
   skills/
   └── my-skill/
       ├── SKILL.md
       └── scripts/
           └── validator.js
   ```
   Skills should call the script first, then apply LLM judgment only to ambiguous cases.

5. **Keep it under 100 lines:** If a skill exceeds 100 lines, split reference material into a `REFERENCE.md` file alongside it. The main skill stays lean; advanced content is loaded on demand.

6. **Update the inventory:** Add your skill to the table in `skills/README.md`.

7. **Reference it in orchestrators:** If an existing orchestrator should use this skill, add it to the orchestrator's flow.

8. **Update architecture:** If the skill introduces a new category, update `ARCHITECTURE.md`.

---

## Adding a new orchestrator

1. **Create the file:** Add a new `.md` file in `orchestrators/`.

2. **Add YAML frontmatter:** Same format as skills — `name` and `description` with "Use when..." trigger.

3. **Define the flow:** List which skills run, in what order, with what state passes between them.

4. **Use shared references:** For validation dispatch, reference `orchestrators/REFERENCE-validation-dispatch.md` instead of repeating the pattern inline.

5. **Mark pause points:** If the orchestrator needs user input mid-flow, mark it with ⏸️.

6. **Add an entry point:** Create a command for it in `entry-points.md`.

7. **Update READMEs:** Add it to `orchestrators/README.md` and `ARCHITECTURE.md`.

---

## Modifying quality standards

Quality rules live in `config/quality-standards.md`. This is the **single source of truth** — do not duplicate these rules in skill files.

Detailed examples and formatting references live in `skills/validate-ac-quality/REFERENCE.md` — co-located with the skill that uses them.

When you update a standard:
- The change automatically applies to all skills that reference it
- No skill files need to be edited
- Consider whether the change affects the readiness assessment (if so, verify with `/assess-refinement`)
- If adding examples or detailed formatting rules, put them in the REFERENCE file, not the main standards file

---

## Modifying configuration

- **Project settings** (`config/project.md`) — Change when you add projects, change board statuses, or update template references
- **Personas** (`config/personas.md`) — Change when your user base evolves
- **Output preferences** (`config/output-preferences.md`) — Change when you want to tune verbosity
- **MCP references** (`config/mcp.md`) — Change when you add or change external services

---

## Naming conventions

| Item | Convention | Example |
|------|-----------|---------|
| Skill files | kebab-case | `validate-ac-quality.md` |
| Orchestrator files | `orchestrate-` prefix, kebab-case | `orchestrate-craft.md` |
| Config files | kebab-case | `quality-standards.md` |
| Glossary anchors | lowercase, hyphenated | `{#api-token}` |

---

## Testing changes

After making changes, verify they work:

1. **Skill changes:** Run an orchestrator that uses the skill and check the output
2. **Config changes:** Run `/assess-refinement` to verify the system still picks up the right projects and standards
3. **Orchestrator changes:** Run the entry point command end-to-end

There are no automated tests — validation is manual via running the system and reviewing output.
