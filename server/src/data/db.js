import { Pool } from "pg";
import { env } from "../config/env.js";

const poolConfig = env.databaseUrl
  ? { connectionString: env.databaseUrl }
  : {
      host: env.pgHost,
      port: env.pgPort,
      database: env.pgDatabase,
      user: env.pgUser,
      password: env.pgPassword,
    };

export const dbPool = new Pool(poolConfig);

export const testDbConnection = async () => {
  try {
    await dbPool.query("SELECT 1");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
};

