---
name: propose-child-breakdown
description: Analyse a Request-type issue and propose a structured breakdown into child issues (Stories, Tasks, Bugs, or Epics). Use when processing a Request during the craft flow and a child issue breakdown is needed.
---

# Skill: Propose Child Breakdown

**Purpose:** Transform an enriched Request canonical issue into a structured proposal of child issues — with type assignment, titles, rationale, and dependency flags.

**Config references:**
- `config/project.md` — Issue Hierarchy section (Request → Epic → Story/Task/Bug)
- `config/quality-standards.md` — Issue type classification rules (Story/Task/Bug)
- `config/personas.md` — Known user roles for persona assignment

---

## Input

- **canonical_issue** — Enriched canonical issue object (Request type). Must have issue_type = "Request" and all fields populated or marked `[MISSING]`.
- **template_structures** — Template structures for Story, Task, and Bug (from `fetch-required-templates`). Used to shape child issue proposals with correct field structure.

---

## Instructions

1. **Analyse the Request scope**

   Review the canonical issue for:
   - Problem statement and user need — what is the real problem?
   - Distinct outcomes — can you identify separable user needs or work streams?
   - Dependencies — does anything block something else?
   - The existing acceptance criteria — these hint at scope but don't treat them as final requirements. Reframe them as outcomes to verify, not specifications.

2. **Assess whether Epics are needed**

   Apply this logic from `config/project.md`:
   - **Small/focused scope** — Propose child issues (Stories, Tasks, Bugs) directly under the Request. Do not create Epics.
   - **Large scope with clear stages** — Propose one or more Epics under the Request, each grouping related child issues. Use stage/phase names that reflect real boundaries (e.g., "Phase 1: Data Setup", "Phase 2: User Interface").

3. **Identify each child issue**

   For each distinct outcome or work stream, propose a child issue with:

   - **Type:** Story (user-facing need), Task (technical/operational work), or Bug (broken existing behaviour). Use `config/quality-standards.md` classification rules.
   - **Title:** Concise, outcome-oriented.
   - **Rationale:** Why this exists as a separate issue — what outcome it delivers, and why it's separable from siblings.
   - **Dependencies:** What must exist or be true before this can start (e.g., "Blocked by: Child Issue X", "Depends on: Active CareMap Latest Comment column").
   - **Persona mapping (Story/Bug only):** Required. Map each Story or Bug to an **exact persona** from `config/personas.md` — no ad-hoc labels. See [REFERENCE.md](REFERENCE.md) for flag formats when no match exists or multiple personas are implied.

4. **Flag gaps and risks**

   For each child issue, also flag:
   - **Missing information** — What needs clarification before this can be drafted.
   - **Scope risk** — If a child issue feels too large or too small.
   - **Unknown dependency** — If something external is implied but not confirmed.

5. **Produce the breakdown proposal**

   Format as:

   ```
   Request: [title] (BAIKAL-NNNN)
   Scope assessment: [small / medium / large, with reasoning]

   Proposed children:
   1. [Type]: [Title]
      Rationale: ...
      Dependencies: ...
      Risks: ...

   2. [Type]: [Title]
      Rationale: ...
      Dependencies: ...
      Risks: ...

   ...

   Notes:
   - [Any cross-cutting concerns, sequencing recommendations, or open questions]
   ```

---

## Output

- **child_breakdown_proposal** — Structured list of proposed child issues with:
  - Scope assessment (small / medium / large)
  - For each child: type, title, rationale, dependencies, risks/pending info
  - Persona mapping (Story/Bug only) — each mapped to an exact entry from `config/personas.md`, or flagged with `[PERSONA GAP]` or `[MULTI-PERSONA]`
  - Cross-cutting notes and sequencing recommendations
- **unresolved_gaps** — Information still missing that impacts the breakdown quality
