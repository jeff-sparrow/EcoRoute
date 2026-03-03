import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDB() {
  try {
    const schemaPath = path.join(__dirname, "schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");

    console.log("Initializing database schema...");
    await pool.query(schemaSql);
    console.log("Schema initialized successfully!");
  } catch (error) {
    console.error("Error initializing database schema:", error);
  } finally {
    await pool.end();
  }
}

initDB();
