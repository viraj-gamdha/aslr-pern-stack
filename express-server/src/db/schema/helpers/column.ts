import { timestamp } from "drizzle-orm/pg-core";

// Reusable timestamp columns
export const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
};