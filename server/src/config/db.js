import pkg from "pg";
const { Pool } = pkg;
import { env } from "./env.js";

const pool = new Pool({
  connectionString: env.databaseUrl,
});

// Verify the connection on startup
pool.query("SELECT NOW()", (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Database connected successfully.");
  }
});

export default pool;
