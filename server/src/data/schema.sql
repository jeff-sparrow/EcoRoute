-- Create the PostGIS extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  green_preference_score INTEGER DEFAULT 50 CHECK (green_preference_score >= 0 AND green_preference_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the saved_routes table
CREATE TABLE IF NOT EXISTS saved_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  label VARCHAR(100) NOT NULL,
  start_point GEOMETRY(POINT, 4326) NOT NULL,
  start_name VARCHAR(120),
  end_point GEOMETRY(POINT, 4326) NOT NULL,
  end_name VARCHAR(120),
  last_co2_score DECIMAL CHECK (last_co2_score >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the trip_history table
CREATE TABLE IF NOT EXISTS trip_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mode VARCHAR(50) NOT NULL CHECK (mode IN ('walk', 'bike', 'bus', 'car', 'ev')),
  distance_km DECIMAL NOT NULL CHECK (distance_km > 0),
  route_co2_grams DECIMAL NOT NULL CHECK (route_co2_grams >= 0),
  baseline_mode VARCHAR(50) DEFAULT 'car' CHECK (baseline_mode IN ('walk', 'bike', 'bus', 'car', 'ev')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
