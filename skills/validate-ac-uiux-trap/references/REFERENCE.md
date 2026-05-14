# Reference: UI/UX Trap Signals

## Signals of UI/UX trap in acceptance criteria

- Criteria mention visual states (greyed out, highlighted, red border)
- Criteria describe component behaviour (dropdown shows X items, button disabled)
- Criteria specify layout or positioning details

## When to flag vs when to mark as design debt

Flag as UI/UX trap if: an outcome-focused rewrite captures the same requirement (e.g., "User cannot submit until all required fields are valid" instead of "Submit button is greyed out").

Mark as design debt if: no design exists and behaviour would otherwise be ambiguous. Note it should be replaced with a proper design reference when available.
