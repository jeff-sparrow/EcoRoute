import { Router } from "express";
import { createRoutes } from "../controllers/routesController.js";
import {
  createSavedRoute,
  createTrip,
  createUser,
  getUserDashboard,
  listSavedRoutes,
  listTrips,
} from "../controllers/usersController.js";

const api = Router();

api.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "ecoroute-server", timestamp: new Date().toISOString() });
});

api.post("/routes", createRoutes);

api.post("/users", createUser);
api.get("/users/:userId/dashboard", getUserDashboard);
api.get("/users/:userId/saved-routes", listSavedRoutes);
api.post("/users/:userId/saved-routes", createSavedRoute);
api.get("/users/:userId/trips", listTrips);
api.post("/users/:userId/trips", createTrip);

export default api;
