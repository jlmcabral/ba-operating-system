---
name: manage-wiki-content
description: Manage Confluence wiki content with consistent labeling, linking, and placement conventions. Use when creating, updating, or auditing Confluence pages.
---

# Skill: Manage Wiki Content

**Purpose:** Create, update, or audit Confluence pages with consistent labeling, page-linking, and placement conventions driven by project configuration.

**Config references:**

- `config/wiki-context.md` — Confluence space, page mappings, label taxonomy, and placement rules
- `config/wiki-context.md.example` — Template for other BAs to fill in their own context
- `config/mcp.md` — MCP server details

---

## Input

- **action** — `create`, `update`, `audit`, or `label`
- **space_key** — Confluence space key (from config)
- **parent_id** — Parent page ID for new pages (resolved from config)
- **title** — Page title
- **content** — Page content in Markdown format
- **labels** — Optional list of labels to apply (skill will suggest if not provided)
- **page_id** — Required for `update`, `audit`, and `label` actions

---

## Confluence Context

Read from `config/wiki-context.md`.

The config provides:

- Space key and base URL
- Documentation root page (title and ID)
- Section mappings (section title → page ID → scope label)
- Label taxonomy (scope, content-type, version, cleanup, deferred)
- Page placement rules
- Reference pages (e.g., taxonomy documentation page)

**Never hard-code page IDs, section names, or label values.** Always read them from config.

---

## Taxonomy, Placement, and Linking

All labeling rules, scope/content-type/deferred labels, page placement rules, and page-linking conventions are defined in `config/wiki-context.md`. This skill reads and follows them — it does not maintain its own copy.

---

## Instructions by Action

### create

1. Read `config/wiki-context.md`.
2. Determine the correct parent section from the config placement rules.
3. Resolve the parent page ID from the config section mappings.
4. Determine labels from the config taxonomy based on parent section and content meaning.
5. Use `mcp-atlassian_confluence_create_page` with `content_format: "markdown"`.
6. Apply labels using `mcp-atlassian_confluence_add_label` for each label.
7. Return the created page URL and applied labels.

### update

1. Read `config/wiki-context.md`.
2. Fetch the current page with `mcp-atlassian_confluence_get_page`.
3. Update content using `mcp-atlassian_confluence_update_page` with `content_format: "markdown"`.
4. Review labels — add missing ones based on config taxonomy. Do not remove existing labels unless explicitly requested.
5. Return the updated page URL and final label set.

### label

1. Read config as above.
2. Fetch the current page labels with `mcp-atlassian_confluence_get_labels`.
3. Determine missing labels from the config taxonomy based on page location and content.
4. Apply missing labels using `mcp-atlassian_confluence_add_label`.
5. Return the final label set.

### audit

1. Read config as above.
2. Fetch the page hierarchy under the target parent using `mcp-atlassian_confluence_get_page_children` or `mcp-atlassian_confluence_get_space_page_tree`.
3. For each page, fetch labels with `mcp-atlassian_confluence_get_labels`.
4. Compare actual labels against expected labels from the config taxonomy.
5. Return a report: pages with correct labels, pages missing labels, pages with unexpected labels.

---

## Output

- **success** — Whether the action succeeded
- **page_url** — URL of the affected page (for `create`, `update`, `label`)
- **labels_applied** — List of labels applied
- **report** — Audit report (for `audit` action)
- **error** — `null` on success, otherwise structured failure details
