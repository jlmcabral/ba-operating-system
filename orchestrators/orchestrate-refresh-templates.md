---
name: orchestrate-refresh-templates
description: Fetch all issue templates and playbook from Jira/Confluence and populate local cache. Run when templates change upstream or cache is empty.
---

# Orchestrator: Refresh Template Cache

**Purpose:** Fetch all issue templates (Story, Task, Bug) and Quality Management Playbook from Jira/Confluence and write to `.cache/templates/`. Jira-backed template cache files include `issue_type` frontmatter. Idempotent — safe to re-run at any time.

**Entry point:** `/refresh-templates`

---

## When to use

- On first setup — cache is empty after fresh clone
- When templates or playbook change upstream (you changed the issue template structure in Jira or Confluence)
- After `config/project.md` template keys changed
- Cache debugging — force refresh to rule out stale data

---

## Flow

```
Step 1: Read config/project.md for template keys and playbook page ID
    ↓
Step 2: Fetch all templates via MCP (PARALLEL)
    ├─ Fetch Story template (BAIKAL-1164)
    ├─ Fetch Task template (BAIKAL-1544)
    ├─ Fetch Bug template (BAIKAL-1390)
    └─ Fetch Quality Management Playbook (Confluence 1922147829)
    ↓ (wait for all to complete)
Step 3: Write each to .cache/templates/{type}.md
    ↓
Step 4: Report results — which succeeded, which failed (if any)
```

---

## Detailed Steps

### Step 1 — Read config
**Read:** `config/project.md`

Identify template issue keys for Story, Task, Bug, and playbook Confluence page ID.

Carry forward: **template_keys** (map of type → Jira key), **playbook_page_id**.

### Step 2 — Fetch all via MCP (Parallel)
**Read:** `skills/fetch-required-templates/SKILL.md`

Launch 4 parallel MCP fetches:
- Story from template key
- Task from template key
- Bug from template key
- Playbook from Confluence page ID

Use Atlassian MCP server. For Story, Task, and Bug template issues, use `mcp-atlassian_jira_get_issue` with `fields` set to `summary,description,issuetype`. Launch all fetches in parallel — don't wait between launches.

If any fails: note which, continue with the rest.

### Step 3 — Write cache
For each successfully fetched template:
1. For Jira-backed templates, write `.cache/templates/{type}.md` with YAML frontmatter containing `issue_type`, followed by the raw template body. For the Confluence playbook, write raw content to `.cache/templates/playbook.md`.
2. Overwrite existing file if present

### Step 4 — Report
Summarise:
- ✅ / ❌ per template
- How many files written
- Any failures and suggested action

---

## Output

- **Refresh results** — Per-template status: fetched, written, or failed
