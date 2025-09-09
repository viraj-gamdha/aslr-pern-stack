import { db } from "@/db/dbInit.js";
import { s3UnusedKey } from "@/db/schema/index.js";
import { deleteFromS3 } from "@/utils/s3Client.js";
import { eq } from "drizzle-orm";
import cron from "node-cron";

export const startS3RemoveUnusedObjCron = async () => {
  try {
    console.log("🚀 Initializing s3 unused objects removal cron job...");

    // Run every 10 seconds (for testing)
    const cronSchedule = "*/10 * * * * *";
    // "0 0 * * *"

    cron.schedule(cronSchedule, async () => {
      console.log("🧹 Running S3 unused object cleanup...");

      const unusedObjects = await db.select().from(s3UnusedKey);

      if (unusedObjects.length > 0) {
        for (const image of unusedObjects) {
          try {
            await deleteFromS3({ key: image.key, bucket: image.bucket });
            await db.delete(s3UnusedKey).where(eq(s3UnusedKey.id, image.id));
            console.log("✅ Deleted:", image.key);
          } catch (err) {
            console.error("❌ Failed to delete:", image.key, err);
          }
        }
      } else {
        console.log("📭 No unused objects found.");
      }
    });
  } catch (error) {
    console.error(
      "❌ Error scheduling s3 unused objects removal cron job:",
      error
    );
  }
};
