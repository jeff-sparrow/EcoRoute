const EMISSION_GRAMS_PER_KM = {
  walk: 0,
  bike: 0,
  bus: 80,
  car: 192,
  ev: 75,
};

export const getEmissionFactor = (mode) => EMISSION_GRAMS_PER_KM[mode] ?? EMISSION_GRAMS_PER_KM.car;

export const calculateRouteCarbonGrams = (segments) =>
  segments.reduce((total, segment) => total + segment.distanceKm * getEmissionFactor(segment.mode), 0);

export const calculateCarbonSavedGrams = (routeCarbonGrams, distanceKm, baselineMode = "car") => {
  const baseline = distanceKm * getEmissionFactor(baselineMode);
  return Math.max(0, baseline - routeCarbonGrams);
};
