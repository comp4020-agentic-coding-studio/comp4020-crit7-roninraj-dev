# Process overview

## What I built

A live stop board for the ANU–Civic Loop bus: a map of the real 12 stops, a
computed timetable, a "find my nearest stop" walking-directions button, and a
crowd-sourced sighting feed (report what you see at a stop, everyone else's
tab updates live) — the piece the real service is missing, since the loop has
no live tracking.

## How I got here

The starter ships a minimal guestbook (SQLite + SSE) as a worked example of
the platform, with a note to delete it once replaced. Rather than delete it, I
kept its two platform guarantees — a write persists through SQLite, and every
open tab hears about a new one over SSE — and retargeted them at this app's
own shape: a sighting tied to a stop, not a flat message.

- [`0a0953b`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-roninraj-dev/commit/0a0953b)
  renamed the schema from `messages` to `sightings` with a `stop` column.
- [`07b6d1f`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-roninraj-dev/commit/07b6d1f)
  renamed the SSE event and added `src/lib/stops.ts` — the actual stop list
  and schedule, sourced from ANU's own published Civic Loop timetable page
  rather than invented. First-pass coordinates here were hand-estimated from
  street names, flagged with a `ponytail:` comment.
- [`8a63160`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-roninraj-dev/commit/8a63160)
  built the actual page: Leaflet + OpenStreetMap tiles (no API key needed),
  the report form, and the live sighting list wired to the existing SSE
  stream.
- [`d257525`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-roninraj-dev/commit/d257525)
  adapted the starter's own plumbing spec (`spec/guestbook.test.ts` →
  `spec/sightings.test.ts`) onto the new shape, rather than deleting it —
  it's still the one check that would catch a broken persistence or SSE path.
- [`2750fc0`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-roninraj-dev/commit/2750fc0)
  replaced the estimated coordinates with the precise points from ANU's own
  published route map (a Google My Maps export the person I'm building this
  for pointed me at), and added the timetable and navigation asked for on
  review: a per-stop timetable projected from the published first/last
  departure, frequency and each stop's measured position in the loop; and a
  geolocation button that finds the visitor's nearest stop and links out to
  walking directions.

Correction loop: the first coordinate pass was my own estimate from street
names and came back visibly wrong when checked against the real map — I
re-sourced from the KML export of ANU's own route map instead of re-guessing,
which is why every stop lat/lng in `stops.ts` now cites that source directly.

I ran `pnpm check` after each schema/route/page change (28 tests, typecheck)
and smoke-tested the live persistence path against the deployed Fly URL with a
plain `curl` POST-then-reload before calling it done, since the spec's actual
requirement is that the *deployed* app persists across a reload, not just that
local tests pass.

## What I chose not to build

No login or per-user identity, no moderation or accuracy-weighting of
reports, no real-time vehicle GPS (the sighting board is the deliberate
stand-in for that). The timetable is a computed projection from public
schedule data, not a live feed — marked with a `ponytail:` comment in
`stops.ts` naming that ceiling.
