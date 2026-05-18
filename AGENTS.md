# Agent Workflow Rules

Instructions for how the AI agent operates during implementation.

## Parallel dispatch for independent work

When implementing changes across multiple independent files (no shared state, no sequential dependency), dispatch them as parallel sub-agents instead of serializing edits in the main thread.

**When to use:**
- N files to edit that don't overlap in content
- Reading N independent files for reference
- Running N independent commands or checks

**When NOT to use:**
- Edits to the same file from different tasks
- Steps where task B needs task A's output
- Very small changes (1-2 files, trivial edits) — overhead isn't worth it

**Pattern:**
```
Task(description="short-name", prompt="detailed task", subagent_type="general")
```

Launch all independent tasks in one turn. Collect results. Merge and verify.

## Plan-first on complex changes

Before implementing changes touching 3+ files or a new concept, emit a short numbered plan (3 lines max) so the user can correct course before tokens are spent on implementation.

## Verify config edits persist

After editing config files (`opencode.json`, agent definitions, skill files), always re-read the file to confirm the change was actually saved. The edit tool may report success but the change can fail silently if the file content doesn't match what was read.

```
edit(file)  →  read(file) to verify  →  proceed
```

## Confluence: resolve duplicate titles before renaming

Confluence requires unique page titles within the same parent. The API error message for a duplicate title is misleading: *"No space or no content type, or setup a wrong version type set to content, or status param is not draft and status content is current"*. 

When renaming a page to a name that already exists under the same parent, first rename the existing page to `[TO-DELETE] <original title>`, then apply the new title.
