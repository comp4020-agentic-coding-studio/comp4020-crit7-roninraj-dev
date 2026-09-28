// Real stops, coordinates and timetable for the ANU–Civic Loop bus
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
  /** minutes after the loop's Rimmer Street departure this stop is reached on a normal run */
  offsetMinutes: number;
  /** only served on one specific run per day — see `canberraCentreDeparture` below */
  specialOnly?: boolean;
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
    specialOnly: true,
    note: "6:48pm service only",
  },
  { id: "alinga", name: "City West Alinga Street", lat: -35.2780715, lng: 149.1269798, offsetMinutes: 2 },
  {
    id: "marcus-clarke",
    name: "Marcus Clarke Street after Farrell Place",
    lat: -35.2812347,
    lng: 149.1240973,
    offsetMinutes: 5,
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
    offsetMinutes: 7,
  },
  { id: "ward", name: "Ward Street (via Yukeembruk)", lat: -35.2810065, lng: 149.1129976, offsetMinutes: 8 },
  { id: "dickson", name: "Dickson Road (via Wamburun)", lat: -35.2777532, lng: 149.1135012, offsetMinutes: 12 },
  {
    id: "daley-burton-garran",
    name: "Daley Road at Burton & Garran Hall",
    lat: -35.2763621,
    lng: 149.1155729,
    offsetMinutes: 13,
  },
  {
    id: "daley-bruce",
    name: "Daley Road at Bruce Hall",
    lat: -35.2741269,
    lng: 149.1173918,
    offsetMinutes: 14,
  },
  {
    id: "daley-fulton-muir",
    name: "Daley Road at Fulton Muir",
    lat: -35.2737073,
    lng: 149.1204985,
    offsetMinutes: 15,
  },
];

// Every "ANU Rimmer Street" departure, Mon-Fri, minutes since midnight —
// transcribed straight from the published timetable, not a computed
// approximation: it's a flat 25-minute headway all day *except* the very
// last service, which runs 38 minutes after the second-last one (7:18pm,
// not the 7:05pm a uniform headway would predict).
export const rimmerDepartures = [
  470, 495, 520, 545, 570, 595, 620, 645, 670, 695, 720, 745, 770, 795, 820, 845, 870, 895, 920, 945, 970, 995, 1020,
  1045, 1070, 1095, 1120, 1158,
];

export const schedule = {
  days: "Monday to Friday",
  firstMinutes: rimmerDepartures[0],
  lastMinutes: rimmerDepartures[rimmerDepartures.length - 1],
  frequencyMinutes: 25,
};

function formatTime(minutesSinceMidnight: number): string {
  const h24 = Math.floor(minutesSinceMidnight / 60) % 24;
  const m = Math.round(minutesSinceMidnight % 60);
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const suffix = h24 < 12 ? "am" : "pm";
  return `${h12}:${String(m).padStart(2, "0")}${suffix}`;
}

// The timetable's Canberra Centre column only ever has one time in it: 6:48pm,
// 8 minutes after the second-last (6:40pm) Rimmer Street departure. Every
// other run skips it, so it isn't part of the regular offset table above.
const canberraCentreDeparture = rimmerDepartures[rimmerDepartures.length - 2] + 8;

export function nextDeparturesFor(stop: Stop, count = 3, now = new Date()): string[] {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  if (stop.specialOnly) {
    return canberraCentreDeparture > nowMinutes ? [formatTime(canberraCentreDeparture)] : [];
  }
  return rimmerDepartures
    .map((departure) => departure + stop.offsetMinutes)
    .filter((time) => time > nowMinutes)
    .slice(0, count)
    .map(formatTime);
}
