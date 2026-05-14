# Reference: Unhappy Path Categories

- **Invalid or missing input** — what happens if required data is absent, malformed, or out of range?
- **Permission or access denial** — what happens when user doesn't have right to perform action?
- **System or dependency failure** — what happens when downstream service, API, or resource is unavailable?
- **Boundary conditions** — what happens at edge of defined limit (max items, zero results, duplicate entries)?
- **Concurrent or conflicting actions** — what happens if action triggered twice, or two users act simultaneously?
