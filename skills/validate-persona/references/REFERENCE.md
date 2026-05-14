# Reference: Role Differentiation Signals

## Signals that multiple roles are implied

- Problem statement or description mentions different role types (admin, viewer, operator)
- Feature typically has role-gated behaviour (permissions, approval steps, visibility restrictions)
- config/personas.md contains distinct roles that would interact with feature differently

## Multiple roles detected

Check whether AC scenarios explicitly differentiate between them (e.g., separate scenarios for "admin can do X" vs "viewer cannot do X"). If AC treats all roles as "the user" without differentiation, flag as critical finding.
