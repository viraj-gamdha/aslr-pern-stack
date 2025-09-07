import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  // 3mb
  limits: { fileSize: 3 * 1024 * 1024 },
});
