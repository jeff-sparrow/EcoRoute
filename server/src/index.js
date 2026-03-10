import dotenv from "dotenv";
import app from "./app.js";
import { initDB } from "./data/db.js";

dotenv.config();

const port = process.env.PORT || 4000;

// Initialize the database before starting the server
await initDB();

app.listen(port, () => {
  console.log(`EcoRoute API running at http://localhost:${port}`);
});
