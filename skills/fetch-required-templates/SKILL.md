---
name: fetch-required-templates
description: Read Jira issue template for a given type from local cache, auto-fetching via MCP when missing. Use when preparing to draft or validate an issue.
---

# Skill: Fetch Required Templates

**Purpose:** Read issue template for the determined type from local cache (`.cache/templates/`). If cache is empty, auto-fetch from Jira via MCP, write to cache with `issue_type` frontmatter, then return. Cache is gitignored — prepopulated via `/refresh-templates` or first use.

**Config references:**
- `config/project.md` — Template issue keys and Playbook page ID
- `.cache/templates/` — Local cache directory

---

## Input

- **issue_type** — Determined issue type: Story, Task, Bug, or Request
- **fetch_playbook** — Whether to also fetch Quality Management Playbook (true for Bugs, false otherwise)

---

## Instructions

### Read-through cache logic

For each template needed:

1. Check cache at `.cache/templates/{type}.md` (e.g. `.cache/templates/story.md`).
2. If file exists and has content: read it, parse YAML frontmatter if present, strip frontmatter from the body, extract template structure, return.
3. If file missing or empty: fetch from Jira via MCP using `mcp-atlassian_jira_get_issue` with `fields` set to `summary,description,issuetype`, write the template body to cache with YAML frontmatter containing `issue_type`, then extract and return.

**Request type:** The orchestrator will pass `fetch_required_templates` for Story, Task, and Bug — not for Request itself. The skill handles each child type independently. If `issue_type` is Request, expect the caller to specify which child templates to fetch.

For playbook (`fetch_playbook` is true):

1. Check cache at `.cache/templates/playbook.md`.
2. Same read-through logic using Confluence page ID from `config/project.md`.

### Cache file format for Jira-backed templates

Story, Task, and Bug template cache files should use this format:

```md
---
issue_type: Story
---

<raw template body>
```

The `issue_type` value comes from Jira `issuetype`.

### Extraction (same for cached or freshly fetched)

From template, extract:
- All field names and descriptions
- Placeholder text or formatting instructions in description body
- Required vs optional field distinctions

Set `template_structure.type` from cached `issue_type` frontmatter when present. If freshly fetched, use Jira `issuetype` and write the same value into cache.

From playbook: extract classification and severity rules.

### Failure handling

Any fetch fails: report which resource failed and cache state. Pipeline can proceed with cached data if available. If no cache exists and fetch fails, block.

---

## Output

- **template_structure** — Extracted field structure for relevant issue type
- **playbook_reference** — Quality Management Playbook content (only when fetched)
- **fetch_success** — Whether all required data is available
- **cache_hit** — true if read from cache, false if fetched fresh
