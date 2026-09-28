# ANU–Civic Loop, live stop board

The ANU system I actually deal with: the free Civic Loop bus runs every
20–25 minutes but has no live tracking, so every wait at a stop is a guess —
did it just leave, or is it 20 minutes out? This is the crowd-sourced fix:
anyone at a stop taps out what they see ("just left", "5 min late", "packed"),
it lands in SQLite, and every open tab sees it appear over SSE within a
second, no reload needed.

## What good looks like here

The real timetable and stop names come from ANU's own Civic Loop page,
committed in `src/lib/stops.ts` — a wish-list app that invents its own bus
schedule proves nothing. The one enforced rule (`CLAUDE.md`): the core
flow (submit a sighting, reload, still there) goes through SQLite, not
in-memory state, because "does it survive a reload" is exactly the spec line
this build has to satisfy.

What I chose not to build: no login, no per-user identity, no accuracy
weighting or moderation of reports — this is a proof-of-life slice, not the
finished thing. The map pins are hand-placed approximate coordinates, not
surveyed GPS (see the `ponytail:` comment in `stops.ts`) — good enough to
show which loop segment a stop is on, not for turn-by-turn walking directions.
