// Reference layer only — European train lines (day and night) that run
// commercially, but that voyage en rail has NOT personally ridden. Kept
// deliberately separate from routes.ts: no itinerary, no price, no CO2
// figure is invented for these, because none of that has been verified at
// bord. The map renders them thin and grey, distinct from the 9 lines we've
// actually done, and links out to the operator instead of a récit.
//
// This list is curated and non-exhaustive on purpose — the goal is "the
// major lines, for context," not a full European timetable. Back-on-Track
// (https://back-on-track.eu/night-train-map/) tracks the full night-train
// network, and Chronotrains (https://chronotrains.com) computes real
// reachability from any station in Europe — both are linked from /carte
// for anyone who wants that completeness rather than what fits here.
// Compiled from public route information as of September 2026; schedules
// change (night trains especially) — verify before booking, same
// disclaimer as everywhere else on this site.

export type ReferenceRoute = {
  id: string;
  name: string;
  operator: string;
  mapPts: string[];
  infoUrl: string;
  note?: string;
  kind: 'nuit' | 'jour';
};

// City coordinates used only by these reference lines, additional to
// CITY_COORDS in routes.ts (merged together by the map component).
export const REFERENCE_EXTRA_COORDS: Record<string, [number, number]> = {
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
  seville: [-5.98, 37.39],
  naples: [14.27, 40.85],
  turin: [7.68, 45.07],
  geneva: [6.14, 46.20],
  basel: [7.59, 47.56],
  lille: [3.06, 50.63],
  stuttgart: [9.18, 48.78],
};

// A few extra hub labels worth showing on the map once these lines are
// drawn (not hubs of our own 9-line network).
export const REFERENCE_EXTRA_HUBS: [string, string][] = [
  ['warsaw', 'Varsovie'],
  ['prague', 'Prague'],
  ['oslo', 'Oslo'],
  ['edinburgh', 'Édimbourg'],
  ['seville', 'Séville'],
  ['naples', 'Naples'],
  ['geneva', 'Genève'],
];

export const REFERENCE_ROUTES: ReferenceRoute[] = [
  // — Nuit — (Nightjet, European Sleeper, Snälltåget, Trenhotel, PKP/EuroNight, Caledonian Sleeper)
  { id: 'nj-vie-ams', name: 'Vienne → Amsterdam', operator: 'Nightjet (ÖBB/DB)', mapPts: ['vienna', 'munich', 'cologne', 'amsterdam'], infoUrl: 'https://www.nightjet.com', kind: 'nuit' },
  { id: 'nj-vie-brx', name: 'Vienne → Bruxelles', operator: 'Nightjet (ÖBB/DB)', mapPts: ['vienna', 'munich', 'cologne', 'brussels'], infoUrl: 'https://www.nightjet.com', note: '3 fois par semaine', kind: 'nuit' },
  { id: 'nj-vie-ham', name: 'Vienne → Hambourg', operator: 'Nightjet (ÖBB/DB)', mapPts: ['vienna', 'munich', 'hamburg'], infoUrl: 'https://www.nightjet.com', kind: 'nuit' },
  { id: 'nj-inn-ham', name: 'Innsbruck → Hambourg', operator: 'Nightjet (ÖBB/DB)', mapPts: ['innsbruck', 'munich', 'hamburg'], infoUrl: 'https://www.nightjet.com', kind: 'nuit' },
  { id: 'nj-vie-zur', name: 'Vienne → Zurich', operator: 'Nightjet (ÖBB)', mapPts: ['vienna', 'zurich'], infoUrl: 'https://www.nightjet.com', kind: 'nuit' },
  { id: 'nj-mun-rom', name: 'Munich → Rome', operator: 'Nightjet (ÖBB/DB)', mapPts: ['munich', 'bologna', 'florence', 'rome'], infoUrl: 'https://www.nightjet.com', kind: 'nuit' },
  { id: 'nj-vie-rom', name: 'Vienne → Rome', operator: 'Nightjet (ÖBB)', mapPts: ['vienna', 'florence', 'rome'], infoUrl: 'https://www.nightjet.com', kind: 'nuit' },
  { id: 'nj-vie-ven', name: 'Vienne → Venise', operator: 'Nightjet (ÖBB)', mapPts: ['vienna', 'venice'], infoUrl: 'https://www.nightjet.com', kind: 'nuit' },
  { id: 'nj-vie-mil', name: 'Vienne → Milan', operator: 'Nightjet (ÖBB)', mapPts: ['vienna', 'innsbruck', 'milan'], infoUrl: 'https://www.nightjet.com', kind: 'nuit' },
  { id: 'es-brx-prg', name: 'Bruxelles → Prague', operator: 'European Sleeper', mapPts: ['brussels', 'amsterdam', 'berlin', 'dresden', 'prague'], infoUrl: 'https://europeansleeper.eu', note: '2 à 3 fois par semaine', kind: 'nuit' },
  { id: 'es-par-ber', name: 'Paris → Berlin', operator: 'European Sleeper', mapPts: ['paris', 'brussels', 'berlin'], infoUrl: 'https://europeansleeper.eu', note: 'depuis mars 2026', kind: 'nuit' },
  { id: 'es-brx-mil', name: 'Bruxelles → Milan', operator: 'European Sleeper', mapPts: ['brussels', 'liege', 'zurich', 'como', 'milan'], infoUrl: 'https://europeansleeper.eu', note: 'prévue sept. 2026 — date déjà repoussée une fois, à vérifier', kind: 'nuit' },
  { id: 'sn-ber-sto', name: 'Berlin → Stockholm', operator: 'Snälltåget', mapPts: ['berlin', 'copenhagen', 'stockholm'], infoUrl: 'https://www.snalltaget.se', kind: 'nuit' },
  { id: 'sn-ber-osl', name: 'Berlin → Oslo', operator: 'Snälltåget', mapPts: ['berlin', 'copenhagen', 'gothenburg', 'oslo'], infoUrl: 'https://www.snalltaget.se', note: 'depuis juin 2026', kind: 'nuit' },
  { id: 'rf-bcn-mad-n', name: 'Barcelone → Madrid (Trenhotel)', operator: 'Trenhotel (Renfe)', mapPts: ['barcelona', 'madrid'], infoUrl: 'https://www.renfe.com', kind: 'nuit' },
  { id: 'pkp-prz-mun', name: 'Przemyśl → Munich', operator: 'EuroNight Carpatia (PKP)', mapPts: ['przemysl', 'krakow', 'vienna', 'munich'], infoUrl: 'https://www.pkpintercity.pl', note: 'depuis déc. 2025', kind: 'nuit' },
  { id: 'pkp-var-vie', name: 'Varsovie → Vienne', operator: 'Chopin (PKP/ÖBB)', mapPts: ['warsaw', 'bratislava', 'vienna'], infoUrl: 'https://www.pkpintercity.pl', kind: 'nuit' },
  { id: 'pkp-var-bud', name: 'Varsovie → Budapest', operator: 'Chopin (PKP/MÁV)', mapPts: ['warsaw', 'bratislava', 'budapest'], infoUrl: 'https://www.pkpintercity.pl', kind: 'nuit' },
  { id: 'cs-lon-edi', name: 'Londres → Édimbourg / Glasgow', operator: 'Caledonian Sleeper (Lowland)', mapPts: ['london', 'edinburgh'], infoUrl: 'https://www.sleeper.scot', kind: 'nuit' },
  { id: 'cs-lon-inv', name: 'Londres → Inverness / Aberdeen / Fort William', operator: 'Caledonian Sleeper (Highland)', mapPts: ['london', 'edinburgh', 'inverness'], infoUrl: 'https://www.sleeper.scot', kind: 'nuit' },

  // — Jour — grandes lignes à grande vitesse (TGV, ICE, AVE, Frecciarossa, Eurostar, SBB)
  { id: 'tgv-par-mar', name: 'Paris → Lyon → Marseille', operator: 'TGV inOui (SNCF)', mapPts: ['paris', 'lyon', 'marseille'], infoUrl: 'https://www.sncf-connect.com', kind: 'jour' },
  { id: 'tgv-par-bor', name: 'Paris → Bordeaux', operator: 'TGV inOui (SNCF)', mapPts: ['paris', 'bordeaux'], infoUrl: 'https://www.sncf-connect.com', kind: 'jour' },
  { id: 'tgv-par-str', name: 'Paris → Strasbourg', operator: 'TGV inOui (SNCF)', mapPts: ['paris', 'strasbourg'], infoUrl: 'https://www.sncf-connect.com', kind: 'jour' },
  { id: 'es-par-brx-ams', name: 'Paris → Bruxelles → Amsterdam', operator: 'Eurostar (ex-Thalys)', mapPts: ['paris', 'lille', 'brussels', 'amsterdam'], infoUrl: 'https://www.eurostar.com', kind: 'jour' },
  { id: 'es-brx-col', name: 'Bruxelles → Cologne', operator: 'Eurostar (ex-Thalys)', mapPts: ['brussels', 'cologne'], infoUrl: 'https://www.eurostar.com', kind: 'jour' },
  { id: 'ice-ber-mun', name: 'Berlin → Munich', operator: 'ICE (Deutsche Bahn)', mapPts: ['berlin', 'munich'], infoUrl: 'https://www.bahn.de', kind: 'jour' },
  { id: 'ice-fra-ham', name: 'Francfort → Cologne → Hambourg', operator: 'ICE (Deutsche Bahn)', mapPts: ['frankfurt', 'cologne', 'hamburg'], infoUrl: 'https://www.bahn.de', kind: 'jour' },
  { id: 'ice-mun-fra', name: 'Munich → Stuttgart → Francfort', operator: 'ICE (Deutsche Bahn)', mapPts: ['munich', 'stuttgart', 'frankfurt'], infoUrl: 'https://www.bahn.de', kind: 'jour' },
  { id: 'ave-mad-bcn', name: 'Madrid → Barcelone', operator: 'AVE (Renfe)', mapPts: ['madrid', 'barcelona'], infoUrl: 'https://www.renfe.com', kind: 'jour' },
  { id: 'ave-mad-sev', name: 'Madrid → Séville', operator: 'AVE (Renfe)', mapPts: ['madrid', 'seville'], infoUrl: 'https://www.renfe.com', kind: 'jour' },
  { id: 'fr-mil-rom-nap', name: 'Milan → Rome → Naples', operator: 'Frecciarossa (Trenitalia)', mapPts: ['milan', 'rome', 'naples'], infoUrl: 'https://www.trenitalia.com', kind: 'jour' },
  { id: 'fr-tur-mil-ven', name: 'Turin → Milan → Venise', operator: 'Frecciarossa (Trenitalia)', mapPts: ['turin', 'milan', 'venice'], infoUrl: 'https://www.trenitalia.com', kind: 'jour' },
  { id: 'sbb-zur-gen', name: 'Zurich → Genève', operator: 'SBB/CFF/FFS', mapPts: ['zurich', 'geneva'], infoUrl: 'https://www.sbb.ch', kind: 'jour' },
  { id: 'sbb-zur-bas', name: 'Zurich → Bâle', operator: 'SBB/CFF/FFS', mapPts: ['zurich', 'basel'], infoUrl: 'https://www.sbb.ch', kind: 'jour' },
];
