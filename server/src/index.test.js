import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import app from "./app.js";
import { store } from "./data/store.js";

beforeEach(() => {
  store.users.clear();
  store.savedRoutesByUser.clear();
  store.tripsByUser.clear();
});

describe("Health endpoint", () => {
  it("returns service status", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.service).toBe("ecoroute-server");
    expect(response.body).toHaveProperty("db");
  });
});

describe("Routes endpoint", () => {
  it("returns ranked routes for a valid payload", async () => {
    const payload = {
      start: { lat: 44.5646, lon: -123.262, name: "Corvallis" },
      end: { lat: 45.5152, lon: -122.6784, name: "Portland" },
      greenToleranceMinutes: 15,
      preferredModes: ["walk", "bike", "bus", "car", "ev"],
      maxResults: 4,
    };

    const response = await request(app).post("/api/routes").send(payload);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.routes)).toBe(true);
    expect(response.body.routes.length).toBeGreaterThan(0);
    expect(response.body).toHaveProperty("weather");
    expect(response.body).toHaveProperty("meta");
  });

  it("returns 400 for invalid payload", async () => {
    const response = await request(app).post("/api/routes").send({
      start: { lat: 300, lon: 0 },
      end: { lat: 0, lon: 0 },
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid route request payload.");
  });
});

describe("Users endpoints", () => {
  it("creates user and prevents duplicate email", async () => {
    const payload = {
      name: "Jae Grunwald",
      email: "jae@example.com",
      greenPreferenceScore: 60,
    };

    const createResponse = await request(app).post("/api/users").send(payload);
    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toHaveProperty("userId");

    const duplicateResponse = await request(app).post("/api/users").send(payload);
    expect(duplicateResponse.status).toBe(409);
    expect(duplicateResponse.body.message).toBe("Email already exists.");
  });

  it("returns 404 for trips on unknown user", async () => {
    const response = await request(app).post("/api/users/does-not-exist/trips").send({
      mode: "bus",
      distanceKm: 2.5,
      routeCo2Grams: 120,
      baselineMode: "car",
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found.");
  });
});