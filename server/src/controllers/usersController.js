import pool from "../config/db.js";
import { calculateCarbonSavedGrams } from "../services/carbonCalculator.js";
import { createUserSchema, saveRouteSchema, tripSchema } from "../validation/schemas.js";

const getUserOrThrow = async (userId) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
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
    const result = await pool.query(
      `INSERT INTO users (name, email, green_preference_score) 
       VALUES ($1, $2, $3) RETURNING id, name, email, green_preference_score, created_at`,
      [payload.name, payload.email, payload.greenPreferenceScore]
    );
    const user = result.rows[0];
    res.status(201).json({
      userId: user.id,
      name: user.name,
      email: user.email,
      greenPreferenceScore: user.green_preference_score,
      createdAt: user.created_at,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      error.status = 400;
      error.message = "Invalid user payload.";
      error.details = error.issues;
    } else if (error.code === '23505') { // unique violation
      error.status = 409;
      error.message = "User with this email already exists.";
    }
    next(error);
  }
};

export const getUserDashboard = async (req, res, next) => {
  try {
    const user = await getUserOrThrow(req.params.userId);
    
    // Fetch user's trips
    const tripsResult = await pool.query(
      "SELECT mode, distance_km, route_co2_grams, baseline_mode FROM trip_history WHERE user_id = $1",
      [user.id]
    );
    const trips = tripsResult.rows;

    let totalCarbonSavedGrams = 0;
    let activeTravelCount = 0;

    for (const trip of trips) {
      totalCarbonSavedGrams += calculateCarbonSavedGrams(
        Number(trip.route_co2_grams),
        Number(trip.distance_km),
        trip.baseline_mode
      );
      if (trip.mode === "bike" || trip.mode === "walk") {
        activeTravelCount++;
      }
    }

    const badges = [];
    if (trips.length >= 5) badges.push("Green Commuter");
    if (totalCarbonSavedGrams >= 5000) badges.push("CO2 Saver");
    if (activeTravelCount > 0) badges.push("Active Traveler");

    res.json({
      userId: user.id,
      tripsCount: trips.length,
      totalCarbonSavedGrams: Number(totalCarbonSavedGrams.toFixed(2)),
      badges,
    });
  } catch (error) {
    next(error);
  }
};

export const listSavedRoutes = async (req, res, next) => {
  try {
    const user = await getUserOrThrow(req.params.userId);
    const result = await pool.query(
      `SELECT id, label, 
              ST_Y(start_point) as start_lat, ST_X(start_point) as start_lon, start_name,
              ST_Y(end_point) as end_lat, ST_X(end_point) as end_lon, end_name,
              last_co2_score, created_at
       FROM saved_routes WHERE user_id = $1 ORDER BY created_at DESC`,
      [user.id]
    );

    const routes = result.rows.map(row => ({
      routeId: row.id,
      label: row.label,
      start: {
        lat: Number(row.start_lat),
        lon: Number(row.start_lon),
        name: row.start_name
      },
      end: {
        lat: Number(row.end_lat),
        lon: Number(row.end_lon),
        name: row.end_name
      },
      lastCo2Score: Number(row.last_co2_score),
      createdAt: row.created_at
    }));

    res.json(routes);
  } catch (error) {
    next(error);
  }
};

export const createSavedRoute = async (req, res, next) => {
  try {
    const user = await getUserOrThrow(req.params.userId);
    const payload = saveRouteSchema.parse(req.body);
    
    const result = await pool.query(
      `INSERT INTO saved_routes 
       (user_id, label, start_point, start_name, end_point, end_name, last_co2_score) 
       VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326), $5, ST_SetSRID(ST_MakePoint($6, $7), 4326), $8, $9) 
       RETURNING id, label, ST_Y(start_point) as start_lat, ST_X(start_point) as start_lon, start_name, 
                 ST_Y(end_point) as end_lat, ST_X(end_point) as end_lon, end_name, last_co2_score, created_at`,
      [
        user.id,
        payload.label,
        payload.start.lon,
        payload.start.lat,
        payload.start.name || null,
        payload.end.lon,
        payload.end.lat,
        payload.end.name || null,
        payload.lastCo2Score
      ]
    );

    const row = result.rows[0];
    res.status(201).json({
      routeId: row.id,
      label: row.label,
      start: { lat: Number(row.start_lat), lon: Number(row.start_lon), name: row.start_name },
      end: { lat: Number(row.end_lat), lon: Number(row.end_lon), name: row.end_name },
      lastCo2Score: Number(row.last_co2_score),
      createdAt: row.created_at
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
    const result = await pool.query(
      "SELECT id, mode, distance_km, route_co2_grams, baseline_mode, created_at FROM trip_history WHERE user_id = $1 ORDER BY created_at DESC",
      [user.id]
    );

    const trips = result.rows.map(row => {
      const carbonSavedGrams = calculateCarbonSavedGrams(
        Number(row.route_co2_grams),
        Number(row.distance_km),
        row.baseline_mode
      );
      
      return {
        tripId: row.id,
        mode: row.mode,
        distanceKm: Number(row.distance_km),
        routeCo2Grams: Number(row.route_co2_grams),
        baselineMode: row.baseline_mode,
        carbonSavedGrams,
        createdAt: row.created_at
      };
    });

    res.json(trips);
  } catch (error) {
    next(error);
  }
};

export const createTrip = async (req, res, next) => {
  try {
    const user = await getUserOrThrow(req.params.userId);
    const payload = tripSchema.parse(req.body);
    
    const result = await pool.query(
      `INSERT INTO trip_history (user_id, mode, distance_km, route_co2_grams, baseline_mode) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, mode, distance_km, route_co2_grams, baseline_mode, created_at`,
      [user.id, payload.mode, payload.distanceKm, payload.routeCo2Grams, payload.baselineMode]
    );

    const row = result.rows[0];
    const carbonSavedGrams = calculateCarbonSavedGrams(
      Number(row.route_co2_grams),
      Number(row.distance_km),
      row.baseline_mode
    );

    res.status(201).json({
      tripId: row.id,
      mode: row.mode,
      distanceKm: Number(row.distance_km),
      routeCo2Grams: Number(row.route_co2_grams),
      baselineMode: row.baseline_mode,
      carbonSavedGrams,
      createdAt: row.created_at
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
