// Live schedule lookups via v6.db.transport.rest — a free, no-signup-needed
// public REST wrapper around Deutsche Bahn's own journey planner
// (community-run: https://github.com/public-transport/db-rest, backed by
// db-vendo-client since DB retired the old HAFAS endpoint it used to wrap).
//
// Chosen over Navitia specifically because Navitia's free tier only covers
// France; DB's own journey search resolves a lot of international/
// cross-border European connections too, since DB sells tickets on them —
// though coverage is best-effort, not guaranteed, and this is an unofficial
// community wrapper, not an official DB product. No API key exists or is
// needed. Client-side only: nothing secret to protect, and *.transport.rest
// is the CORS-enabled member of this family (unlike db-vendo-client
// itself), specifically meant for browser use.
//
// This enriches the calculator with real upcoming departures when
// available; it never replaces the cost/CO2 estimate model in src/lib/calc.ts,
// and fails silently (empty result) rather than breaking the page — DB may
// simply have no through-journey for a given pair (many routes involve at
// least one train DB doesn't sell), the pair may not resolve to a real
// station at all (free-text "point A to point B" search), or the service
// may be unreachable.

const BASE = 'https://v6.db.transport.rest';

export type Station = { id: string; name: string; lat: number; lon: number };

export type JourneyLeg = {
  lineName: string | null;
  origin: string;
  destination: string;
  departure: string | null;
  arrival: string | null;
};

export type JourneySummary = {
  departure: string | null;
  arrival: string | null;
  changes: number;
  legs: JourneyLeg[];
};

async function fetchJson(url: string, timeoutMs = 8000): Promise<any | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null; // network blocked, timed out, CORS refused, etc. — caller falls back
  } finally {
    clearTimeout(timer);
  }
}

const stationCache = new Map<string, Station | null>();

/** Resolve free text (a city or station name — anything a visitor might
 * type) to a real station, including its coordinates. Used both to feed the
 * live journeys search and, via haversineKm below, to estimate cost/CO2 for
 * a pair that isn't one of the 9 curated routes in routes.ts. */
export async function findStation(name: string): Promise<Station | null> {
  const key = name.trim().toLowerCase();
  if (stationCache.has(key)) return stationCache.get(key)!;
  const json = await fetchJson(`${BASE}/locations?query=${encodeURIComponent(name)}&results=1&fuzzy=true&stops=true&addresses=false&poi=false`);
  const hit = Array.isArray(json) ? json[0] : null;
  const station: Station | null = hit?.id && hit?.location
    ? { id: String(hit.id), name: hit.name ?? name, lat: hit.location.latitude, lon: hit.location.longitude }
    : null;
  stationCache.set(key, station);
  return station;
}

export function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

function mapJourneys(json: any): JourneySummary[] | null {
  const journeys = json?.journeys;
  if (!Array.isArray(journeys) || journeys.length === 0) return null;
  return journeys.map((j: any): JourneySummary => {
    const legs = (j.legs ?? []).filter((l: any) => !l.walking);
    const mapped: JourneyLeg[] = legs.map((l: any) => ({
      lineName: l.line?.name ?? null,
      origin: l.origin?.name ?? '?',
      destination: l.destination?.name ?? '?',
      departure: l.departure ?? l.plannedDeparture ?? null,
      arrival: l.arrival ?? l.plannedArrival ?? null,
    }));
    return {
      departure: mapped[0]?.departure ?? null,
      arrival: mapped[mapped.length - 1]?.arrival ?? null,
      changes: Math.max(0, mapped.length - 1),
      legs: mapped,
    };
  });
}

async function journeysBetween(fromId: string, toId: string, whenISO: string, results = 4): Promise<JourneySummary[] | null> {
  const json = await fetchJson(
    `${BASE}/journeys?from=${fromId}&to=${toId}&departure=${encodeURIComponent(whenISO)}&results=${results}&stopovers=false&language=fr`
  );
  return mapJourneys(json);
}

export async function findJourneys(fromName: string, toName: string, whenISO: string, results = 4): Promise<JourneySummary[] | null> {
  const [from, to] = await Promise.all([findStation(fromName), findStation(toName)]);
  if (!from || !to) return null;
  return journeysBetween(from.id, to.id, whenISO, results);
}

/** Same as findJourneys, but with an optional stopover: two independent
 * searches (A→via, via→B) stitched into one combined result, taking the
 * first (soonest) option of each leg. This is a best-effort concatenation,
 * not a real through-fare search — good enough to sketch "is this
 * connection plausible", not to book against. */
export async function findJourneysWithVia(
  fromName: string, viaName: string | null, toName: string, whenISO: string
): Promise<JourneySummary[] | null> {
  if (!viaName || !viaName.trim()) return findJourneys(fromName, toName, whenISO, 4);

  const [from, via, to] = await Promise.all([findStation(fromName), findStation(viaName), findStation(toName)]);
  if (!from || !via || !to) return null;

  const firstLeg = await journeysBetween(from.id, via.id, whenISO, 1);
  if (!firstLeg?.[0]) return null;
  const arrivalAtVia = firstLeg[0].arrival;
  if (!arrivalAtVia) return null;

  // Leave a little connection buffer rather than searching from the exact
  // arrival instant.
  const nextDeparture = new Date(new Date(arrivalAtVia).getTime() + 10 * 60_000).toISOString();
  const secondLeg = await journeysBetween(via.id, to.id, nextDeparture, 1);
  if (!secondLeg?.[0]) return null;

  const combined: JourneySummary = {
    departure: firstLeg[0].departure,
    arrival: secondLeg[0].arrival,
    changes: firstLeg[0].changes + secondLeg[0].changes + 1,
    legs: [...firstLeg[0].legs, ...secondLeg[0].legs],
  };
  return [combined];
}
