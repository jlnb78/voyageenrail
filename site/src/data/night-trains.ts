// Reference layer only — European night train lines that exist and run
// commercially, but that voyage en rail has NOT personally ridden. Kept
// deliberately separate from routes.ts: no itinerary, no price, no CO2
// figure is invented for these, because none of that has been verified at
// bord. The map renders them thin and grey, distinct from the 9 lines we've
// actually done, and links out to the operator (or Back-on-Track) instead
// of a récit.
//
// This list is short and curated (~20 lines), not exhaustive — Back-on-Track
// (https://back-on-track.eu/night-train-map/) tracks the full European
// network (~200 lines in 2026) and is the source to point people to for
// anything current beyond this list. Compiled from public route
// announcements as of September 2026; night train schedules change often —
// verify before booking, same disclaimer as everywhere else on this site.

export type NightTrainRef = {
  id: string;
  name: string;
  operator: string;
  mapPts: string[];
  infoUrl: string;
  note?: string;
};

// City coordinates used only by these reference lines, additional to
// CITY_COORDS in routes.ts (merged together by the map component).
export const NIGHT_TRAIN_EXTRA_COORDS: Record<string, [number, number]> = {
  venice: [12.33, 45.44],
  innsbruck: [11.40, 47.27],
  prague: [14.42, 50.09],
  warsaw: [21.01, 52.23],
  krakow: [19.94, 50.06],
  bratislava: [17.11, 48.15],
  przemysl: [22.77, 49.78],
  dresden: [13.74, 51.05],
  edinburgh: [-3.19, 55.95],
  inverness: [-4.22, 57.48],
  oslo: [10.75, 59.91],
  gothenburg: [11.97, 57.71],
  como: [9.09, 45.81],
  liege: [5.57, 50.63],
};

// A few extra hub labels worth showing on the map once these lines are
// drawn (Warsaw, Prague, Oslo, Edinburgh aren't hubs of our own network).
export const NIGHT_TRAIN_EXTRA_HUBS: [string, string][] = [
  ['warsaw', 'Varsovie'],
  ['prague', 'Prague'],
  ['oslo', 'Oslo'],
  ['edinburgh', 'Édimbourg'],
];

export const NIGHT_TRAIN_REFS: NightTrainRef[] = [
  { id: 'nj-vie-ams', name: 'Vienne → Amsterdam', operator: 'Nightjet (ÖBB/DB)', mapPts: ['vienna', 'munich', 'cologne', 'amsterdam'], infoUrl: 'https://www.nightjet.com' },
  { id: 'nj-vie-brx', name: 'Vienne → Bruxelles', operator: 'Nightjet (ÖBB/DB)', mapPts: ['vienna', 'munich', 'cologne', 'brussels'], infoUrl: 'https://www.nightjet.com', note: '3 fois par semaine' },
  { id: 'nj-vie-ham', name: 'Vienne → Hambourg', operator: 'Nightjet (ÖBB/DB)', mapPts: ['vienna', 'munich', 'hamburg'], infoUrl: 'https://www.nightjet.com' },
  { id: 'nj-inn-ham', name: 'Innsbruck → Hambourg', operator: 'Nightjet (ÖBB/DB)', mapPts: ['innsbruck', 'munich', 'hamburg'], infoUrl: 'https://www.nightjet.com' },
  { id: 'nj-vie-zur', name: 'Vienne → Zurich', operator: 'Nightjet (ÖBB)', mapPts: ['vienna', 'zurich'], infoUrl: 'https://www.nightjet.com' },
  { id: 'nj-mun-rom', name: 'Munich → Rome', operator: 'Nightjet (ÖBB/DB)', mapPts: ['munich', 'bologna', 'florence', 'rome'], infoUrl: 'https://www.nightjet.com' },
  { id: 'nj-vie-rom', name: 'Vienne → Rome', operator: 'Nightjet (ÖBB)', mapPts: ['vienna', 'florence', 'rome'], infoUrl: 'https://www.nightjet.com' },
  { id: 'nj-vie-ven', name: 'Vienne → Venise', operator: 'Nightjet (ÖBB)', mapPts: ['vienna', 'venice'], infoUrl: 'https://www.nightjet.com' },
  { id: 'nj-vie-mil', name: 'Vienne → Milan', operator: 'Nightjet (ÖBB)', mapPts: ['vienna', 'innsbruck', 'milan'], infoUrl: 'https://www.nightjet.com' },
  { id: 'es-brx-prg', name: 'Bruxelles → Prague', operator: 'European Sleeper', mapPts: ['brussels', 'amsterdam', 'berlin', 'dresden', 'prague'], infoUrl: 'https://europeansleeper.eu', note: '2 à 3 fois par semaine' },
  { id: 'es-par-ber', name: 'Paris → Berlin', operator: 'European Sleeper', mapPts: ['paris', 'brussels', 'berlin'], infoUrl: 'https://europeansleeper.eu', note: 'depuis mars 2026' },
  { id: 'es-brx-mil', name: 'Bruxelles → Milan', operator: 'European Sleeper', mapPts: ['brussels', 'liege', 'zurich', 'como', 'milan'], infoUrl: 'https://europeansleeper.eu', note: 'prévue sept. 2026 — date déjà repoussée une fois, à vérifier' },
  { id: 'sn-ber-sto', name: 'Berlin → Stockholm', operator: 'Snälltåget', mapPts: ['berlin', 'copenhagen', 'stockholm'], infoUrl: 'https://www.snalltaget.se' },
  { id: 'sn-ber-osl', name: 'Berlin → Oslo', operator: 'Snälltåget', mapPts: ['berlin', 'copenhagen', 'gothenburg', 'oslo'], infoUrl: 'https://www.snalltaget.se', note: 'depuis juin 2026' },
  { id: 'rf-bcn-mad', name: 'Barcelone → Madrid', operator: 'Trenhotel (Renfe)', mapPts: ['barcelona', 'madrid'], infoUrl: 'https://www.renfe.com' },
  { id: 'pkp-prz-mun', name: 'Przemyśl → Munich', operator: 'EuroNight Carpatia (PKP)', mapPts: ['przemysl', 'krakow', 'vienna', 'munich'], infoUrl: 'https://www.pkpintercity.pl', note: 'depuis déc. 2025' },
  { id: 'pkp-var-vie', name: 'Varsovie → Vienne', operator: 'Chopin (PKP/ÖBB)', mapPts: ['warsaw', 'bratislava', 'vienna'], infoUrl: 'https://www.pkpintercity.pl' },
  { id: 'pkp-var-bud', name: 'Varsovie → Budapest', operator: 'Chopin (PKP/MÁV)', mapPts: ['warsaw', 'bratislava', 'budapest'], infoUrl: 'https://www.pkpintercity.pl' },
  { id: 'cs-lon-edi', name: 'Londres → Édimbourg / Glasgow', operator: 'Caledonian Sleeper (Lowland)', mapPts: ['london', 'edinburgh'], infoUrl: 'https://www.sleeper.scot' },
  { id: 'cs-lon-inv', name: 'Londres → Inverness / Aberdeen / Fort William', operator: 'Caledonian Sleeper (Highland)', mapPts: ['london', 'edinburgh', 'inverness'], infoUrl: 'https://www.sleeper.scot' },
];
