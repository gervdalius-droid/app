# Dienos planas — daily production planning agent

Office-only page (`/hub/planas/`, area `planas`, managers). It reads ShopFlow and plans the next working day.

- `engine.js` — no DOM, runs in Node too. `build()` → model from ShopFlow orders/steps, the "waiting for" lists
  (`details`), appliances, floor-plan stretches (`dedes-cechas-log-*`), leave (`dedes-prasymai`) and the Našumas norms
  (`nasumas-core.js`). `plan()` → per-person day plan + 15-working-day forecast. `review()` → what was done on a day
  (and plan adherence if a plan was confirmed). `analyse()` → office actions and insights. `parse()` → LT/EN comments
  into adjustments (absent, avail, arrived, missing, prio, hold, unblock, assign, hours, install, note).
- `app.js` — the page. Shared state in `workspaces` row `dedes-planas` (adjustments, comment log, confirmed plans, settings).
  Also reads the "Ko trūksta?" notes of Projektų apžvalga (`dedes-apzvalga`).
- AI (optional) — edge function `planas-ai` (managers only). Uses the Claude / Gemini key in `studio_secrets`
  (shared with Reklamos Studija). Without a key the rule-based parser still handles the common commands.

Planning rules: started work first; then by critical ratio (working days to due ÷ days of work left), rush/high and
manager priority; steps of an item in route order (a later step can start the same day after the earlier one);
nothing gated by a missing thing (handles → set-up/QC, worktop & sink → installation, hardware/fronts/lighting → assembly,
boards → cutting, appliance models → drawings); 85 % of the shift is planned, the rest is buffer; idle people help on
other ready steps; installation only when the manager books it.
