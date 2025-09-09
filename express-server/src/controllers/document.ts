import { db } from "@/db/dbInit";
import { document, DocumentType, NewDocument } from "@/db/schema/document";
import { TryCatch } from "@/utils/asyncHandler.js";
import ErrorHandler from "@/utils/errorHandler";
import { eq } from "drizzle-orm";
import { project, projectMember } from "@/db/schema/index.js";

export const getDocumentByProjectId = TryCatch<
  {},
  { projectId: string },
  {},
  {},
  DocumentType
>(async (req, res, next) => {
  const userId = req.userId as string;
  const { projectId } = req.params;

  // Fetch project to verify access
  const projectData = await db.query.project.findFirst({
    where: eq(project.id, projectId),
    with: {
      projectMembers: {
        where: eq(projectMember.userId, userId),
      },
      document: true,
    },
  });

  if (!projectData) {
    return next(new ErrorHandler(404, "Project not found"));
  }

  if (projectData.userId !== userId && !projectData.projectMembers.length) {
    return next(new ErrorHandler(403, "Unauthorized to access this project"));
  }

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
  const projectData = await db.query.project.findFirst({
    where: eq(project.id, projectId),
    with: {
      projectMembers: {
        where: eq(projectMember.userId, userId),
      },
      document: true,
    },
  });

  if (!projectData) {
    return next(new ErrorHandler(404, "Project not found"));
  }

  if (projectData.userId !== userId && !projectData.projectMembers.length) {
    return next(new ErrorHandler(403, "Unauthorized to access this project"));
  }

  if (!projectData.document) {
    return next(new ErrorHandler(404, "Document not found"));
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
