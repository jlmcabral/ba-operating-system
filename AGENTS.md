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
