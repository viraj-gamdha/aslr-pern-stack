import { text } from "drizzle-orm/pg-core";
import { mySchema } from "./base.js";
import { timestamps } from "./helpers/column.js";
import { document } from "./document.js";
import { relations } from "drizzle-orm";

export const s3UnusedKey = mySchema.table("s3_unused_key", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  bucket: text("bucket").notNull(), // S3 bucket name
  key: text("key").notNull().unique(), // S3 object key
  documentId: text("document_id")
    .notNull()
    .references(() => document.id, { onDelete: "cascade" }),
  createdAt: timestamps.createdAt,
});

export const unusedImageRelations = relations(s3UnusedKey, ({ one }) => ({
  document: one(document, {
    fields: [s3UnusedKey.documentId],
    references: [document.id],
  }),
}));

export type UnusedImageType = typeof s3UnusedKey.$inferSelect;
export type NewUnusedImage = typeof s3UnusedKey.$inferInsert;
