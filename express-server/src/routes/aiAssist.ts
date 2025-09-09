import { enhanceText } from "@/controllers/aiAssist";
import { verifyAuth } from "@/middlewares/verifyAuth";
import { Router } from "express";

const aiAssistRoutes = Router();

aiAssistRoutes.use(verifyAuth);
aiAssistRoutes.post("/enhance-text/:projectId", enhanceText);

export { aiAssistRoutes };
