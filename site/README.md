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
- `src/data/night-trains.ts` — a curated ~20-line reference layer of other
  European night trains (Nightjet, European Sleeper, Snälltåget, Trenhotel,
  PKP/EuroNight, Caledonian Sleeper…) that voyage en rail has **not**
  personally ridden. Drawn thin and grey on `/carte`, clearly labeled "non
  testées par nous", linking out to the operator instead of a récit — kept
  deliberately separate from `routes.ts` so nothing invented (itinerary,
  price, CO2) attaches to a line we haven't verified. Not exhaustive by
  design (Back-on-Track tracks the full ~200-line European network); the
  panel links there for anything beyond this list. Compiled from public
  route announcements as of September 2026 — night train schedules change
  often, re-verify before trusting an entry that's more than a few months
  old.
- `src/lib/calc.ts` — the cost/CO2/duration formulas behind `/calculateur`,
  shared between the server-rendered initial state and the client-side
  recompute script.
- `src/lib/instagram.ts` — pulls the real @voyageenrail feed via the
  Instagram Graph API at build time. Needs a one-time, human-only setup
  step (an access token only the account owner can generate — see below);
  until that's done it falls back to a placeholder grid automatically.
- `public/admin/` — the Decap CMS admin panel, at `/admin` on the deployed
  site. No-code editing for récits (title, prices, CO2, photo, body text)
  — the back-office the design chat promised. See setup below.

## Setting up the no-code admin panel (Decap CMS)

`/admin` on the deployed site is already built and configured
(`public/admin/config.yml`) to edit every récit through plain forms —
no Markdown, no code, no git commands. It needs one one-time setup step in
Netlify, done by whoever administers the Netlify site:

1. Netlify dashboard → your site → **Identity** → **Enable Identity**.
2. Identity → **Registration** → set to **Invite only** (so the admin
   panel isn't open to anyone who finds the URL).
3. Identity → **Services** → **Git Gateway** → **Enable Git Gateway**. This
   is what lets an Identity-logged-in editor save changes to GitHub without
   needing their own GitHub account or a personal access token.
4. Identity → **Invite users** → invite yourself (and anyone else who'll
   write récits). You'll get an email to set a password.
5. Go to `https://<your-site>.netlify.app/admin`, log in, and edit.

Every save there is a real commit to `main` and triggers a normal Netlify
deploy — the site updates a minute or two later, same as any other push.

If Netlify has since renamed or moved "Identity"/"Git Gateway" in their
dashboard, search their current docs for "Git Gateway" or "Decap CMS" — the
`git-gateway` backend in `config.yml` is what needs the equivalent feature,
whatever it's called by the time you set this up.

Adding the map's routes (`src/data/routes.ts`) and the CO2 factors
(`src/data/co2-factors.ts`) to the CMS too is possible, but they're
currently plain TypeScript, not CMS-editable files — ask Claude to move
them to a `routes.yml`/`co2-factors.yml` the CMS can read if you want those
editable without code as well.

## Wiring the real @voyageenrail feed

The homepage's Instagram section is already coded to show the real feed —
it just needs a token, which only whoever owns @voyageenrail can create
(this can't be done on their behalf without their Instagram login):

1. Make sure @voyageenrail is a Professional account (Business or Creator) —
   Instagram app → Settings → Account type.
2. Create an app at [developers.facebook.com/apps](https://developers.facebook.com/apps),
   add the **Instagram** product, and use the "API setup with Instagram
   login" flow (no linked Facebook Page required with this flow).
3. Generate a long-lived access token for @voyageenrail. It's valid 60 days
   and can be refreshed indefinitely by calling the refresh endpoint before
   it expires — see the [Instagram Platform docs](https://developers.facebook.com/docs/instagram-platform).
4. Set it as `INSTAGRAM_ACCESS_TOKEN` in Netlify's site environment
   variables (or `.env.local` for local dev — see `.env.example`). It's
   server-only and never shipped to the browser.
5. Redeploy (or set up a scheduled rebuild) so the feed refreshes
   periodically — this is a static site, so it updates on each build, not
   live in the visitor's browser.

Until that token exists, the grid renders as a labeled placeholder instead
of failing the build.

## Known gaps / next steps

- **Newsletter form** posts nowhere yet — wire it to a provider (Buttondown,
  Mailchimp…) before launch.
- Only 2 real photos exist yet (`public/images/`); the rest of the
  image slots render as labeled placeholders, same as the mockup.
- The map fetches world geometry from a public CDN
  (`cdn.jsdelivr.net/npm/world-atlas`) at runtime, same as the mockup — fine
  in production, but blocked by some restrictive dev sandboxes/proxies.
