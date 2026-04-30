# Glossary

This page explains the technical terms used throughout the BA Operating System. If you encounter a term you don't recognise in any README or configuration file, you'll find it here.

---

## Terms

### API Token {#api-token}

A password-like code that lets the system connect to services like Jira on your behalf. Unlike your actual password, an API token can be revoked without changing your login credentials. You generate one from your Atlassian account settings.

**Where it is used:** In the `.env` file to authenticate with Jira and Confluence. The `.env` file is git-ignored so your token never leaves your computer.

### Acceptance Criteria {#acceptance-criteria}

A list of conditions that must be true for an issue to be considered "done." In this system, acceptance criteria are written in [Gherkin](#gherkin) format. They describe what should happen (outcomes), not how the interface should look.

### Canonical Schema {#canonical-schema}

A standardised format that all skills expect to receive. No matter how an issue starts (as a rough idea, a Jira issue, or a pasted draft), the system converts it into this consistent shape before processing it. This means each skill only needs to understand one input format.

**Why it matters:** Without this, every skill would need to handle every possible input format — making the system fragile and hard to maintain.

### Configuration {#configuration}

The settings files in the `/config` directory that control how the system behaves for your specific projects. These include which Jira projects to work with, what quality rules to apply, and which user personas exist.

### Confluence {#confluence}

Atlassian's documentation platform. This system fetches reference documents (like the Quality Management Playbook) from Confluence pages.

### Entry Point {#entry-point}

A command you type to start a task. For example, `/craft` or `/assess-refinement`. Entry points trigger [orchestrators](#orchestrator) which do the actual work.

### Gherkin {#gherkin}

A structured format for writing acceptance criteria using keywords like **Given**, **When**, and **Then**. It reads like plain English but follows a specific pattern that makes criteria testable and unambiguous.

**Example:**

```
**Scenario 1: User filters results by date range**

**Given** the user is on the search results page
And the list of caremaps has 2 results
**When** they select a start date and an end date
**Then** only results within that date range are displayed
And the the results are selectable.
```

### Git / GitHub {#git}

Git is a version control system that tracks changes to files over time. GitHub is a platform for hosting Git repositories (project folders). This BA Operating System lives in a GitHub repository so that changes are tracked and multiple people can collaborate.

### `.gitignore` {#gitignore}

A file that tells Git which files to ignore — meaning they won't be uploaded to GitHub. The `.env` file (which contains your credentials) is listed here so your API tokens never accidentally end up online.

### Jira {#jira}

Atlassian's issue tracking platform. This system creates and assesses Jira issues (stories, tasks, bugs) as part of the business analysis workflow.

### MCP (Model Context Protocol) {#mcp}

A standard that lets AI assistants connect to external tools and services. Think of it as a "plug" that connects the AI to Jira, Confluence, or other systems so it can read and write data on your behalf.

**Why you need it:** Without MCP, the AI cannot access your Jira issues or Confluence pages. With MCP connected, the AI can fetch issue templates, read existing issues, and retrieve reference documentation — all automatically.

**How it works in practice:** You configure an MCP server (like `mcp-atlassian`) once in your environment. After that, skills can instruct the AI to "fetch Jira issue PROJECT-1234" and it happens automatically.

### Orchestrator {#orchestrator}

A set of instructions that chains [skills](#skill) together in order. An orchestrator is like a recipe — it doesn't teach you how to chop an onion, it tells you when to chop it and what to do next.

**Example:** The `/craft` orchestrator runs: analyse input → fetch template → ask questions → write draft → validate → revise.

### Readiness Tier {#readiness-tier}

A rating given to a Jira issue after assessment:

- ✅ **Ready** — Can go to refinement as-is
- ⚠️ **Needs Minor Work** — Small fixes needed, not blocked
- ❌ **Not Ready** — Critical issues that would waste the team's time in refinement

### Repository {#repository}

A project folder tracked by [Git](#git). This BA Operating System is a repository containing all the skills, orchestrators, configuration, and documentation.

### Skill {#skill}

A single-purpose building block that does one thing well. For example, "validate acceptance criteria quality" or "fetch a Jira issue." Skills don't know about each other — [orchestrators](#orchestrator) decide which skills run and in what order.

### Template {#template}

A Jira issue that defines the required structure for a specific issue type (Story, Task, or Bug). The system fetches these from Jira to know which fields to populate and what format to follow.
