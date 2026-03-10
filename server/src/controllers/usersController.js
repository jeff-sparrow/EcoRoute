import { randomUUID } from "node:crypto";
import { calculateCarbonSavedGrams } from "../services/carbonCalculator.js";
import { pool } from "../data/db.js";
import { createUserSchema, saveRouteSchema, tripSchema, loginUserSchema } from "../validation/schemas.js";

const getUserOrThrow = async (userId) => {
  const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [userId]);
  if (result.rows.length === 0) {
    const error = new Error("User not found.");
    error.status = 404;
    throw error;
  }
  return result.rows[0];
};

export const createUser = async (req, res, next) => {
  try {
    const payload = createUserSchema.parse(req.body);
    const userId = randomUUID();
    
    const result = await pool.query(
      `INSERT INTO users (user_id, name, email, green_preference_score) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, payload.name, payload.email, payload.greenPreferenceScore]
    );

    res.status(201).json({
      userId: result.rows[0].user_id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      greenPreferenceScore: result.rows[0].green_preference_score,
      createdAt: result.rows[0].created_at,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      error.status = 400;
      error.message = "Invalid user payload.";
      error.details = error.issues;
    }
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const payload = loginUserSchema.parse(req.body);
    
    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [payload.email]
    );

    if (result.rows.length === 0) {
      const error = new Error("User not found with this email.");
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      userId: result.rows[0].user_id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      greenPreferenceScore: result.rows[0].green_preference_score,
      createdAt: result.rows[0].created_at,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      error.status = 400;
      error.message = "Invalid login payload.";
      error.details = error.issues;
    }
    next(error);
  }
};

export const getUserDashboard = async (req, res, next) => {
  try {
    const user = await getUserOrThrow(req.params.userId);
    
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as trips_count,
        COALESCE(SUM(carbon_saved_grams), 0) as total_carbon_saved_grams,
        COUNT(*) FILTER (WHERE mode IN ('bike', 'walk')) as active_trips_count
      FROM trips
      WHERE user_id = $1
    `, [user.user_id]);

    const stats = statsResult.rows[0];
    const tripsCount = parseInt(stats.trips_count, 10);
    const totalCarbonSavedGrams = parseFloat(stats.total_carbon_saved_grams);
    const activeTripsCount = parseInt(stats.active_trips_count, 10);

    const badges = [];
    if (tripsCount >= 5) badges.push("Green Commuter");
    if (totalCarbonSavedGrams >= 5000) badges.push("CO2 Saver");
    if (activeTripsCount > 0) badges.push("Active Traveler");

    res.json({
      userId: user.user_id,
      tripsCount,
      totalCarbonSavedGrams: Number(totalCarbonSavedGrams.toFixed(2)),
      badges,
    });
  } catch (error) {
    next(error);
  }
};

export const listSavedRoutes = async (req, res, next) => {
  try {
    await getUserOrThrow(req.params.userId);
    const result = await pool.query(`
      SELECT 
        route_id as "routeId",
        label,
        ST_X(start_geom) as start_lon, ST_Y(start_geom) as start_lat,
        ST_X(end_geom) as end_lon, ST_Y(end_geom) as end_lat,
        last_co2_score as "lastCo2Score",
        created_at as "createdAt"
      FROM saved_routes
      WHERE user_id = $1
      ORDER BY created_at DESC
    `, [req.params.userId]);

    const formattedRoutes = result.rows.map(row => ({
      routeId: row.routeId,
      label: row.label,
      start: { lat: row.start_lat, lon: row.start_lon },
      end: { lat: row.end_lat, lon: row.end_lon },
      lastCo2Score: parseFloat(row.lastCo2Score),
      createdAt: row.createdAt
    }));

    res.json(formattedRoutes);
  } catch (error) {
    next(error);
  }
};

export const createSavedRoute = async (req, res, next) => {
  try {
    await getUserOrThrow(req.params.userId);
    const payload = saveRouteSchema.parse(req.body);
    const routeId = randomUUID();

    const result = await pool.query(`
      INSERT INTO saved_routes (
        route_id, user_id, label, start_geom, end_geom, last_co2_score
      ) VALUES (
        $1, $2, $3, ST_MakePoint($4, $5), ST_MakePoint($6, $7), $8
      ) RETURNING route_id as "routeId", label, last_co2_score as "lastCo2Score", created_at as "createdAt"
    `, [
      routeId,
      req.params.userId,
      payload.label,
      payload.start.lon, payload.start.lat,
      payload.end.lon, payload.end.lat,
      payload.lastCo2Score
    ]);

    res.status(201).json({
      ...result.rows[0],
      lastCo2Score: parseFloat(result.rows[0].lastCo2Score),
      start: payload.start,
      end: payload.end
    });
  } catch (error) {
    if (error.name === "ZodError") {
      error.status = 400;
      error.message = "Invalid saved-route payload.";
      error.details = error.issues;
    }
    next(error);
  }
};

export const listTrips = async (req, res, next) => {
  try {
    const user = await getUserOrThrow(req.params.userId);
    const result = await pool.query(`
      SELECT 
        trip_id as "tripId",
        mode,
        distance_km as "distanceKm",
        route_co2_grams as "routeCo2Grams",
        baseline_mode as "baselineMode",
        carbon_saved_grams as "carbonSavedGrams",
        created_at as "createdAt"
      FROM trips
      WHERE user_id = $1
      ORDER BY created_at DESC
    `, [user.user_id]);

    const formattedTrips = result.rows.map(row => ({
      tripId: row.tripId,
      mode: row.mode,
      distanceKm: parseFloat(row.distanceKm),
      routeCo2Grams: parseFloat(row.routeCo2Grams),
      baselineMode: row.baselineMode,
      carbonSavedGrams: parseFloat(row.carbonSavedGrams),
      createdAt: row.createdAt
    }));
    res.json(formattedTrips);
  } catch (error) {
    next(error);
  }
};

export const createTrip = async (req, res, next) => {
  try {
    const user = await getUserOrThrow(req.params.userId);
    const payload = tripSchema.parse(req.body);
    const tripId = randomUUID();
    
    const carbonSavedGrams = calculateCarbonSavedGrams(
      payload.routeCo2Grams,
      payload.distanceKm,
      payload.baselineMode,
    );
    
    const result = await pool.query(`
      INSERT INTO trips (
        trip_id, user_id, mode, distance_km, route_co2_grams, baseline_mode, carbon_saved_grams
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7
      ) RETURNING 
        trip_id as "tripId", mode, distance_km as "distanceKm", 
        route_co2_grams as "routeCo2Grams", baseline_mode as "baselineMode", 
        carbon_saved_grams as "carbonSavedGrams", created_at as "createdAt"
    `, [
      tripId, 
      user.user_id, 
      payload.mode, 
      payload.distanceKm, 
      payload.routeCo2Grams, 
      payload.baselineMode || 'car', 
      carbonSavedGrams
    ]);

    res.status(201).json({
      ...result.rows[0],
      distanceKm: parseFloat(result.rows[0].distanceKm),
      routeCo2Grams: parseFloat(result.rows[0].routeCo2Grams),
      carbonSavedGrams: parseFloat(result.rows[0].carbonSavedGrams),
    });
  } catch (error) {
    if (error.name === "ZodError") {
      error.status = 400;
      error.message = "Invalid trip payload.";
      error.details = error.issues;
    }
    next(error);
  }
};
