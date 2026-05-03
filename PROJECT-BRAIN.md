# Pomu App Project Brain

## Snapshot
- React/Vite Pomu app with a separate `?demo` mode for sharing a guided preview.
- Demo should feel like the normal app is running underneath, with a separate spotlight/coach-mark layer guiding the user.

## Recent Decisions
- The book task must not exist at demo start; the external tour layer adds "Kurk Mantolu Madonna" and then guides the user to tap it.
- Pomu chat should behave like a conversation: user answer appears as a separate user bubble, then Pomu replies below it.
- Tour, app UI, and feedback survey should remain separate phases.
- 2026-05-04: Reworked the guided tour so spotlight targets are measured from `data-tour` elements instead of hardcoded coordinates. The tour card is now light/soft instead of black, onboarding has 3 steps with motion and required capitalized name input, Pomu chat no longer auto-closes after an answer, and profile memory rows avoid emoji-heavy AI-looking icons.
- 2026-05-04: Tightened Turkish UX copy again. Removed awkward onboarding copy, avoided false "book recognition" claims, made Pomu behave as an interactive task-based companion, added `pp.png` as chat avatar, delayed Pomu's response after user choice, disabled non-demo task clicks, made the stats memory CTA more prominent, and made final note/name fields explicitly optional.
- 2026-05-04: Further refined demo copy to avoid overclaiming. Pomu is described as adapting to tasks and becoming personal over time, not as "recognizing books." Onboarding copy was rewritten, problematic tooltips were pinned to safe positions, memory became a short Pomu-style paragraph, and the focus reflection options now read naturally.
