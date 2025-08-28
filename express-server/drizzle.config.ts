import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: "./.env" });

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema",
  out: "./src/drizzle",
  dbCredentials: {
    url: process.env.DB_URI!,
  },
  casing: "snake_case",
  schemaFilter: ["doslr_schema"],
  verbose: true,
  strict: true,
});