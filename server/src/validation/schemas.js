import { z } from "zod";

const coordSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  name: z.string().trim().min(1).max(120).optional(),
});

export const routeRequestSchema = z.object({
  start: coordSchema,
  end: coordSchema,
  greenToleranceMinutes: z.number().min(0).max(120).default(15),
  preferredModes: z.array(z.enum(["walk", "bike", "bus", "car", "ev"])).max(5).optional(),
  maxResults: z.number().min(1).max(10).default(4),
  departureTime: z.string().datetime().optional(),
});

export const createUserSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  greenPreferenceScore: z.number().min(0).max(100).default(50),
});

export const saveRouteSchema = z.object({
  label: z.string().trim().min(1).max(100),
  start: coordSchema,
  end: coordSchema,
  lastCo2Score: z.number().min(0),
});

export const tripSchema = z.object({
  mode: z.enum(["walk", "bike", "bus", "car", "ev"]),
  distanceKm: z.number().positive(),
  routeCo2Grams: z.number().min(0),
  baselineMode: z.enum(["walk", "bike", "bus", "car", "ev"]).default("car"),
});
