import { randomUUID } from "node:crypto";
import { calculateCarbonSavedGrams } from "../services/carbonCalculator.js";
import { ensureUserCollections, store } from "../data/store.js";
import { createUserSchema, saveRouteSchema, tripSchema } from "../validation/schemas.js";

const getUserOrThrow = (userId) => {
  const user = store.users.get(userId);
  if (!user) {
    const error = new Error("User not found.");
    error.status = 404;
    throw error;
  }
  return user;
};

export const createUser = (req, res, next) => {
  try {
    const payload = createUserSchema.parse(req.body);
    const userId = randomUUID();
    const user = {
      userId,
      ...payload,
      createdAt: new Date().toISOString(),
    };

    store.users.set(userId, user);
    ensureUserCollections(userId);

    res.status(201).json(user);
  } catch (error) {
    if (error.name === "ZodError") {
      error.status = 400;
      error.message = "Invalid user payload.";
      error.details = error.issues;
    }
    next(error);
  }
};

export const getUserDashboard = (req, res, next) => {
  try {
    const user = getUserOrThrow(req.params.userId);
    ensureUserCollections(user.userId);
    const trips = store.tripsByUser.get(user.userId);
    const totalCarbonSavedGrams = trips.reduce((sum, trip) => sum + trip.carbonSavedGrams, 0);

    const badges = [];
    if (trips.length >= 5) badges.push("Green Commuter");
    if (totalCarbonSavedGrams >= 5000) badges.push("CO2 Saver");
    if (trips.some((trip) => trip.mode === "bike" || trip.mode === "walk")) badges.push("Active Traveler");

    res.json({
      userId: user.userId,
      tripsCount: trips.length,
      totalCarbonSavedGrams: Number(totalCarbonSavedGrams.toFixed(2)),
      badges,
    });
  } catch (error) {
    next(error);
  }
};

export const listSavedRoutes = (req, res, next) => {
  try {
    const user = getUserOrThrow(req.params.userId);
    ensureUserCollections(user.userId);
    res.json(store.savedRoutesByUser.get(user.userId));
  } catch (error) {
    next(error);
  }
};

export const createSavedRoute = (req, res, next) => {
  try {
    const user = getUserOrThrow(req.params.userId);
    const payload = saveRouteSchema.parse(req.body);
    ensureUserCollections(user.userId);
    const savedRoute = {
      routeId: randomUUID(),
      ...payload,
      createdAt: new Date().toISOString(),
    };
    store.savedRoutesByUser.get(user.userId).push(savedRoute);
    res.status(201).json(savedRoute);
  } catch (error) {
    if (error.name === "ZodError") {
      error.status = 400;
      error.message = "Invalid saved-route payload.";
      error.details = error.issues;
    }
    next(error);
  }
};

export const listTrips = (req, res, next) => {
  try {
    const user = getUserOrThrow(req.params.userId);
    ensureUserCollections(user.userId);
    res.json(store.tripsByUser.get(user.userId));
  } catch (error) {
    next(error);
  }
};

export const createTrip = (req, res, next) => {
  try {
    const user = getUserOrThrow(req.params.userId);
    const payload = tripSchema.parse(req.body);
    ensureUserCollections(user.userId);
    const carbonSavedGrams = calculateCarbonSavedGrams(
      payload.routeCo2Grams,
      payload.distanceKm,
      payload.baselineMode,
    );
    const trip = {
      tripId: randomUUID(),
      ...payload,
      carbonSavedGrams,
      createdAt: new Date().toISOString(),
    };

    store.tripsByUser.get(user.userId).push(trip);
    res.status(201).json(trip);
  } catch (error) {
    if (error.name === "ZodError") {
      error.status = 400;
      error.message = "Invalid trip payload.";
      error.details = error.issues;
    }
    next(error);
  }
};
