import axios from "axios";
import { env } from "../config/env.js";
import { calculateCarbonSavedGrams, calculateRouteCarbonGrams } from "./carbonCalculator.js";
import { haversineDistanceKm, round } from "../utils/geo.js";

const ORS_PROFILE = {
  walk: "foot-walking",
  bike: "cycling-regular",
  car: "driving-car",
  ev: "driving-car",
};

const MODE_DEFAULT_SPEED_KMH = {
  walk: 5,
  bike: 16,
  bus: 22,
  car: 38,
  ev: 36,
};

const MODE_BASE_COST_USD = {
  walk: 0,
  bike: 0.4,
  bus: 2.5,
  car: 5.5,
  ev: 3.5,
};

const getDurationMinutes = (distanceKm, mode) => (distanceKm / MODE_DEFAULT_SPEED_KMH[mode]) * 60;

const buildFallbackOptions = (start, end, modes) => {
  const distanceKm = Math.max(0.2, haversineDistanceKm(start, end));
  return modes.map((mode) => {
    const durationMinutes = getDurationMinutes(distanceKm, mode);
    const carbonGrams = calculateRouteCarbonGrams([{ mode, distanceKm }]);
    return {
      mode,
      label: `${mode.toUpperCase()} route (fallback estimate)`,
      distanceKm,
      durationMinutes,
      estimatedCostUsd: MODE_BASE_COST_USD[mode] + distanceKm * 0.25,
      segments: [{ mode, distanceKm, durationMinutes }],
      carbonGrams,
      carbonSavedVsCarGrams: calculateCarbonSavedGrams(carbonGrams, distanceKm, "car"),
      source: "fallback",
      warnings: ["Live route providers were unavailable, using estimated route geometry."],
    };
  });
};

const fetchOrsRoute = async (start, end, mode) => {
  const profile = ORS_PROFILE[mode];
  if (!profile || !env.orsApiKey) return null;

  const url = `https://api.openrouteservice.org/v2/directions/${profile}/geojson`;
  const response = await axios.post(
    url,
    { coordinates: [[start.lon, start.lat], [end.lon, end.lat]] },
    {
      timeout: 4500,
      headers: {
        Authorization: env.orsApiKey,
        "Content-Type": "application/json",
      },
    },
  );

  const summary = response.data?.features?.[0]?.properties?.summary;
  if (!summary?.distance || !summary?.duration) return null;

  const distanceKm = summary.distance / 1000;
  const durationMinutes = summary.duration / 60;
  const carbonGrams = calculateRouteCarbonGrams([{ mode, distanceKm }]);

  return {
    mode,
    label: `${mode.toUpperCase()} route`,
    distanceKm,
    durationMinutes,
    estimatedCostUsd: MODE_BASE_COST_USD[mode] + distanceKm * 0.25,
    segments: [{ mode, distanceKm, durationMinutes }],
    carbonGrams,
    carbonSavedVsCarGrams: calculateCarbonSavedGrams(carbonGrams, distanceKm, "car"),
    source: "openrouteservice",
    warnings: [],
  };
};

const calculateAdjustedScore = (route, fastestMinutes, greenToleranceMinutes) => {
  const delay = Math.max(0, route.durationMinutes - fastestMinutes - greenToleranceMinutes);
  return route.carbonGrams + delay * 20;
};

export const getRouteOptions = async ({ start, end, preferredModes, greenToleranceMinutes, weatherContext }) => {
  const modes = preferredModes?.length ? preferredModes : ["walk", "bike", "bus", "car", "ev"];
  const filteredModes = weatherContext.canBikeOrWalk
    ? modes
    : modes.filter((mode) => mode !== "walk" && mode !== "bike");

  const orsCandidates = await Promise.all(
    filteredModes.map(async (mode) => {
      if (mode === "bus") return null;
      try {
        return await fetchOrsRoute(start, end, mode);
      } catch {
        return null;
      }
    }),
  );

  const usableOrs = orsCandidates.filter(Boolean);
  const busFallback =
    filteredModes.includes("bus") && usableOrs[0]
      ? {
          ...usableOrs[0],
          mode: "bus",
          label: "BUS route (estimated multimodal)",
          durationMinutes: usableOrs[0].durationMinutes * 1.2,
          estimatedCostUsd: 2.5,
          carbonGrams: calculateRouteCarbonGrams([{ mode: "bus", distanceKm: usableOrs[0].distanceKm }]),
          source: "estimated-gtfs",
          warnings: ["GTFS real-time integration pending; this bus route is estimated."],
        }
      : null;

  let routes = [...usableOrs];
  if (busFallback) {
    busFallback.carbonSavedVsCarGrams = calculateCarbonSavedGrams(
      busFallback.carbonGrams,
      busFallback.distanceKm,
      "car",
    );
    routes.push(busFallback);
  }

  if (!routes.length) {
    routes = buildFallbackOptions(start, end, filteredModes);
  }

  const weatherWarnings = weatherContext.warnings || [];
  routes = routes.map((route) => ({
    ...route,
    warnings: [...route.warnings, ...weatherWarnings],
    distanceKm: round(route.distanceKm, 2),
    durationMinutes: round(route.durationMinutes, 1),
    estimatedCostUsd: round(route.estimatedCostUsd, 2),
    carbonGrams: round(route.carbonGrams, 2),
    carbonSavedVsCarGrams: round(route.carbonSavedVsCarGrams, 2),
  }));

  const fastest = Math.min(...routes.map((route) => route.durationMinutes));
  return routes
    .map((route) => ({
      ...route,
      rankingScore: round(calculateAdjustedScore(route, fastest, greenToleranceMinutes), 2),
    }))
    .sort((a, b) => a.rankingScore - b.rankingScore || a.carbonGrams - b.carbonGrams || a.durationMinutes - b.durationMinutes);
};
