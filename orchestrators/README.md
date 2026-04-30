# Orchestrators

Orchestrators are the "recipes" of the BA Operating System. They chain [skills](../skills/README.md) together in the right order to accomplish a specific task.

> **New to this system?** Think of orchestrators like a recipe in a cookbook. The recipe doesn't teach you how to chop an onion — it tells you _when_ to chop it and what to do next. Skills are the individual techniques; orchestrators are the recipes that combine them. See the [Glossary](../GLOSSARY.md#orchestrator) for more.

---

## How orchestrators work

1. **Each orchestrator defines a sequence of skills** to execute, in order.
2. **Orchestrators carry state** between skills — the output of one skill becomes the input of the next.
3. **Some steps pause for your input** (marked with ⏸️). The system will ask you a question and wait before continuing.
4. **Orchestrators read configuration** from `/config` — they never hardcode project-specific values.
5. **Orchestrators do not contain skill logic.** They reference skill files by path and describe only the glue: sequencing, state, and pauses.

---

## Available orchestrators

| Orchestrator                                                        | Entry point          | Purpose                                                              | When to use                            |
| ------------------------------------------------------------------- | -------------------- | -------------------------------------------------------------------- | -------------------------------------- |
| [`orchestrate-help`](orchestrate-help.md)                           | `/help`              | Get guidance on which command to use                                 | You're unsure which entry point to run |
| [`orchestrate-craft`](orchestrate-craft.md)                         | `/craft`             | Shape an idea, draft, or Jira issue into a complete, validated issue | Day-to-day issue writing               |
| [`orchestrate-assess-single`](orchestrate-assess-single.md)         | `/assess [key]`      | Assess one issue for refinement readiness                            | Quick check on a specific issue        |
| [`orchestrate-assess-refinement`](orchestrate-assess-refinement.md) | `/assess-refinement` | Assess all issues in configured columns                              | Before a refinement session            |

---

## Choosing the right orchestrator

**"I want to write or improve an issue"** → Use `/craft`

- Start with an idea, a draft, or a Jira issue key
- The system asks clarifying questions, produces a draft, validates it, and suggests improvements

**"Is this specific issue ready for refinement?"** → Use `/assess [PROJECT-1234]`

- Provide a single Jira issue key
- Get a detailed readiness report without fetching other issues

**"What is ready for our next refinement session?"** → Use `/assess-refinement`

- No input needed — uses the projects and statuses from your configuration
- Get a summary table of all issues plus detailed breakdowns for anything not ready

---

## Adding a new orchestrator

1. Create a new `.md` file in this directory
2. Define the flow: which skills run, in what order, with what state
3. Mark any pause points where user input is needed
4. Add the orchestrator to the table in this README
5. Define an entry point command in `entry-points.md`
6. Update the [Architecture guide](../ARCHITECTURE.md) if the orchestrator represents a new capability
