// ADEME Base Empreinte 2025 factors, as published on the /a-propos page.
// Revisit once a year when ADEME updates its base — this is the file the
// design chat promised would be the only thing to touch.

export const CO2_FACTORS = {
  tgv: { label: 'TGV / train grande vitesse', gPerKmPax: 2.4, source: 'ADEME, Base Empreinte 2025' },
  regional: { label: 'Train régional', gPerKmPax: 24.8, source: 'ADEME, Base Empreinte 2025' },
  avion: { label: 'Avion court-courrier', gPerKmPax: 230, source: 'ADEME + forçage radiatif' },
  voiture: { label: 'Voiture thermique', gPerKmPax: 103, source: 'ADEME, 2,2 occupants' },
} as const;

// The voiture factor above is already an average per passenger assuming 2.2
// occupants — for a single vehicle's total emissions (independent of how many
// of its seats are filled), multiply back out.
export const CAR_ASSUMED_OCCUPANTS = 2.2;
export const CAR_G_PER_KM_VEHICLE = CO2_FACTORS.voiture.gPerKmPax * CAR_ASSUMED_OCCUPANTS;
export const CAR_MAX_OCCUPANTS_PER_VEHICLE = 4;

// Fixed access/transfer time added on top of in-vehicle duration, to get a
// door-to-door figure (checked bags, security, station walk-up…).
export const ACCESS_BUFFER_MIN = { train: 20, avion: 210, voiture: 0 } as const;
