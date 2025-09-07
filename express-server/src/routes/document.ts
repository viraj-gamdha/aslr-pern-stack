import { getDocumentByProjectId, updateDocument } from "@/controllers/document.js";
import { verifyAuth } from "@/middlewares/verifyAuth.js";
import { Router } from "express";

const documentRoutes = Router();
documentRoutes.use(verifyAuth);

documentRoutes.get("/:projectId", getDocumentByProjectId);
documentRoutes.put("/:projectId", updateDocument);

export { documentRoutes };
