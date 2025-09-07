import { jsonb, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { mySchema } from "./base";
import { timestamps } from "./helpers/column";
import { project } from "./project";

// Define the documents table with project relation
export const document = mySchema.table("documents", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  content: jsonb("content").notNull(),
  projectId: text("project_id")
    .notNull()
    .references(() => project.id, { onDelete: "cascade" }),
  ...timestamps,
});

// Define relations for documents table
export const documentRelations = relations(document, ({ one }) => ({
  project: one(project, {
    fields: [document.projectId],
    references: [project.id],
  }),
}));

export type DocumentType = typeof document.$inferSelect;
export type NewDocument = typeof document.$inferInsert;
