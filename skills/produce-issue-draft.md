# Skill: Produce Issue Draft

**Purpose:** Using the enriched canonical issue and the fetched template structure, produce a complete issue draft with all required fields populated. This is the main authoring step — the output should look like the final version.

**Config references:**
- `config/quality-standards.md` — Gherkin formatting rules, problem statement rules
- `config/output-preferences.md` — Output style rules

---

## Input

- **canonical_issue** — The normalised (and potentially enriched) issue context
- **template_structure** — The extracted template from `fetch-required-templates`
- **issue_type** — Story, Task, or Bug

---

## Instructions

1. Using the template structure as your format guide, produce a complete issue draft. Populate every required field.

2. The draft must include all sections defined in the template. Do not omit sections — even if they are sparse, show them with whatever content is available.

3. **Problem statement** (Stories and Bugs):
   - Describe the situation, friction, and impact
   - Must be grounded in a real user need
   - If the input only described a solution, reframe it as a problem and note the reframe explicitly

4. **User / persona:**
   - Be as specific as possible based on the input and `config/personas.md`
   - Avoid generic labels like "user" unless no more specific persona can be inferred

5. **Candidate story** (Stories only):
   - Format: "As a [specific user], I want [what], so that [why — outcome, not feature]"

6. **Acceptance criteria:**
   - Write in Gherkin syntax following the rules in `config/quality-standards.md`
   - Focus on user outcomes, not interface behaviour
   - Describe behaviour patterns, not test case permutations

7. **Additional context:**
   - Preserve all existing context from the canonical issue — links, hints, references, background notes
   - Add any new context that emerged from clarification questions
   - Do not discard prior thinking

8. Where information is genuinely missing, make a reasonable inference and mark it with `[INFERRED]`. Do not leave required fields empty.

9. Present the draft as the final version — all template sections visible, clean formatting.

---

## Output

- **issue_draft** — The complete issue draft, formatted according to the template, with all sections visible
