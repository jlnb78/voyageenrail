import type { Route } from '../data/routes';
import { CO2_FACTORS, CAR_G_PER_KM_VEHICLE, CAR_MAX_OCCUPANTS_PER_VEHICLE, ACCESS_BUFFER_MIN } from '../data/co2-factors';

export type CalcInput = {
  route: Route;
  adults: number;
  children: number;
  travelClass: '2de' | '1re';
  roundTrip: boolean;
};

export type ModeResult = {
  durationOneWayMin: number;
  co2Kg: number;
  priceEur: number;
};

export type CalcResult = {
  travelers: number;
  train: ModeResult;
  avion: ModeResult;
  voiture: ModeResult;
  doorToDoorMin: number; // train, one-way
  co2AvoidedVsAvionKg: number;
  co2AvoidedVsAvionPct: number;
};

const CHILD_DISCOUNT = 0.35; // enfants: -35% sur le prix, même empreinte (même siège)
const CLASS_MULTIPLIER = { '2de': 1, '1re': 1.55 } as const;

function tripMultiplier(roundTrip: boolean) {
  return roundTrip ? 2 : 1;
}

function seatPrice(base: number, adults: number, children: number, travelClass: '2de' | '1re') {
  const perAdult = base * CLASS_MULTIPLIER[travelClass];
  const perChild = perAdult * (1 - CHILD_DISCOUNT);
  return adults * perAdult + children * perChild;
}

export function calculate(input: CalcInput): CalcResult {
  const { route, adults, children, travelClass, roundTrip } = input;
  const travelers = Math.max(1, adults) + Math.max(0, children);
  const mult = tripMultiplier(roundTrip);

  const trainFactor = route.tag === 'sans-reservation' ? CO2_FACTORS.regional.gPerKmPax : CO2_FACTORS.tgv.gPerKmPax;
  const train: ModeResult = {
    durationOneWayMin: route.trainDurationMin,
    co2Kg: (route.trainKm * trainFactor * travelers * mult) / 1000,
    priceEur: seatPrice(route.trainPriceBase2nd, adults, children, travelClass) * mult,
  };

  const avion: ModeResult = {
    durationOneWayMin: route.planeFlightMin,
    co2Kg: (route.planeKm * CO2_FACTORS.avion.gPerKmPax * travelers * mult) / 1000,
    priceEur: seatPrice(route.planePriceBase, adults, children, '2de') * mult,
  };

  const nbCars = Math.max(1, Math.ceil(travelers / CAR_MAX_OCCUPANTS_PER_VEHICLE));
  const voiture: ModeResult = {
    durationOneWayMin: route.carDurationMin,
    co2Kg: (route.carKm * CAR_G_PER_KM_VEHICLE * nbCars * mult) / 1000,
    priceEur: route.carPriceBase * nbCars * mult,
  };

  const doorToDoorMin = route.trainDurationMin + ACCESS_BUFFER_MIN.train;
  const co2AvoidedVsAvionKg = Math.max(0, avion.co2Kg - train.co2Kg);
  const co2AvoidedVsAvionPct = avion.co2Kg > 0 ? (co2AvoidedVsAvionKg / avion.co2Kg) * 100 : 0;

  return { travelers, train, avion, voiture, doorToDoorMin, co2AvoidedVsAvionKg, co2AvoidedVsAvionPct };
}

export function formatEur(n: number): string {
  return `${Math.round(n).toLocaleString('fr-FR')} €`;
}

export function formatKg(n: number, decimals = 1): string {
  return `${n.toLocaleString('fr-FR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })} kg CO₂e`;
}

export function formatDurationMin(min: number): string {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  if (h <= 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${String(m).padStart(2, '0')}`;
}
