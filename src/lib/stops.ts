// Real stops, coordinates and schedule for the ANU–Civic Loop bus
// (clockwise), from ANU's own published sources as of 2026-09-28:
// - timetable: https://sustainability.anu.edu.au/strategy/transport/anu-civic-loop-bus-timetable
// - stop coordinates: ANU's "17 August Route" layer of its own Google My Maps
//   route map (mid=1kH5yzlqHpQHaOBcTbfi9e9YK6UdnjIE)
// The University Avenue stop on that map was discontinued 2026-09-07 per the
// timetable page, so it's left out here.
export type Stop = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  /** minutes after the loop's Rimmer Street departure this stop is reached */
  offsetMinutes: number;
  note?: string;
};

export const stops: Stop[] = [
  { id: "rimmer", name: "ANU Rimmer Street", lat: -35.2762161, lng: 149.1255564, offsetMinutes: 0 },
  {
    id: "canberra-centre",
    name: "Canberra Centre (Ainslie Avenue)",
    lat: -35.2798581,
    lng: 149.1337936,
    offsetMinutes: 8,
    note: "6:48pm service only",
  },
  { id: "alinga", name: "City West Alinga Street", lat: -35.2780715, lng: 149.1269798, offsetMinutes: 2 },
  {
    id: "marcus-clarke",
    name: "Marcus Clarke Street after Farrell Place",
    lat: -35.2812347,
    lng: 149.1240973,
    offsetMinutes: 4,
  },
  {
    id: "liversidge",
    name: "Liversidge Street after Ellery Crescent",
    lat: -35.282481,
    lng: 149.1208697,
    offsetMinutes: 6,
  },
  {
    id: "garran-liversidge",
    name: "Garran Road after Liversidge Street",
    lat: -35.2831907,
    lng: 149.1191311,
    offsetMinutes: 7,
  },
  {
    id: "graduate-house",
    name: "Garran Road at Graduate House",
    lat: -35.2823591,
    lng: 149.1162337,
    offsetMinutes: 9,
  },
  { id: "ward", name: "Ward Street (via Yukeembruk)", lat: -35.2810065, lng: 149.1129976, offsetMinutes: 11 },
  { id: "dickson", name: "Dickson Road (via Wamburun)", lat: -35.2777532, lng: 149.1135012, offsetMinutes: 13 },
  {
    id: "daley-burton-garran",
    name: "Daley Road at Burton & Garran Hall",
    lat: -35.2763621,
    lng: 149.1155729,
    offsetMinutes: 14,
  },
  {
    id: "daley-bruce",
    name: "Daley Road at Bruce Hall",
    lat: -35.2741269,
    lng: 149.1173918,
    offsetMinutes: 15,
  },
  {
    id: "daley-fulton-muir",
    name: "Daley Road at Fulton Muir",
    lat: -35.2737073,
    lng: 149.1204985,
    offsetMinutes: 17,
  },
];

export const schedule = {
  days: "Monday to Friday",
  firstMinutes: 7 * 60 + 50, // 7:50am
  lastMinutes: 19 * 60 + 18, // 7:18pm
  frequencyMinutes: 22, // published as "every 20-25 minutes"; 22 is the midpoint used for the computed timetable below
};

function formatTime(minutesSinceMidnight: number): string {
  const h24 = Math.floor(minutesSinceMidnight / 60) % 24;
  const m = Math.round(minutesSinceMidnight % 60);
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const suffix = h24 < 12 ? "am" : "pm";
  return `${h12}:${String(m).padStart(2, "0")}${suffix}`;
}

// The published timetable gives a first/last departure and a frequency band
// for the loop's start (Rimmer Street), not a per-stop timetable — so this
// projects each stop's arrivals from that plus its measured offset into the
// loop.
// ponytail: a fixed 22-minute headway and straight per-stop offsets, not the
// real (20-25 min, traffic-dependent) timing — upgrade to real-time
// vehicle positions if ANU ever exposes them; the sightings board is the
// stand-in for that until then.
export function nextDeparturesFor(stop: Stop, count = 3, now = new Date()): string[] {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const times: string[] = [];
  let trip = Math.ceil((nowMinutes - stop.offsetMinutes - schedule.firstMinutes) / schedule.frequencyMinutes);
  if (trip < 0) trip = 0;
  while (times.length < count) {
    const departureAtRimmer = schedule.firstMinutes + trip * schedule.frequencyMinutes;
    if (departureAtRimmer > schedule.lastMinutes) break;
    times.push(formatTime(departureAtRimmer + stop.offsetMinutes));
    trip += 1;
  }
  return times;
}
