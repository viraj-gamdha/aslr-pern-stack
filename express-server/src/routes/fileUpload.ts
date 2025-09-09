import { handleFileUpload } from "@/controllers/fileUpload";
import { upload } from "@/middlewares/multer";
import { verifyAuth } from "@/middlewares/verifyAuth";
import express from "express";

const uploadRoutes = express.Router();

uploadRoutes.use(verifyAuth);
uploadRoutes.post("/:projectId", upload.single("file"), handleFileUpload);

export { uploadRoutes };
