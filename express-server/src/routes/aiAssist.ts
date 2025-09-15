import { enhanceText } from "@/controllers/aiAssist.js";
import { verifyAuth } from "@/middlewares/verifyAuth.js";
import { Router } from "express";

const aiAssistRoutes = Router();

aiAssistRoutes.use(verifyAuth);
aiAssistRoutes.post("/enhance-text/:projectId", enhanceText);

export { aiAssistRoutes };
