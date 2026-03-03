import dotenv from "dotenv";

dotenv.config();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: toNumber(process.env.PORT, 4000),
  orsApiKey: process.env.OPENROUTESERVICE_API_KEY || "",
  openWeatherApiKey: process.env.OPENWEATHERMAP_API_KEY || "",
  databaseUrl: process.env.DATABASE_URL || "",
  pgHost: process.env.PGHOST || "localhost",
  pgPort: toNumber(process.env.PGPORT, 5432),
  pgDatabase: process.env.PGDATABASE || "ecoroute",
  pgUser: process.env.PGUSER || "postgres",
  pgPassword: process.env.PGPASSWORD || "",
};
