import cors from "cors";
import express from "express";
import morgan from "morgan";
import apiRouter from "./routes/api.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.json({
    name: "EcoRoute Backend API",
    version: "1.0.0",
    docs: "Use /api/health and /api/routes",
  });
});

app.use("/api", apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
