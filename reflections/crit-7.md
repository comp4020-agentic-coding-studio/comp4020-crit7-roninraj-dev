# Crit-7

This crit was inspired by how often i had to use the bus map for the civic bus
loop and how infuriating it was to use it. i decided to make a bus map that was
more user friendly and easier to read and plan.

## Breakthrough

The real breakthrough wasn't the map, it was distrusting my own numbers. My
first pass at stop coordinates was hand-estimated from street names, and it
looked fine until I actually checked it against ANU's published route map — the
pins were visibly off. The fix wasn't to guess more carefully, it was to stop
guessing: I pulled the KML export of ANU's own "17 August Route" layer and used
those points directly, and did the same thing again for the timetable — instead
of interpolating a "20-25 minutes" band into a flat frequency, I transcribed the
actual published departure list, which is what caught the last service of the
day breaking cadence (38 minutes after the second-last, not the ~25 a uniform
headway predicts) and the one-run-only Canberra Centre detour. Every time I
computed an approximation instead of reading the source, the approximation was
wrong somewhere a real user would hit it.

## What this changed

I used to treat "looks plausible" as good enough for anything that wasn't the
core logic — coordinates, schedules, the boring data off to the side. This crit
changed that: the parts of this app a rider actually depends on (where's the
stop, when's the next bus) are exactly the parts I was tempted to eyeball. Going
forward I want to default to citing a source for any value I can't derive, and
to treat a computed approximation as a placeholder to be replaced, not a
finished answer — with a `ponytail:` comment marking which one it is until
then.
