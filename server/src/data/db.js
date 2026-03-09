import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const initDB = async () => {
  try {
    const client = await pool.connect();

    // Ensure PostGIS is available
    await client.query("CREATE EXTENSION IF NOT EXISTS postgis;");

    // Create Tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        green_preference_score SMALLINT DEFAULT 50,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // We store coordinates as GEOMETRY(Point, 4326) mapping to WGS 84
    await client.query(`
      CREATE TABLE IF NOT EXISTS saved_routes (
        route_id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
        label VARCHAR(100) NOT NULL,
        start_geom GEOMETRY(Point, 4326) NOT NULL,
        end_geom GEOMETRY(Point, 4326) NOT NULL,
        last_co2_score DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS trips (
        trip_id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
        mode VARCHAR(20) NOT NULL,
        distance_km DECIMAL(10, 2) NOT NULL,
        route_co2_grams DECIMAL(10, 2) NOT NULL,
        baseline_mode VARCHAR(20) DEFAULT 'car',
        carbon_saved_grams DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    client.release();
    console.log("Database connected and schema initialized");
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
};
