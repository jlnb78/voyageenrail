# voyage en rail

Real implementation of the `Voyage en Rail.dc.html` Claude Design mockup
(see `../README.md` and `../chats/chat1.md` for the design brief this
follows). Astro static site — the stack the design chat itself recommended
("site statique Astro… sur Netlify").

## Run it

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # → dist/
npm run preview   # serve the production build locally
```

## How it's organized

- `src/data/routes.ts` — the 9 lines voyage en rail has ridden: distances,
  prices, durations, and a step-by-step itinerary for each. This is the
  `routes.json` the design chat promised: "ajouter une ligne = ajouter un
  bloc de six lignes." One file, read by the map, the calculator, and every
  récit's itinerary sidebar.
- `src/data/co2-factors.ts` — the ADEME factors shown on `/a-propos`, read
  by the calculator. Revisit yearly.
- `src/content/recits/*.md` — one Markdown file per récit (title, dates,
  price paid, CO2 avoided, cover image, body). This is the "format qui
  vieillit le mieux" from the chat. Six récits are filled in — the ones the
  mockup actually wrote content for; a real `41 récits` claim from the
  mockup was replaced with the real, live count everywhere on the site.
  Wiring this collection to a headless CMS (Decap, Sanity) for a no-code
  editing UI is the natural next step, as discussed in the chat.
- `src/components/EuropeMap.astro` — the interactive map, ported from the
  mockup's `europe-map.html` (D3 + real Natural Earth geometry via
  `world-atlas`) into a component driven by `routes.ts`, used inline on both
  the homepage (mini) and `/carte` (full, with the route list + filters).
- `src/lib/calc.ts` — the cost/CO2/duration formulas behind `/calculateur`,
  shared between the server-rendered initial state and the client-side
  recompute script.

## Known gaps / next steps

- **Newsletter form** posts nowhere yet — wire it to a provider (Buttondown,
  Mailchimp…) before launch.
- **Instagram grid** is a static placeholder — either the real Graph API or
  an embed widget, as discussed in the design chat.
- Only 2 real photos exist yet (`public/images/`); the rest of the
  image slots render as labeled placeholders, same as the mockup.
- The map fetches world geometry from a public CDN
  (`cdn.jsdelivr.net/npm/world-atlas`) at runtime, same as the mockup — fine
  in production, but blocked by some restrictive dev sandboxes/proxies.
