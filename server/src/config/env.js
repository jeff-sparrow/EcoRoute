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
};
