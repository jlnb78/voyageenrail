// Single source of truth for the 9 lines voyage en rail has actually ridden —
// the map (src/components/EuropeMap.astro), the calculateur, and each récit's
// itinerary sidebar all read from here. This is exactly the `routes.json` the
// design chat described: "nom, villes traversées, durée, prix, lien vers le
// récit. Ajouter une ligne = ajouter un bloc de six lignes."
//
// Distances are real-geometry estimates (haversine between the same city
// coordinates the map draws, with a route-shape multiplier for rail/road).
// Prices and on-board detail are the plausible-but-to-verify figures carried
// over from the mockup. Revisit yearly alongside the CO2 factors.

export type ItineraryStep = {
  time: string;
  place: string;
  title: string;
  desc: string;
  kind: 'depart' | 'stop' | 'arrive';
};

export type Route = {
  id: string;
  name: string;
  from: string;
  to: string;
  viaCities: string[];
  accent: 1 | 2;
  tag: 'nuit' | 'sans-reservation' | 'standard';
  mapPts: string[]; // keys into CITY_COORDS, used to draw the line
  // Train
  trainKm: number;
  trainDurationMin: number; // one-way, in-vehicle
  trainPriceBase2nd: number; // one-way, per adult, EUR
  multiDay?: { nights: number };
  // Plane (comparison)
  planeKm: number;
  planeFlightMin: number;
  planePriceBase: number;
  // Car (comparison)
  carKm: number;
  carDurationMin: number;
  carPriceBase: number; // one-way, tolls + fuel, per vehicle
  itinerary: ItineraryStep[];
};

export const CITY_COORDS: Record<string, [number, number]> = {
  paris: [2.35, 48.86], london: [-0.13, 51.51], brussels: [4.35, 50.85], amsterdam: [4.90, 52.37],
  cologne: [6.96, 50.94], frankfurt: [8.68, 50.11], strasbourg: [7.75, 48.58], berlin: [13.40, 52.52],
  munich: [11.58, 48.14], salzburg: [13.05, 47.81], vienna: [16.37, 48.21], budapest: [19.04, 47.50],
  ljubljana: [14.51, 46.06], zagreb: [15.98, 45.81], zurich: [8.54, 47.38], milan: [9.19, 45.46],
  bologna: [11.34, 44.49], florence: [11.26, 43.77], rome: [12.50, 41.90], genoa: [8.93, 44.41],
  ventimiglia: [7.60, 43.79], nice: [7.27, 43.70], marseille: [5.37, 43.30], montpellier: [3.88, 43.61],
  lyon: [4.84, 45.76], barcelona: [2.17, 41.39], bordeaux: [-0.58, 44.84], irun: [-1.79, 43.34],
  madrid: [-3.70, 40.42], lisbon: [-9.14, 38.72], hamburg: [9.99, 53.55], copenhagen: [12.57, 55.68],
  stockholm: [18.06, 59.33],
};

export const HUBS: [string, string][] = [
  ['paris', 'Paris'], ['london', 'Londres'], ['amsterdam', 'Amsterdam'], ['berlin', 'Berlin'],
  ['vienna', 'Vienne'], ['munich', 'Munich'], ['zurich', 'Zurich'], ['milan', 'Milan'], ['rome', 'Rome'],
  ['barcelona', 'Barcelone'], ['madrid', 'Madrid'], ['lisbon', 'Lisbonne'], ['copenhagen', 'Copenhague'],
  ['stockholm', 'Stockholm'], ['marseille', 'Marseille'],
];

export const ROUTES: Route[] = [
  {
    id: 'nightjet', name: 'Nightjet Paris → Vienne', from: 'Paris', to: 'Vienne',
    viaCities: ['Strasbourg', 'Munich', 'Salzbourg'], accent: 1, tag: 'nuit',
    mapPts: ['paris', 'strasbourg', 'munich', 'salzburg', 'vienna'],
    trainKm: 1208, trainDurationMin: 850, trainPriceBase2nd: 79,
    planeKm: 1033, planeFlightMin: 124, planePriceBase: 143,
    carKm: 1235, carDurationMin: 740, carPriceBase: 118,
    itinerary: [
      { time: '19:58', place: 'Paris Est', title: 'Nightjet 468, voiture 264, couchette à six', desc: "Embarquement voiture par voiture, vingt minutes avant le départ. Pas de contrôle à bord ensuite.", kind: 'depart' },
      { time: '06:12', place: 'Munich Hbf', title: 'Arrêt de 24 min', desc: 'Café sur le quai 12.', kind: 'stop' },
      { time: '08:01', place: 'Salzbourg', title: 'Traversée des Alpes bavaroises', desc: 'Côté droit pour les montagnes.', kind: 'stop' },
      { time: '10:08', place: 'Vienne Hbf', title: 'Arrivée · U1 vers le centre, 6 min', desc: 'Consigne à bagages disponible en gare.', kind: 'arrive' },
    ],
  },
  {
    id: 'iberie', name: 'Paris → Lisbonne', from: 'Paris', to: 'Lisbonne',
    viaCities: ['Bordeaux', 'Irun', 'Madrid'], accent: 1, tag: 'standard',
    mapPts: ['paris', 'bordeaux', 'irun', 'madrid', 'lisbon'],
    trainKm: 1790, trainDurationMin: 1180, trainPriceBase2nd: 148, multiDay: { nights: 2 },
    planeKm: 1453, planeFlightMin: 160, planePriceBase: 168,
    carKm: 1750, carDurationMin: 1080, carPriceBase: 205,
    itinerary: [
      { time: 'Jour 1 · 08:20', place: 'Paris Montparnasse', title: 'TGV inOui vers Bordeaux', desc: 'Correspondance confortable à Bordeaux Saint-Jean.', kind: 'depart' },
      { time: 'Jour 1 · 15:40', place: 'Irun (frontière)', title: 'Changement pour un train espagnol', desc: 'Écartement des voies différent : on change de train, pas seulement de quai.', kind: 'stop' },
      { time: 'Jour 2', place: 'Madrid', title: 'Nuit d’hôtel, puis correspondance', desc: 'Marge large recommandée : les correspondances ibériques ne sont pas garanties.', kind: 'stop' },
      { time: 'Jour 3', place: 'Lisbonne Santa Apolónia', title: 'Arrivée', desc: 'Trois jours, quatre trains, deux nuits d’hôtel — sans jamais décoller.', kind: 'arrive' },
    ],
  },
  {
    id: 'barcelone', name: 'Paris → Barcelone', from: 'Paris', to: 'Barcelone',
    viaCities: ['Montpellier'], accent: 1, tag: 'standard',
    mapPts: ['paris', 'lyon', 'montpellier', 'barcelona'],
    trainKm: 1040, trainDurationMin: 402, trainPriceBase2nd: 59,
    planeKm: 831, planeFlightMin: 115, planePriceBase: 138,
    carKm: 1048, carDurationMin: 620, carPriceBase: 145,
    itinerary: [
      { time: '07:44', place: 'Paris Lyon', title: 'TGV inOui 9712 · Paris → Barcelone', desc: 'Direct, 6 h 42. Voiture 14, places côté fenêtre à gauche pour les étangs de Sète. Prise 220 V à chaque siège, wifi irrégulier après Perpignan.', kind: 'depart' },
      { time: '10:51', place: 'Montpellier', title: 'Arrêt de 4 minutes', desc: 'Pas de descente utile. Le bar-buffet ouvre ici et ferme une heure avant l’arrivée.', kind: 'stop' },
      { time: '14:26', place: 'Barcelone Sants', title: 'Arrivée · métro L5 vers le centre en 9 minutes', desc: 'Consigne à bagages au niveau −1, 5,20 € la journée. Les billets de métro s’achètent aux bornes du hall sud, moins de queue.', kind: 'arrive' },
    ],
  },
  {
    id: 'riviera', name: 'La ligne lente de la Riviera', from: 'Marseille', to: 'Gênes',
    viaCities: ['Nice', 'Vintimille'], accent: 2, tag: 'sans-reservation',
    mapPts: ['marseille', 'nice', 'ventimiglia', 'genoa'],
    trainKm: 362, trainDurationMin: 480, trainPriceBase2nd: 38,
    planeKm: 311, planeFlightMin: 62, planePriceBase: 96,
    carKm: 380, carDurationMin: 260, carPriceBase: 58,
    itinerary: [
      { time: '08:12', place: 'Marseille-Saint-Charles', title: 'TER vers Nice', desc: 'Premier des quatre régionaux. Aucune réservation possible ni nécessaire.', kind: 'depart' },
      { time: '10:47', place: 'Nice-Ville', title: 'Correspondance, 18 min', desc: 'La ligne longe la mer presque sans interruption après Nice.', kind: 'stop' },
      { time: '11:35', place: 'Vintimille', title: 'Passage de frontière, changement pour un Trenitalia Regionale', desc: 'Billets italiens à composter avant de monter.', kind: 'stop' },
      { time: '16:18', place: 'Gênes Piazza Principe', title: 'Arrivée', desc: 'Huit heures, 38 € et la mer presque tout du long.', kind: 'arrive' },
    ],
  },
  {
    id: 'italie', name: 'Zurich → Rome', from: 'Zurich', to: 'Rome',
    viaCities: ['Milan', 'Bologne', 'Florence'], accent: 1, tag: 'standard',
    mapPts: ['zurich', 'milan', 'bologna', 'florence', 'rome'],
    trainKm: 841, trainDurationMin: 605, trainPriceBase2nd: 64,
    planeKm: 685, planeFlightMin: 94, planePriceBase: 112,
    carKm: 860, carDurationMin: 540, carPriceBase: 96,
    itinerary: [
      { time: '07:05', place: 'Zurich HB', title: 'EuroCity vers Milan, par le tunnel du Gothard', desc: 'Une heure entière sous les Alpes ; le nouveau tunnel de base a changé le trajet.', kind: 'depart' },
      { time: '10:20', place: 'Milan Centrale', title: 'Correspondance Frecciarossa', desc: 'Buffet de gare correct si la correspondance est courte.', kind: 'stop' },
      { time: '12:35', place: 'Florence Santa Maria Novella', title: 'Arrêt de 6 minutes', desc: 'Vue sur le Duomo depuis le quai côté ville par temps clair.', kind: 'stop' },
      { time: '13:10', place: 'Rome Termini', title: 'Arrivée', desc: 'Dix heures de train faisables avec deux enfants, si l’on choisit bien où s’asseoir.', kind: 'arrive' },
    ],
  },
  {
    id: 'nord', name: 'Amsterdam → Stockholm', from: 'Amsterdam', to: 'Stockholm',
    viaCities: ['Hambourg', 'Copenhague'], accent: 2, tag: 'nuit',
    mapPts: ['amsterdam', 'hamburg', 'copenhagen', 'stockholm'],
    trainKm: 1352, trainDurationMin: 1320, trainPriceBase2nd: 132, multiDay: { nights: 1 },
    planeKm: 1125, planeFlightMin: 131, planePriceBase: 121,
    carKm: 1330, carDurationMin: 850, carPriceBase: 158,
    itinerary: [
      { time: 'Jour 1 · 10:25', place: 'Amsterdam Centraal', title: 'ICE vers Hambourg', desc: 'Correspondance confortable, plus de deux heures de battement.', kind: 'depart' },
      { time: 'Jour 1 · 17:40', place: 'Hambourg Hbf', title: 'EuroCity de nuit vers Copenhague', desc: 'Couchette réservée à l’avance : le train est souvent complet en été.', kind: 'stop' },
      { time: 'Jour 2 · 07:15', place: 'Copenhague', title: 'Correspondance via le pont de l’Øresund', desc: 'Le ferry autrefois nécessaire est désormais évité par le pont-tunnel.', kind: 'stop' },
      { time: 'Jour 2 · 14:50', place: 'Stockholm Centralstation', title: 'Arrivée', desc: 'Une couchette, un ferry évité, le trajet nord le plus simple à organiser.', kind: 'arrive' },
    ],
  },
  {
    id: 'berlin', name: 'Paris → Berlin de jour', from: 'Paris', to: 'Berlin',
    viaCities: ['Strasbourg', 'Francfort'], accent: 1, tag: 'standard',
    mapPts: ['paris', 'strasbourg', 'frankfurt', 'berlin'],
    trainKm: 1154, trainDurationMin: 485, trainPriceBase2nd: 69,
    planeKm: 877, planeFlightMin: 110, planePriceBase: 109,
    carKm: 1080, carDurationMin: 620, carPriceBase: 132,
    itinerary: [
      { time: '07:55', place: 'Paris Est', title: 'TGV vers Francfort', desc: 'Direct jusqu’à Strasbourg, correspondance ICE ensuite.', kind: 'depart' },
      { time: '12:10', place: 'Francfort Hbf', title: 'Correspondance ICE', desc: 'Buffet et wifi fiable côté allemand.', kind: 'stop' },
      { time: '16:00', place: 'Berlin Hbf', title: 'Arrivée', desc: 'Huit heures, direct au changement près, un seul billet.', kind: 'arrive' },
    ],
  },
  {
    id: 'danube', name: 'Vienne → Zagreb', from: 'Vienne', to: 'Zagreb',
    viaCities: ['Ljubljana'], accent: 2, tag: 'sans-reservation',
    mapPts: ['vienna', 'ljubljana', 'zagreb'],
    trainKm: 454, trainDurationMin: 410, trainPriceBase2nd: 42,
    planeKm: 269, planeFlightMin: 58, planePriceBase: 89,
    carKm: 480, carDurationMin: 300, carPriceBase: 62,
    itinerary: [
      { time: '08:30', place: 'Vienne Hbf', title: 'EuroCity vers Ljubljana', desc: 'Deux heures de vallée qui valent la fenêtre, côté droit après Villach.', kind: 'depart' },
      { time: '13:05', place: 'Ljubljana', title: 'Changement, 35 min', desc: 'La traversée des Alpes juliennes se termine ici.', kind: 'stop' },
      { time: '15:20', place: 'Zagreb Glavni Kolodvor', title: 'Arrivée', desc: 'Sept heures pour 42 €, sans réservation obligatoire.', kind: 'arrive' },
    ],
  },
  {
    id: 'eurostar', name: 'Londres → Paris', from: 'Londres', to: 'Paris',
    viaCities: ['Bruxelles'], accent: 2, tag: 'standard',
    mapPts: ['london', 'brussels', 'paris'],
    trainKm: 495, trainDurationMin: 136, trainPriceBase2nd: 39,
    planeKm: 343, planeFlightMin: 64, planePriceBase: 87,
    carKm: 460, carDurationMin: 330, carPriceBase: 76,
    itinerary: [
      { time: '08:31', place: 'London St Pancras', title: 'Eurostar vers Paris', desc: 'Contrôle des passeports avant l’embarquement, prévoir 45 minutes.', kind: 'depart' },
      { time: '11:47', place: 'Paris Gare du Nord', title: 'Arrivée', desc: 'Deux heures seize, huit départs par jour.', kind: 'arrive' },
    ],
  },
];

export function getRoute(id: string): Route | undefined {
  return ROUTES.find((r) => r.id === id);
}
