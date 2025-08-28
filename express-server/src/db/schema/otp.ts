import { text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { mySchema } from "@/db/schema/base.js";
import { timestamps } from "@/db/schema/helpers/column.js";

export const otp = mySchema.table(
  "otps",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: text("email").notNull().unique(),
    emailOtp: text("email_otp").notNull(),
    ...timestamps,
    expiresAt: timestamp("expires_at").notNull(),
    resendEmailAt: timestamp("resend_email_at").notNull(),
  },
  (table) => [uniqueIndex("otp_email_idx").on(table.email)]
);

export type Otp = typeof otp.$inferSelect;
export type NewOtp = typeof otp.$inferInsert;
