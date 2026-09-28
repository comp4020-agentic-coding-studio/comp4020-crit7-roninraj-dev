# Your harness

- The core flow (report a sighting, reload, still there) must go through
  SQLite via `src/lib/db.ts`, never in-memory state — that's the thing the
  spec actually checks ("persists across a reload").
- Stop names, order and schedule come from ANU's own published Civic Loop
  timetable (`src/lib/stops.ts` cites the source) — never invent a stop or a
  time, correct against the source page instead.
- Mark any hand-placed/approximate value (coordinates, mock data) with a
  `ponytail:` comment naming what would need to happen to make it exact.
