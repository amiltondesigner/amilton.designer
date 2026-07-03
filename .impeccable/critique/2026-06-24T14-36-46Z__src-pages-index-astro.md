---
target: home (one-page portfolio) + WhatsApp builder
total_score: 34
p0_count: 0
p1_count: 0
timestamp: 2026-06-24T14-36-46Z
slug: src-pages-index-astro
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Live summary, chip states, "✓ Copiado", count, appearing CTA. Hand-off to WhatsApp is its own confirmation; no in-page "sent" state. |
| 2 | Match System / Real World | 4 | Natural PT-BR throughout; WhatsApp green = the real app; logical order. |
| 3 | User Control and Freedom | 3 | Message editable, "restaurar" undo, copy fallback, chips toggle off. No single "limpar tudo". |
| 4 | Consistency and Standards | 4 | One cohesive token system, repeated A+S lockup, consistent easing/eyebrows/tabular nums, view transitions. |
| 5 | Error Prevention | 3 | All builder fields optional + pre-filled message; chips remove free-text error surface. A no-selection send still yields a sensible default. |
| 6 | Recognition Rather Than Recall | 4 | Live message preview removes all recall; every option visible; labelled nav + icons. |
| 7 | Flexibility and Efficiency | 3 | Three paths (chips / edit text / copy), thumb-zone mobile CTA, anchored nav. No keyboard shortcuts (not needed here). |
| 8 | Aesthetic and Minimalist Design | 4 | Editorial, type-first, monochrome + one surgical blue. Zero real slop in authored markup. |
| 9 | Error Recovery | 3 | Clipboard fails silently to manual select; little else can fail. No styled 404. |
| 10 | Help and Documentation | 3 | Self-explanatory via placeholders + helper microcopy ("abre direto no seu WhatsApp"). No docs needed. |
| **Total** | | **34/40** | **Good (top of band)** |

## Anti-Patterns Verdict

**Does this look AI-generated? No.** It reads as one designer's deliberate system: a type-first dark editorial layout, a single surgical blue, the exact A+S vector used as identity (faint, bleeding off the right edge), and human PT-BR copy with no em-dashes. None of the cross-register bans are present in authored markup: no side-stripe accents, no gradient text, no glassmorphism, no hero-metric template, no per-section eyebrow/number scaffolding.

**Deterministic scan** (`detect.mjs` over `dist`): 11 raw hits, but **only 1 sits in rendered HTML** — and it's defensible:
- **10 are the bundled Tailwind utility layer**, not my usage. Confirmed against source: `border-l-2`/`border-t-2`/`border-b-2`/`border-b-4`, `bg-clip-text`/`bg-gradient`, `text-gray-400 on bg-blue-500`, and `animate-bounce` appear **nowhere** in my components (`grep` empty); they exist only as class *definitions* in the compiled framework CSS (`.border-l-2{border-left-width:2px}`). The detector can't tell defined-but-unused from used. My real easings are the recommended non-overshoot `cubic-bezier(.16,1,.3,1)` / `(.25,1,.5,1)`.
- **`overused-font: Inter`** — committed identity. Inter/Inter Display is a locked decision (Space Grotesk was explicitly rejected); identity-preservation wins.
- **`numbered-section-markers: 01–04`** (the one rendered hit) — the WhatsApp builder's part labels. Per the skill's own carve-out, numbers earn their place when the section IS a guided sequence; this is one multi-part composer on one component, not numbered eyebrows across the site. Defensible as voice. Flagged here for transparency so you can decide.

Net: **0 genuine slop tells in authored markup.** Removed this pass: the dead `.prose-case blockquote` left-border rule (no MDX renders a blockquote).

## Overall Impression

Confident and quiet. The hero commits — oversized name, the disruptive faint monogram leaving the frame — and the rest gets out of the way so the four real cases carry the page. The contact builder is the cleverest move: it turns "fill a form" into "assemble a message you can see," then hands a pre-contextualized lead straight to WhatsApp. Biggest remaining opportunity is depth inside the case pages (still your drafts), not the home.

## What's Working

1. **The WhatsApp builder as a recognition-not-recall machine.** The live summary means the visitor never holds choices in their head, and editing the final message before sending gives full control. The new mobile thumb-zone CTA that yields to the real send button at the summary is a genuine craft detail.
2. **Restraint with one surgical accent.** Graphite + a single blue, WhatsApp green reserved strictly for the send action. Nothing competes; the blue means "act."
3. **Identity used literally, not approximated.** The exact A+S vector in the hero/nav/footer, oversized and faded in the hero, is distinctive and unmistakably yours.

## Priority Issues

- **[P2] Case pages are still placeholder-depth.** *Why:* The home promises craft the case bodies don't yet pay off; a prospective client clicks "Ver case" and finds thin copy. *Fix:* Write the real narrative (problem → process → outcome) for at least GreenSync + Wood Grill; the template and 830px column are ready. *Command:* `/impeccable clarify` (case copy) then `/impeccable polish`.
- **[P3] Builder 01–04 numbering is a judgment call.** *Why:* The parts aren't strictly ordered (budget can precede services), so the numbers imply a sequence that isn't enforced. *Fix:* Keep if you want the "four short parts" reassurance (I'd keep them); or drop to plain labels if you'd rather not imply order. *Command:* none / `/impeccable distill`.
- **[P3] No styled 404.** *Why:* A wrong URL drops to Astro's default page, off-brand. *Fix:* Add `src/pages/404.astro` reusing Base + a short "perdeu-se?" + back-home link. *Command:* `/impeccable harden`.

## Persona Red Flags

**Jordan (first-time prospective client):** Well-served — clear hero, obvious "Ver case →", guided builder. Minor: the builder reads as required at a glance; "(opcional)" only appears on name/note, so a hesitant visitor may think the chips are mandatory. A one-line "tudo opcional, monte como quiser" would remove the doubt.

**Casey (one-handed mobile, interrupted):** Now strong — the sticky "Enviar no WhatsApp" lives in the thumb zone while building and steps aside at the summary; state is all in-page so an interruption loses nothing; images lazy-load. Minor: chips are ~36–40px tall, just under the 44px target — comfortable but not generous.

**Sam (screen reader / keyboard):** Strong — axe clean (0 violations, home + case, mobile viewport), `aria-pressed` chips, labelled textarea, alt text, focus-visible rings, and the off-state mobile CTA is `aria-hidden` + removed from tab order. Reveal-on-scroll is progressive enhancement (content ships visible without JS and under reduced-motion), so nothing is gated behind an animation.

## Minor Observations

- Reveal now varies by content (cards/images scale-in subtly, text rises) instead of one uniform entrance — the prior "uniform reflex" tell is gone.
- The faint hero monogram at low opacity reads as texture, not a logo placement — good; it never competes with the name.
- Consider a hair more vertical rhythm between the About stats row and the areas grid on desktop; they sit slightly tight.

## Questions to Consider

- The home sets a high craft bar — what's the one case study whose real story would most convince a client, and can we make that one excellent before the others?
- The builder defaults to a friendly greeting even with nothing selected. Is an empty-handed send a real path you want, or should the first chip nudge selection?
- Would a single line of social proof (a client name, a result) anywhere on the home raise trust without adding clutter?
