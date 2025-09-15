import { pgEnum, primaryKey, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { mySchema } from "@/db/schema/base.js";
import { timestamps } from "@/db/schema/helpers/column.js";
import { user } from "@/db/schema/user.js";
import { document } from "./document.js";

// Define the projects table for storing project details
export const project = mySchema.table("projects", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  ...timestamps,
});

export const invitationStatusEnum = pgEnum("invitation_status", ["pending", "invited"]);

// Define the project_members junction table for invited user
export const projectMember = mySchema.table(
  "project_members",
  {
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    invitationStatus: invitationStatusEnum("invitation_status").default("pending").notNull(),
    ...timestamps,
  },
  (table) => [primaryKey({ columns: [table.projectId, table.userId] })]
);

// Define relations for projects table
// One project can have one owner (creator) /// many members (users) /// one document
export const projectRelations = relations(project, ({ one, many }) => ({
  owner: one(user, {
    fields: [project.userId],
    references: [user.id],
    relationName: "owner",
  }),
  projectMembers: many(projectMember),
  document: one(document, {
    fields: [project.id],
    references: [document.projectId],
  }),
}));

// Define relations for project_members junction table
export const projectMemberRelations = relations(projectMember, ({ one }) => ({
  project: one(project, {
    fields: [projectMember.projectId],
    references: [project.id],
  }),
  user: one(user, {
    fields: [projectMember.userId],
    references: [user.id],
  }),
}));

export type Project = typeof project.$inferSelect;
export type NewProject = typeof project.$inferInsert;
export type ProjectMember = typeof projectMember.$inferSelect;
export type NewProjectMember = typeof projectMember.$inferInsert;
