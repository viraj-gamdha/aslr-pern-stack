import { handleFileUpload } from "@/controllers/fileUpload.js";
import { upload } from "@/middlewares/multer.js";
import { verifyAuth } from "@/middlewares/verifyAuth.js";
import express from "express";

const uploadRoutes = express.Router();

uploadRoutes.use(verifyAuth);
uploadRoutes.post("/:projectId", upload.single("file"), handleFileUpload);

export { uploadRoutes };
