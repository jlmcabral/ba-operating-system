---
name: produce-issue-draft
description: Write a complete issue draft from enriched canonical issue and template structure. Use when all clarification is complete and the draft should be authored.
---

# Skill: Produce Issue Draft

**Purpose:** Using enriched canonical issue and fetched template structure, produce complete issue draft with all required fields populated. Main authoring step — output should look like final version.

**Config references:**
- `config/quality-standards.md` — Gherkin formatting rules, problem statement rules
- `config/output-preferences.md` — Output style rules
- `config/personas.md` — Known user roles for persona matching

---

## Input

- **canonical_issue** — Normalised (and potentially enriched) issue context
- **template_structure** — Extracted template from `fetch-required-templates`
- **issue_type** — Story, Task, or Bug

---

## Instructions

1. Use template structure as format guide; produce complete issue draft. Populate every required field.

2. Draft must include all sections defined in template. Don't omit sections — even sparse ones show with available content.

3. **Problem statement** (Stories and Bugs):
   - Describe situation, friction, and impact
   - Must be grounded in real user need
   - Input described only solution: reframe as problem and note reframe explicitly

4. **User / persona:**
   - As specific as possible based on input and `config/personas.md`
   - Avoid generic labels like "user" unless no more specific persona can be inferred

5. **Candidate story** (Stories only):
   - Format: "As a [specific user], I want [what], so that [why — outcome, not feature]"

6. **Acceptance criteria:**
   - Gherkin syntax per rules in `config/quality-standards.md`
   - Focus on user outcomes, not interface behaviour
   - Behaviour patterns, not test case permutations

7. **Additional context:**
   - Preserve all existing context from canonical issue — links, hints, references, background notes
   - Add new context from clarification questions
   - Don't discard prior thinking

8. Info genuinely missing: make reasonable inference, mark `[INFERRED]`. Don't leave required fields empty.

9. Present draft as final version — all template sections visible, clean formatting.

---

## Output

- **issue_draft** — Complete issue draft, formatted per template, all sections visible
