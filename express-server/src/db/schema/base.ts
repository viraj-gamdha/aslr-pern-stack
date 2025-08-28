import { pgSchema } from "drizzle-orm/pg-core";

// Create a custom schema namespace
export const mySchema = pgSchema("doslr_schema");