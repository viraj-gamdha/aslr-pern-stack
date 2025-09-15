import { db } from "@/db/dbInit.js";
import { document, DocumentType, NewDocument } from "@/db/schema/document.js";
import { TryCatch } from "@/utils/asyncHandler.js";
import ErrorHandler from "@/utils/errorHandler.js";
import { and, eq, inArray } from "drizzle-orm";
import { extractImageKeys, verifyProjectOwnerShip } from "@/utils/project.js";
import { JSONContent } from "@/types/document";
import { s3UnusedKey } from "@/db/schema/index.js";

export const getDocumentByProjectId = TryCatch<
  {},
  { projectId: string },
  {},
  {},
  DocumentType
>(async (req, res, next) => {
  const userId = req.userId as string;
  const { projectId } = req.params;

  const projectData = await verifyProjectOwnerShip(userId, projectId);

  if (!projectData.document) {
    return next(new ErrorHandler(404, "Document not found"));
  }

  return res.status(200).json({
    success: true,
    message: "Document retrieved successfully",
    data: projectData.document,
  });
});

// Update document content
export const updateDocument = TryCatch<
  Partial<NewDocument>,
  { projectId: string },
  {},
  {},
  DocumentType
>(async (req, res, next) => {
  const userId = req.userId as string;
  const { projectId } = req.params;
  const { content } = req.body;

  // Fetch project to verify access
  const projectData = await verifyProjectOwnerShip(userId, projectId);

  if (!projectData.document) {
    return next(new ErrorHandler(404, "Document not found"));
  }

  // Delete s3 images if not in new content
  const oldKeys = extractImageKeys(projectData.document.content as JSONContent);
  const newKeys = extractImageKeys(content as JSONContent);

  // 1. Remove reused keys from unused store
  const existingUnusedKeys = await db
    .select({ key: s3UnusedKey.key })
    .from(s3UnusedKey)
    .where(eq(s3UnusedKey.documentId, projectData.document.id));

  const existingKeySet = new Set(existingUnusedKeys.map((k) => k.key));
  const reusedKeys = [...newKeys].filter((key) => existingKeySet.has(key));

  if (reusedKeys.length > 0) {
    await db
      .delete(s3UnusedKey)
      .where(
        and(
          eq(s3UnusedKey.documentId, projectData.document.id),
          inArray(s3UnusedKey.key, reusedKeys)
        )
      );
  }

  // 2. Add newly unused keys
  const unusedKeys = [...oldKeys].filter((key) => !newKeys.has(key));

  if (unusedKeys.length > 0) {
    await db
      .insert(s3UnusedKey)
      .values(
        Array.from(unusedKeys).map((key) => ({
          key,
          bucket: process.env.S3_BUCKET!,
          documentId: projectData.document.id,
          createdAt: new Date(),
        }))
      )
      .onConflictDoNothing();
  }

  // Update document
  const [updatedDocument] = await db
    .update(document)
    .set({
      content: content ?? projectData.document.content,
      updatedAt: new Date(),
    })
    .where(eq(document.id, projectData.document.id))
    .returning();

  return res.status(200).json({
    success: true,
    message: "Document saved successfully",
    data: updatedDocument,
  });
});
