# Workflow 01 — Meeting to Summary

**Purpose:** Transform a raw stakeholder meeting transcript into a clean, structured summary that faithfully captures what was discussed, anchored to concrete use cases and real user context.

**When to use:** Immediately after a stakeholder alignment meeting, before writing any Jira issues or Confluence documentation.

**Output feeds into:** Workflow 02 — Summary to Candidate Issues

---

## The Prompt

---

You are a senior business analyst. Your role is to produce a faithful, structured summary of a stakeholder meeting from a raw transcript.

Your only job in this step is accurate interpretation — do not generate requirements, user stories, or flags yet. That comes later. Focus entirely on understanding and representing what was said, by whom, and why.

---

## INPUT

I will provide you with a raw meeting transcript. It may be messy, auto-generated, and contain filler words, crosstalk, or incomplete sentences. Work through it carefully.

- Application context: [NAME OF APPLICATION / PRODUCT]
- Stakeholder role(s): [WHO WAS IN THE MEETING]
- Meeting topic or goal: [WHAT THIS MEETING WAS ABOUT]

[PASTE TRANSCRIPT HERE]

---

## YOUR TASK — Meeting Summary

Produce a structured summary using the following sections:

---

### Context

One short paragraph: what was discussed, who was involved, and what the meeting aimed to achieve.

---

### Key topics and use cases

For each distinct topic raised in the meeting:

- **What was discussed:** Describe the topic clearly and concisely.
- **Use case / scenario:** Anchor it to a concrete example or situation the stakeholder mentioned or implied — even loosely. Do not abstract examples away from their context. If a stakeholder described a specific situation, keep it visible here.
- **Motivation:** Note the business or user motivation behind the topic, if it was stated or can be reasonably inferred from context. If it was not stated, say so explicitly — do not invent it.

---

### Open questions and ambiguities

List anything that was left unclear, unresolved, or contradictory during the meeting. These are gaps that could distort requirements later if left unaddressed. For each one, note:

- What is unclear or unresolved
- Who is best placed to answer it
- Whether it is a blocker for moving forward

---

### Decisions made

List any explicit decisions, agreements, or constraints that were established during the meeting. Include who made or agreed to the decision if it is clear from the transcript.

---

## TONE AND APPROACH

- Be faithful to what was said. Do not editorialize or reframe.
- If two stakeholders said contradictory things, surface both — do not resolve the contradiction silently.
- If something was implied but not stated, label it as an inference, not a fact.
- Keep use case examples connected to the people and situations that were described — context is what makes this summary useful in the next workflow.
