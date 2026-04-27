# Workflow 02 — Summary to Candidate Issues

**Purpose:** Transform a structured meeting summary into a set of well-grounded candidate Jira issues, with critical flags that surface feature assumptions, buried decisions, and unclear personas before anything reaches the team.

**When to use:** After Workflow 01 has been run and its summary has been reviewed and approved by you.

**Input required:** The reviewed output of Workflow 01 — Meeting to Summary.

---

## The Prompt

---

## BEFORE YOU BEGIN — Fetch Jira issue templates and required documentation

Before analysing the summary or producing any output, use the Atlassian MCP server to fetch the following issue templates. These define the output format for all candidate issues.

Fetch these three Jira issues:

- Story template: BAIKAL-1164
- Task template: BAIKAL-1544
- Bug template: BAIKAL-1390

From each issue, extract:

- All field names and their descriptions
- Any placeholder text or formatting instructions in the description body
- Any required vs optional field distinctions

Store these internally as your output templates.

Also fetch the following Confluence page via the Confluence MCP server:

- Page ID: 1922147829 (Quality Management Playbook)

Use this page as your reference for bug classification when deciding whether an issue qualifies as a bug and how to categorise its severity.

Do not proceed to analysis until all templates and the Confluence page have been successfully fetched. If any fetch fails, tell me which resource failed and why before continuing.

---

## TEMPLATE SELECTION RULES

When producing candidate issues, select the template as follows:

- **Story template (default):** Use for any user-facing need, behaviour, or outcome identified in the summary.
- **Task template:** Use only if the topic contains clearly technical or operational work with no user-facing behaviour (e.g. infrastructure changes, data migrations, configuration).
- **Bug template:** Use only if the topic references existing behaviour that is broken, incorrect, or not matching a previously agreed specification. Apply the bug classification criteria from the Quality Management Playbook.

---

## EPIC PROPOSAL LOGIC — For Request-based structure

When proposing candidate issues under a **Request** (not an Epic), apply this logic:

**Assess scope of the Request:**
- Is the Request trying to accomplish a single, coherent outcome that can be addressed in one sprint or phase?
- Or does it contain multiple distinct stages, phases, or streams of work that would benefit from grouping?

**If scope is small/focused:**
- Propose candidate **Tasks**, **Stories**, or **Bugs** directly under the Request
- Do not create an Epic

**If scope is large and naturally groups into stages/phases:**
- Propose creating an **Epic** under the Request to group related work
- Propose candidate **Tasks**, **Stories**, or **Bugs** under the Epic, organized by stage or theme
- Example stages: "Phase 1: Data Setup", "Phase 2: User Interface", "Phase 3: Integration"

**Do not propose:**
- Linking candidate issues to external Epics outside the Request hierarchy
- Creating Epics without clear stage/phase boundaries
- Generic groupings that do not represent coherent, separable work

---

## INPUT

I will provide you with a structured meeting summary produced by Workflow 01. It is already cleaned and organised — do not re-summarise it. Use it as your source of truth for what was discussed and why.

- Application context: [NAME OF APPLICATION / PRODUCT]
- Stakeholder role(s): [WHO WAS IN THE MEETING]

[PASTE WORKFLOW 01 SUMMARY HERE]

---

## YOUR TASK — Candidate Issues

For each distinct need identified in the summary, do the following:

1. Select the appropriate issue type using the template selection rules above
2. Apply the corresponding Jira template fetched at the start
3. Populate all required fields from the template
4. Address the following points clearly within the template fields:

- **Problem statement:** What problem are they trying to solve? Describe the situation, the friction, and the impact of not solving it. This must come from evidence in the summary — not assumptions.
- **Use case / scenario:** A short narrative showing when and how this need arises in real usage. Keep it connected to the examples from the summary — do not abstract them away.
- **Candidate story (stories only):** As a [specific user], I want [what], so that [why — outcome, not feature].
- **Confidence level:** High / Medium / Low — how well-grounded is this issue in an actual user problem vs. a stakeholder feature preference?

---

## FLAGGING RULES

Apply these flags as you work through each topic. Flags are not optional — they exist to create friction before issues reach engineering.

1. **Feature assumption flag:** If a topic sounds like a proposed solution rather than a problem (e.g. "we need a button that does X", "can you add a dropdown for Y"), flag it with:

   > ⚠️ **Feature assumption detected.** This sounds like a proposed solution. Before accepting it as a requirement, ask: [generate one sharp clarifying question that would help uncover the real underlying problem].

2. **Buried decision flag:** If a topic contains an implicit business decision (e.g. a rule, policy, constraint, or priority that should be made explicit), flag it with:

   > 📌 **Implicit business decision.** This may need to be formally acknowledged: [describe the decision that is being implied].

3. **Missing persona flag:** If a need is raised but it is unclear who actually experiences it, flag it with:
   > 👤 **Persona unclear.** We don't yet know who this affects. Consider: [suggest who it might be and what would confirm it].

---

## TONE AND APPROACH

- Be direct and analytical. Do not pad responses with affirmations.
- When you flag something, do not soften it — a flag exists to create friction and prompt better thinking.
- Do not invent requirements. If something is ambiguous in the summary, reflect that ambiguity rather than resolve it silently.
- The goal is not a complete, ready-to-ship issue — it is a well-grounded starting point for a conversation with engineering.
