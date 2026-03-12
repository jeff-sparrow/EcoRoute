import axios from "axios";
import { env } from "../config/env.js";

const GOOD_AQI_MAX = 2;

export const getWeatherContext = async (point) => {
  if (!env.openWeatherApiKey) {
    return {
      source: "none",
      summary: "Weather/AQI API key missing; using neutral weather assumptions.",
      canBikeOrWalk: true,
      severity: "unknown",
      warnings: [],
    };
  }

  const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
  const airUrl = "https://api.openweathermap.org/data/2.5/air_pollution";

  try {
    const [weatherResp, airResp] = await Promise.all([
      axios.get(weatherUrl, {
        params: { lat: point.lat, lon: point.lon, appid: env.openWeatherApiKey, units: "metric" },
        timeout: 3500,
      }),
      axios.get(airUrl, {
        params: { lat: point.lat, lon: point.lon, appid: env.openWeatherApiKey },
        timeout: 3500,
      }),
    ]);

    const weatherMain = weatherResp.data?.weather?.[0]?.main?.toLowerCase() || "";
    const weatherDescription = weatherResp.data?.weather?.[0]?.description || "unknown weather";
    const aqi = airResp.data?.list?.[0]?.main?.aqi ?? 3;

    const severeWeather = ["thunderstorm", "snow", "tornado"].includes(weatherMain);
    const wetWeather = ["rain", "drizzle"].includes(weatherMain);
    const poorAir = aqi > GOOD_AQI_MAX;

    const warnings = [];
    if (wetWeather || severeWeather) warnings.push("Current weather may reduce safety for biking/walking.");
    if (poorAir) warnings.push("Air quality is below healthy range for active travel.");

    return {
      source: "openweathermap",
      summary: `${weatherDescription}, AQI=${aqi}`,
      canBikeOrWalk: !(severeWeather || poorAir),
      severity: severeWeather ? "high" : wetWeather || poorAir ? "medium" : "low",
      warnings,
    };
  } catch (error) {
    return {
      source: "openweathermap",
      summary: "Weather/AQI unavailable; continuing with best-effort routing.",
      canBikeOrWalk: true,
      severity: "unknown",
      warnings: ["Weather/AQI data was unavailable during this request."],
      error: error.message,
    };
  }
};
