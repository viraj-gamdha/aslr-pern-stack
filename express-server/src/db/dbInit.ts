import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema/index.js";
import { config } from "dotenv";
import { envMode } from "@/app.js";

config({ path: "./.env" });

const pool = new Pool({
  connectionString: process.env.DB_URI!,
  max: 100, // Based on server capacity
  idleTimeoutMillis: 30000, // 30 seconds before idle connection is closed
  connectionTimeoutMillis: 5000, // 5 seconds to wait before failing a new connection
});

const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log(`✅ Database connected successfully (${envMode} mode)`);
    client.release();
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
};

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

testConnection();

export const db = drizzle({ client: pool, schema });
export type Database = typeof db;
