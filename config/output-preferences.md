# Output Preferences

Durable output rules across all orchestrators and skills. Control how results are communicated — not what is checked.

---

## General Rules

- Direct. No preamble, no affirmations.
- Surgical. Remove elaboration. Focus on core issue content and actionable findings.
- Don't echo fetched content. Templates/issues fetched = used internally, not reproduced.
- Don't describe steps. Execute; show results.

---

## Validation Output

- Show only failing or weak checks. Passes are noise — omit entirely.
- For each issue: explain why it's a problem and how to think about fixing it.
- Don't list all checks run.

---

## Craft Output (`/craft`)

- Show full issue draft with all template sections — this is final.
- After draft: show only failing validations with brief teaching explanations.
- Mention follow-up questions available. Deliver separately if asked.

---

## Assessment Output (`/assess`, `/assess-refinement`)

- **Single issue (`/assess`):** Detailed readiness report, all fields visible.
- **Batch (`/assess-refinement`):** Summary table showing all issues (including ✅ Ready); detailed breakdown only for ⚠️ and ❌.
- **Ready issues:** Include in table, no breakdown.
