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
// simply have no through-journey for a given pair (most of our routes
// involve at least one train DB doesn't sell), or the service may be
// unreachable.

const BASE = 'https://v6.db.transport.rest';

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

const stationIdCache = new Map<string, string | null>();

export async function findStationId(name: string): Promise<string | null> {
  if (stationIdCache.has(name)) return stationIdCache.get(name)!;
  const json = await fetchJson(`${BASE}/locations?query=${encodeURIComponent(name)}&results=1&fuzzy=true&stops=true&addresses=false&poi=false`);
  const id = Array.isArray(json) && json[0]?.id ? String(json[0].id) : null;
  stationIdCache.set(name, id);
  return id;
}

export async function findJourneys(fromName: string, toName: string, whenISO: string, results = 4): Promise<JourneySummary[] | null> {
  const [fromId, toId] = await Promise.all([findStationId(fromName), findStationId(toName)]);
  if (!fromId || !toId) return null;

  const json = await fetchJson(
    `${BASE}/journeys?from=${fromId}&to=${toId}&departure=${encodeURIComponent(whenISO)}&results=${results}&stopovers=false&language=fr`
  );
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
