# Workflow 03 — Issue Crafter

**Purpose:** Transform a loose idea, an existing draft, or a Jira issue into a complete, well-structured, critically reviewed Jira issue — with valid Gherkin acceptance criteria and a clear problem statement grounded in real user needs.

**When to use:**

- You have a rough idea and want to shape it into a proper issue
- You have a draft (your own or from Workflow 02) and want it completed and critiqued
- You have an existing Jira issue that needs improvement before refinement

**Output feeds into:** Workflow 04 — Refinement Readiness Review

---

## The Prompt

---

## BEFORE YOU BEGIN — Fetch Jira issue templates

Use the Atlassian MCP server to fetch the following issue templates before doing anything else. These define the required output format.

Fetch these three Jira issues:

- Story template: BAIKAL-1164
- Task template: BAIKAL-1544
- Bug template: BAIKAL-1390

From each issue, extract:

- All field names and their descriptions
- Any placeholder text or formatting instructions in the description body
- Any required vs optional field distinctions

Also fetch the following Confluence page via the Confluence MCP server:

- Page ID: 1922147829 (Quality Management Playbook)

Use this page as your reference for bug classification.

Do not proceed until all templates and the Confluence page have been successfully fetched. If any fetch fails, tell me which resource failed and why before continuing.

---

## MODE

Declare which mode you are running before providing input:

- **MODE: idea** — I will describe a need, problem, or feature direction loosely. Build the issue from scratch based on what I provide.
- **MODE: draft** — I will paste a candidate issue or partial draft. Review it, complete it, and critique it.
- **MODE: jira** — I will provide a Jira issue key. Fetch it via MCP, then review, complete, and critique it.

[DECLARE MODE HERE — idea / draft / jira]

---

## INPUT

- Application context: [NAME OF APPLICATION / PRODUCT]
- Stakeholder role(s) or user affected: [WHO THIS IS FOR]
- Issue type (if known): [STORY / TASK / BUG — leave blank if unsure]

[PASTE YOUR IDEA, DRAFT, OR JIRA ISSUE KEY HERE]

---

## YOUR TASK

### Step 1 — Understand the input

Depending on the declared mode:

- **idea:** Extract the core need from what I described. Identify who is affected, what problem they have, and what outcome they are looking for. If the input sounds like a proposed solution rather than a problem, flag it immediately before proceeding.
- **draft:** Read the draft carefully. Identify what is already well-formed, what is missing, what is a solution disguised as a requirement, and what does not comply with the templates.
- **jira:** Fetch the issue using the provided key via the Atlassian MCP server. The issue is already positioned in the correct location in the hierarchy (Request, Epic, or standalone). Do not infer or propose epic/parent links — treat the issue as a standalone work item to be refined. Treat it the same as a draft from that point forward.

If the issue type is not declared, infer it using these rules:

- **Story:** Any user-facing need, behaviour, or outcome
- **Task:** Clearly technical or operational work with no user-facing behaviour
- **Bug:** Existing behaviour that is broken or incorrect — apply Quality Management Playbook classification

---

### Step 2 — Produce a complete draft

Using the appropriate Jira template, produce a complete issue draft. Populate every required field. Where information is genuinely missing, make a reasonable inference based on context and clearly mark it as an inference with the label `[INFERRED]`. Do not leave required fields empty.

The draft must include:

**Problem statement**
What problem is this solving? Describe the situation, the friction, and the impact of not solving it. This must be grounded in a real user need — not a feature preference or internal assumption. If the input only describes a solution, reframe it as a problem first, then note the reframe explicitly.

**User / persona**
Who experiences this problem? Be specific. Avoid generic labels like "user" unless no more specific persona can be inferred.

**Candidate story (stories only)**
As a [specific user], I want [what], so that [why — outcome, not feature].

**Acceptance criteria**
Written in Gherkin syntax. Enforce the following formatting rules strictly — no exceptions:

- Each scenario begins with `Scenario:` followed by a short descriptive title
- Each step keyword (**Given**, **When**, **Then**, **And**) is on its own line
- Step keywords are in **bold**
- The rest of the sentence is not bold
- There is one blank line between scenarios

Example of correct formatting:

Scenario: User filters results by date range

**Given** the user is on the search results page
**When** they select a start date and an end date
**Then** only results within that date range are displayed
**And** the filter selection is visually indicated

**Confidence level**
High / Medium / Low — how well-grounded is this issue in an actual user problem vs. a stakeholder feature preference or internal assumption?

---

### Step 3 — Critical review

After producing the draft, apply all of the following checks and report findings explicitly. Do not skip a check because the issue looks clean — run every one.

---

**Problem vs solution check**
Is the issue framed around a real user problem, or is it describing a solution? If it is solution-framed, explain what is missing and suggest a sharper problem statement.

---

**Completeness check**
List every field that was inferred (`[INFERRED]`) and every field that could not be populated at all. For each gap, ask me one specific question that would resolve it.

---

**Scope check**
Assess whether this issue is trying to do too much. Look for two signals:

1. **Breadth:** Does the issue address more than one distinct user need or outcome? If a user in a different role, context, or situation would need a separate mental model to understand this story, it is probably two stories.
2. **Acceptance criteria volume:** If the scenarios cover significantly different situations or user journeys, that is a sign the issue lacks focus.

If either signal is present, flag it with:

> 🔀 **Scope flag.** This issue may be covering more than one distinct need. Consider splitting into:
>
> - **Part A:** [describe the first focused need]
> - **Part B:** [describe the second focused need]
>   Confirm whether to split before proceeding. If you split, run each part through Workflow 03 independently.

Do not propose a split unless there is a genuine reason — a long story is not automatically a split candidate. The test is whether the two parts represent distinct user outcomes, not whether the issue feels large.

---

**Acceptance criteria — UI/UX trap check**
This is a critical check. Acceptance criteria exist to describe _what outcome must be true_ — not _how the interface should look or behave_. When UI and UX details appear in acceptance criteria, they create two problems: they constrain engineering unnecessarily, and they become wrong the moment the design changes.

For every acceptance criterion, ask: is this describing a user outcome, or is it describing an interface?

Examples of outcome-focused criteria (correct):

- "The user cannot submit the form until all required fields are valid"
- "The system prevents duplicate entries for the same date range"

Examples of UI-focused criteria (wrong):

- "The submit button is greyed out when fields are incomplete"
- "A red border appears around invalid fields"
- "The dropdown shows a maximum of 10 items"

For every criterion that describes UI or UX behaviour rather than a user outcome:

1. **Rewrite it** as an outcome-focused criterion that captures the real requirement behind the UI detail
2. Flag the original with:
   > ⚠️ **UI/UX trap.** This criterion describes interface behaviour, not a user outcome. The underlying requirement is: [rewritten outcome-focused version]. The original has been replaced.

For cases where UI detail is genuinely necessary because no design exists and the behaviour would otherwise be ambiguous, flag it differently:

> 🎨 **Design debt marker.** This criterion contains UI detail because no Figma concept exists yet. It captures a temporary constraint and should be replaced with a proper design reference when one becomes available.

Apply this check strictly. The absence of a Figma file is not a reason to describe UI in acceptance criteria — it is a reason to write outcome-focused criteria that leave the design decision open.

---

**Acceptance criteria — quality and format check**
Verify that every acceptance criterion is:

- Testable — can a tester verify it as pass/fail without ambiguity?
- Outcome-focused — does it describe what should be true, not how it should be built? (see UI/UX trap check above)
- Correctly formatted in Gherkin syntax as specified in Step 2

Flag any criterion that fails and suggest a corrected version.

---

**Persona check**
Is the affected user specific enough to be meaningful? A generic "user" tells engineering nothing about context, permissions, or intent. If the persona is too vague, flag it and suggest who it might be based on the available context.

---

### Step 4 — Follow-up questions

End your response with a clearly separated section titled **"To make this issue stronger, I need your input on:"** followed by a numbered list of specific questions — one per gap or flag identified in Step 3. These are not optional questions — they are the information needed to bring this issue to refinement-ready standard.

---

## TONE AND APPROACH

- Be direct and critical. A good issue is better than a comfortable one.
- Do not soften flags — they exist to prevent problems downstream.
- Do not invent requirements. Mark inferences clearly so I can confirm or correct them.
- The goal of this workflow is a complete, honest draft — not a polished one. Polish comes from the answers to the follow-up questions.
