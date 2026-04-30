# Output Preferences

Durable output rules that apply across all orchestrators and skills. These control how the system communicates results — not what it checks.

---

## General Rules

- **Be direct.** Do not pad responses with affirmations or unnecessary preamble.
- **Be surgical with language.** Remove elaboration. Focus on the core issue content and actionable findings.
- **Do not echo fetched content.** When templates or issues are fetched, do not reproduce them in the output. Use them internally as reference.
- **Do not describe steps being taken.** Execute the steps; show the results.

---

## Validation Output

- **Show only failing or weak checks.** Passing checks are noise — they do not teach anything. Omit them entirely.
- **For each issue found, explain why it is a problem and how to think about fixing it.** This is the teaching aspect — balance it with brevity.
- **Do not list all checks that were run.** The user does not need to see a checklist of passes.

---

## Craft Output (`/craft`)

- **Show the full issue draft** with all template sections visible — this is the final version.
- **After the draft, show only failing validations** with brief, teaching explanations.
- **Mention that follow-up questions are available** at the end. Deliver them separately if the user asks.

---

## Assessment Output (`/assess`, `/assess-refinement`)

- **Single issue (`/assess`):** Detailed readiness report with all fields visible.
- **Batch assessment (`/assess-refinement`):** Summary table showing all issues (including ✅ Ready), detailed breakdown only for ⚠️ and ❌ issues.
- **Ready issues:** Include in the summary table but do not produce a detailed breakdown for them.
