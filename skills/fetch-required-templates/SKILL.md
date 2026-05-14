---
name: fetch-required-templates
description: Read Jira issue template for a given type from local cache, auto-fetching via MCP when missing. Use when preparing to draft or validate an issue.
---

# Skill: Fetch Required Templates

**Purpose:** Read issue template for the determined type from local cache (`.cache/templates/`). If cache is empty, auto-fetch from Jira via MCP, write to cache, then return. Cache is gitignored — prepopulated via `/refresh-templates` or first use.

**Config references:**
- `config/project.md` — Template issue keys and Playbook page ID
- `.cache/templates/` — Local cache directory

---

## Input

- **issue_type** — Determined issue type: Story, Task, or Bug
- **fetch_playbook** — Whether to also fetch Quality Management Playbook (true for Bugs, false otherwise)

---

## Instructions

### Read-through cache logic

For each template needed:

1. Check cache at `.cache/templates/{type}.md` (e.g. `.cache/templates/story.md`).
2. If file exists and has content: read it, extract template structure, return.
3. If file missing or empty: fetch from Jira via MCP using key from `config/project.md`, write raw content to cache file, then extract and return.

For playbook (`fetch_playbook` is true):

1. Check cache at `.cache/templates/playbook.md`.
2. Same read-through logic using Confluence page ID from `config/project.md`.

### Extraction (same for cached or freshly fetched)

From template, extract:
- All field names and descriptions
- Placeholder text or formatting instructions in description body
- Required vs optional field distinctions

From playbook: extract classification and severity rules.

### Failure handling

Any fetch fails: report which resource failed and cache state. Pipeline can proceed with cached data if available. If no cache exists and fetch fails, block.

---

## Output

- **template_structure** — Extracted field structure for relevant issue type
- **playbook_reference** — Quality Management Playbook content (only when fetched)
- **fetch_success** — Whether all required data is available
- **cache_hit** — true if read from cache, false if fetched fresh
