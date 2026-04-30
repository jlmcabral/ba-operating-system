# Reference: Acceptance Criteria Standards

This file contains detailed formatting rules and examples for acceptance criteria. Referenced by validation skills when checking AC quality.

For the quick rules summary, see [`quality-standards.md`](quality-standards.md).

---

## Gherkin Formatting Standard

All acceptance criteria must follow this format without exception.

**Structure rules:**

- Each scenario begins with `Scenario :` followed by a short descriptive title — the **entire scenario title line is bold**
- Each step keyword (**Given**, **When**, **Then**, **And**) is on its own line
- Step keywords are in **bold** with the exception of **And** keyword
- The rest of the sentence is not bold
- One blank line between scenarios
- Scenarios are always numbered sequentially

**Example of correct formatting:**

**Scenario 1: User filters results by date range**

**Given** the user is on the search results page
And the UI has fully loaded
**When** they select a start date and an end date
**Then** only results within that date range are displayed
And the filter selection is visually indicated

---

## Outcome Focus Rules

Criteria describe **what outcome must be true** — not **how the interface should look or behave**.

**Correct (outcome-focused):**
- "The user cannot submit the form until all required fields are valid"
- "The system prevents duplicate entries for the same date range"

**Incorrect (UI/UX-focused):**
- "The submit button is greyed out when fields are incomplete"
- "A red border appears around invalid fields"

When no design exists and UI detail is genuinely necessary to avoid ambiguity, mark it as design debt — not as a permanent acceptance criterion.

---

## Test Case Drift

Criteria define the **behaviour pattern**. Test cases verify the **exhaustive permutations**. When criteria enumerate every column, field, or data combination, they have drifted from acceptance criteria into test plan territory.

**Signals of drift:**
- Multiple scenarios differing only by which column, field, or entity they reference
- Criteria specifying data-type-specific behaviour that follows standard conventions
- Scenarios that read like a test matrix row rather than a user outcome

---

## Script-Assisted Validation

For deterministic format checks, use the co-located script `scripts/validate-gherkin.js`:

```bash
echo "[acceptance criteria text]" | node scripts/validate-gherkin.js
```

This catches formatting issues (missing bold, spacing, structure) without LLM interpretation. Use the script output as a starting point, then apply judgment for semantic quality (testability, coherence, drift).
