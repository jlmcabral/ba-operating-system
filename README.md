# BA Operating System

A tool-agnostic, prompt-driven framework for upstream product work. Built for business analysts who want to consistently produce requirements grounded in real user problems — not feature assumptions — and reduce the uncertainty that reaches engineering.

---

## What this is

A set of structured workflows and pipelines that take you from a raw stakeholder meeting all the way to a batch of issues assessed for refinement readiness. Each workflow is a self-contained prompt. Each pipeline chains workflows together into an end-to-end execution with human review gates at critical decision points.

The system is designed to run on any AI tool that supports MCP (Model Context Protocol). It is currently configured for GitHub Copilot in agent mode.

---

## Principles

- **Problem-first.** Features are hypotheses. The system is designed to surface the real problem behind every request before anything is written.
- **Tool-agnostic.** The prompt logic travels to any model — Claude, Copilot, Bedrock, or whatever comes next. Only the agent runtime changes.
- **Human gates, not full automation.** The agent handles structure, fetching, and analysis. You make the decisions about what moves forward.
- **Designed to evolve.** As AI capabilities grow and your process matures, the workflows and pipelines can be extended without rebuilding from scratch.

---

## Repo structure

```
ba-operating-system/
├── .github/
│   └── copilot-instructions.md      # Persistent system prompt for Copilot agent mode
├── workflows/
│   ├── workflow_01_meeting_to_summary.md
│   ├── workflow_02_summary_to_candidate_issues.md
│   ├── workflow_03_issue_crafter.md
│   └── workflow_04_refinement_readiness_review.md
├── pipelines/
│   └── pipeline.md                  # Pipeline definitions and chaining logic
└── README.md
```

---

## Workflows

| #   | Workflow                    | Input                          | Output                                                       |
| --- | --------------------------- | ------------------------------ | ------------------------------------------------------------ |
| 01  | Meeting to Summary          | Raw meeting transcript         | Structured summary with use cases, open questions, decisions |
| 02  | Summary to Candidate Issues | Workflow 01 summary            | Candidate Jira issues with problem framing flags             |
| 03  | Issue Crafter               | Loose idea, draft, or Jira key | Complete, critically reviewed issue draft                    |
| 04  | Refinement Readiness Review | Jira issues by status          | Readiness report — tiered assessment with failure categories |

Each workflow file contains the full prompt, usage instructions, MCP fetch instructions, and a versioning table.

---

## Pipelines

Three pipelines are available, each suited to a different moment in your working day.

| Pipeline           | Workflows             | Best for                                                                     |
| ------------------ | --------------------- | ---------------------------------------------------------------------------- |
| Full pipeline      | W01 → W02 → W03 → W04 | After a stakeholder meeting — full cycle from transcript to readiness report |
| Craft pipeline     | W03 → W04             | Day-to-day story writing — shaping and validating one issue at a time        |
| Readiness pipeline | W04                   | Pre-refinement check — assess everything currently in scope on the board     |

Full pipeline and chaining logic is defined in `pipelines/pipeline.md`.

---

## How to run a workflow (manually)

Use this approach when you want to run a single workflow in isolation — for example, crafting one story without going through the full pipeline.

1. Open GitHub Copilot in VS Code and switch to **agent mode**
2. Copy the full prompt from the relevant workflow file
3. Fill in the input fields (context, mode declaration, transcript or issue content)
4. Send to Copilot — MCP fetches will run automatically at the start
5. Review the output and respond to any follow-up questions or flags

---

## How to run a pipeline

Use this approach for end-to-end execution across multiple workflows.

1. Open GitHub Copilot in VS Code in **agent mode**
2. Make sure your Jira and Confluence MCP servers are connected and responding
3. Trigger the pipeline with a plain-language instruction:

**Full pipeline:**

```
Run the full pipeline on this transcript: [paste transcript]
```

**Craft pipeline — from an idea:**

```
Run the craft pipeline on this idea: [describe the need loosely]
```

**Craft pipeline — from a Jira issue:**

```
Run the craft pipeline on BAIKAL-1234
```

**Readiness pipeline:**

```
Run the readiness pipeline
```

Copilot will read `pipelines/pipeline.md`, identify the correct pipeline, and begin executing. It will pause at every human review gate and wait for your confirmation before continuing.

---

## MCP servers required

The following MCP servers must be connected for tool-dependent steps to work:

| Server                                                   | Used for                                                                                                 |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [mcp-atlassian](https://mcp-atlassian.soomiles.com/docs) | Fetching issue templates, fetching issues by key or status, querying projects, fetching confluence pages |

Workflows that require MCP will not proceed if a fetch fails — they will report the failure and reason first.

### Verifying your MCP connection

Before running a pipeline for the first time, confirm the mcp server is responding:

```
Fetch Jira issue BAIKAL-1164 and tell me its title and description structure
```

If both return real data, you are ready to run pipelines.

---

## Jira issue templates

Templates are always fetched fresh via MCP before any issue is generated or assessed. Do not rely on cached content — templates may change.

For now, the workflows are configured to use only for Astro templates. However, since the template's description is the same regardless of the application we're working, this setup is enough for now.

| Type  | Issue key   |
| ----- | ----------- |
| Story | BAIKAL-1164 |
| Task  | BAIKAL-1544 |
| Bug   | BAIKAL-1390 |

---

## Gherkin formatting standard

All acceptance criteria across all workflows must follow this format:

```
Scenario: [short descriptive title]

**Given** [precondition]
And [additional precondition if needed]
**When** [action]
**Then** [expected outcome]
And [additional outcome if needed]
```

Rules:

- Each step keyword (**Given**, **When**, **Then**, **And**) on its own line
- Step keywords in **bold**, the rest of the sentence not bold
- One blank line between scenarios

---

## Workflow 03 — entry modes

The Issue Crafter (Workflow 03) supports three entry points. Declare the mode at the top of your input:

| Mode    | When to use                                    | How to declare |
| ------- | ---------------------------------------------- | -------------- |
| `idea`  | You have a rough direction but nothing written | `MODE: idea`   |
| `draft` | You have a partial draft or Workflow 02 output | `MODE: draft`  |
| `jira`  | You have an existing Jira issue to improve     | `MODE: jira`   |

---

## Workflow 04 — readiness tiers and failure categories

The Refinement Readiness Review produces two dimensions per issue:

**Readiness tier** — can this go to refinement?

| Tier                | Meaning                                        |
| ------------------- | ---------------------------------------------- |
| ✅ Ready            | Present with confidence                        |
| ⚠️ Needs Minor Work | One or two issues — fixable before the session |
| ❌ Not Ready        | Critical blocker — return to Workflow 03       |

**Failure categories** — what type of problem does it have?

| Category           | Critical blocker               |
| ------------------ | ------------------------------ |
| 🎯 Problem framing | Yes                            |
| 📐 Scope           | Yes                            |
| ✅ AC — quality    | Yes if majority fail           |
| 🖥️ AC — UI/UX trap | Yes if majority fail           |
| 📋 Completeness    | Yes if required fields missing |
| 👤 Persona gap     | No — observational only        |

Persona gap never affects the readiness tier in this context. The application has a limited, well-known user base. This will be reassessed after real usage.

---

## Future workflows planned

| #   | Workflow                                     | Purpose                                                                                                                                           |
| --- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 05  | Documentation Audit and enhancement proposal | Review Confluence pages and surface drift, buried decisions, and missing context. Propose changes to existing documentation based on requirements |
