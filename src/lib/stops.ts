// Real stops and schedule for the ANU–Civic Loop bus (clockwise), from
// https://sustainability.anu.edu.au/strategy/transport/anu-civic-loop-bus-timetable
// as of 2026-09-28. Coordinates are approximate campus/street locations, not
// surveyed GPS fixes.
// ponytail: hand-placed coordinates, geocode properly (Nominatim) if a stop
// pin needs to be accurate rather than roughly-in-the-right-place.
export type Stop = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  note?: string;
};

export const stops: Stop[] = [
  { id: "rimmer", name: "ANU Rimmer Street", lat: -35.2789, lng: 149.1211 },
  {
    id: "canberra-centre",
    name: "Canberra Centre (Ainslie Avenue)",
    lat: -35.2802,
    lng: 149.131,
    note: "6:48pm service only",
  },
  { id: "alinga", name: "City West Alinga Street", lat: -35.2779, lng: 149.1291 },
  { id: "marcus-clarke", name: "Marcus Clarke Street after Farrell Place", lat: -35.2793, lng: 149.1276 },
  { id: "liversidge", name: "Liversidge Street after Ellery Crescent", lat: -35.2801, lng: 149.1221 },
  { id: "garran-liversidge", name: "Garran Road after Liversidge Street", lat: -35.279, lng: 149.1214 },
  { id: "graduate-house", name: "Garran Road at Graduate House", lat: -35.2779, lng: 149.12 },
  { id: "ward", name: "Ward Street (via Yukeembruk)", lat: -35.2762, lng: 149.1188 },
  { id: "dickson", name: "Dickson Road (via Wamburun)", lat: -35.2751, lng: 149.1183 },
  { id: "daley-burton-garran", name: "Daley Road at Burton & Garran Hall", lat: -35.2765, lng: 149.117 },
  { id: "daley-bruce", name: "Daley Road at Bruce Hall", lat: -35.2775, lng: 149.116 },
  { id: "daley-fulton-muir", name: "Daley Road at Fulton Muir", lat: -35.2785, lng: 149.1175 },
];

export const schedule = {
  days: "Monday to Friday",
  first: "7:50am",
  last: "7:18pm",
  frequencyMinutes: "20–25",
};
