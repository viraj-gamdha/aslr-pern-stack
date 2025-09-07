import { handleFileUpload } from "@/controllers/file-upload";
import { upload } from "@/middlewares/multer";
import express from "express";

const uploadRoutes = express.Router();

uploadRoutes.post("/", upload.single("file"), handleFileUpload);

export { uploadRoutes };
