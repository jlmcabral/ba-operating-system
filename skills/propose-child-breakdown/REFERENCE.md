# Reference: Persona Mapping Rules

## No matching persona

Label used doesn't match any entry in `config/personas.md`:

> [PERSONA GAP] "HCT Operator" does not match any persona in config/personas.md
> [INFERRED] Maps closest to "Operator" — confirm or add to config/personas.md

Always propose the closest match. Never proceed with an unverifiable persona — flag it.

## Multiple personas implied

Request affects multiple roles with different access or behaviour:

> [MULTI-PERSONA] This Request may affect [Operator] and [Team Lead] differently. Ensure child ACs differentiate by role where applicable.
