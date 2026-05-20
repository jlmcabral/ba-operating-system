# Agent Workflow Rules

Instructions for how the AI agent operates during implementation.

## Parallel work with sub-agents

When a task decomposes into independent scopes, dispatch sub-agents in parallel
instead of serializing in the main thread. Two modes, chosen by whether the
scopes touch overlapping files.

**When NOT to sub-agent:**
- Very small changes (1-2 files, trivial edits) — orchestration overhead isn't worth it
- Steps where task B needs task A's output

### Mode 1 — Single worktree (files don't overlap)

Each sub-agent edits different files. They can safely share the current
worktree on the same branch.

**When to use:**
- N files to edit that don't overlap in content
- Reading N independent files for reference
- Running N independent commands or checks

**Pattern:**
```
Task(description="short-name", prompt="detailed task", subagent_type="general")
```

Launch all tasks in one turn. Collect results. Merge and verify.

### Mode 2 — Git worktrees (files overlap)

When two sub-agents need to edit the same files with different changes, use
git worktrees to give each agent an isolated checkout on its own branch.

**When to use:**
- Two or more agents modifying the same files concurrently
- A long-running agent whose intermediate state shouldn't block other work
- Experiments or spikes that should be easy to discard

**Pattern:**

```
1. Create worktree per scope:
     git worktree add ../<repo>-<scope-a> HEAD -b scope-a
     git worktree add ../<repo>-<scope-b> HEAD -b scope-b

2. Assign each agent to its worktree directory + branch

3. After all finish, merge sequentially (smallest changes first):
     cd <main-worktree>
     git merge scope-a --no-ff -m "feat: merge scope-a"
     git merge scope-b --no-ff -m "feat: merge scope-b"

4. Clean up:
     git worktree remove ../<repo>-<scope-a>
     git worktree remove ../<repo>-<scope-b>
     git branch -D scope-a scope-b
```

— On conflict, fix in main worktree where the full picture is visible.
— Don't push worktree branches — they're ephemeral, local only.

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
