import { boolean, text, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "@/db/schema/helpers/column.js";
import { mySchema } from "@/db/schema/base.js";
import { relations } from "drizzle-orm";
import { project, projectMember } from "./project";

// Define the users table for storing user details
export const user = mySchema.table(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    password: text("password").notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex("email_idx").on(table.email)]
);

// Define relations for users table
// many projects as owner
// can be part of many project members
export const userRelations = relations(user, ({ many }) => ({
  ownedProjects: many(project, {
    relationName: "owner",
  }),
  projectMembers: many(projectMember),
}));

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
