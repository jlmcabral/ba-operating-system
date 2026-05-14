# Reference: Acceptance Criteria Standards

Detailed formatting rules and examples for acceptance criteria. Referenced by validation skills when checking AC quality.

For quick rules summary, see [`quality-standards.md`](../../config/quality-standards.md).

---

## Gherkin Formatting Standard

All acceptance criteria must follow this format without exception.

**Structure rules:**

- Each scenario begins with `Scenario :` followed by short descriptive title — **entire scenario title line is bold**
- Each step keyword (**Given**, **When**, **Then**, **And**) on own line
- Step keywords in **bold** except **And**
- Rest of sentence not bold
- One blank line between scenarios
- Scenarios numbered sequentially

**Example of correct formatting:**

**Scenario 1: User filters results by date range**

**Given** the user is on the search results page
And the UI has fully loaded
**When** they select a start date and an end date
**Then** only results within that date range are displayed
And the filter selection is visually indicated

---

## Outcome Focus Rules

Criteria describe **what outcome must be true** — not **how interface should look or behave**.

**Correct (outcome-focused):**
- "The user cannot submit the form until all required fields are valid"
- "The system prevents duplicate entries for the same date range"

**Incorrect (UI/UX-focused):**
- "The submit button is greyed out when fields are incomplete"
- "A red border appears around invalid fields"

When no design exists and UI detail is genuinely necessary to avoid ambiguity, mark as design debt — not as permanent acceptance criterion.

---

## Test Case Drift

Criteria define **behaviour pattern**. Test cases verify **exhaustive permutations**. When criteria enumerate every column, field, or data combination, they've drifted from acceptance criteria into test plan territory.

**Signals of drift:**
- Multiple scenarios differing only by which column, field, or entity referenced
- Criteria specifying data-type-specific behaviour following standard conventions
- Scenarios reading like test matrix rows rather than user outcomes

---

## Script-Assisted Validation

For deterministic format checks, use co-located script `scripts/validate-gherkin.js`:

```bash
echo "[acceptance criteria text]" | node scripts/validate-gherkin.js
```

Catches formatting issues (missing bold, spacing, structure) without LLM interpretation. Use script output as starting point, then apply judgment for semantic quality (testability, coherence, drift).
