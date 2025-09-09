import { TryCatch } from "@/utils/asyncHandler.js";
import ErrorHandler from "@/utils/errorHandler.js";
import { verifyProjectOwnerShip } from "@/utils/project";
import {
  convertToWebP,
  getFileCategory,
  uploadToS3,
} from "@/utils/s3Client.js";
import { v4 as uuidv4 } from "uuid";

export const handleFileUpload = TryCatch<{}, { projectId: string }>(
  async (req, res, next) => {
    const { projectId } = req.params;
    const userId = req.userId as string;
    const file = req.file;
    if (!file) throw new Error("No file uploaded");

    const category = getFileCategory(file.mimetype);
    if (category === "unsupported") {
      return next(new ErrorHandler(400, "Unsupported file type"));
    }

    await verifyProjectOwnerShip(userId, projectId);

    const buffer = file.buffer;
    const bucket = process.env.S3_BUCKET!;
    let finalBuffer = buffer;
    let key = "";

    if (category === "image") {
      finalBuffer = await convertToWebP(buffer);
      key = `image-${uuidv4()}.webp`;
    } else if (category === "pdf") {
      key = `doc-${uuidv4()}.pdf`;
    }

    await uploadToS3({
      buffer: finalBuffer,
      key,
      contentType: category === "image" ? "image/webp" : "application/pdf",
      bucket,
    });

    res.status(200).json({
      success: true,
      data: `${process.env.S3_PUBLIC_URL}/${key}`,
      message: "",
    });
  }
);
