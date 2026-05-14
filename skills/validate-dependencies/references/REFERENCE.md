# Reference: Dependency Categories

## Types of implicit dependencies to check

**External systems or APIs** — Assumes integration with external service, API, or data source? Is that integration confirmed available?

**Unreleased or in-progress capabilities** — Depends on functionality from another team, story, or feature in development? Is dependency linked or named?

**Pending decisions** — Assumes product, design, legal, or technical decision has been made that may not have been? Look for "once we know", "TBD", "depending on", or implicit assumptions in AC.

**Data or state assumptions** — Assumes certain data exists, is in certain state, or has been migrated? Documented?

**Infrastructure or environment** — Requires infrastructure, configuration, or environment changes not part of this issue?
