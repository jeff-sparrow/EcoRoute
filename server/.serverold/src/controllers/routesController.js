import { routeRequestSchema } from "../validation/schemas.js";
import { getWeatherContext } from "../services/weatherService.js";
import { getRouteOptions } from "../services/routeAggregator.js";

export const createRoutes = async (req, res, next) => {
  try {
    const parsed = routeRequestSchema.parse(req.body);
    const weatherContext = await getWeatherContext(parsed.start);
    const rankedRoutes = await getRouteOptions({
      ...parsed,
      weatherContext,
    });

    res.status(200).json({
      query: parsed,
      weather: weatherContext,
      routes: rankedRoutes.slice(0, parsed.maxResults),
      meta: {
        sortedBy: "low_carbon_primary_with_green_tolerance",
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error.name === "ZodError") {
      error.status = 400;
      error.message = "Invalid route request payload.";
      error.details = error.issues;
    }
    next(error);
  }
};
