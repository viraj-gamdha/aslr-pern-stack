import { S3Client } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: true,
});

// File types
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ALLOWED_PDF_TYPES = ["application/pdf"];

export function getFileCategory(mime: string): "image" | "pdf" | "unsupported" {
  if (ALLOWED_IMAGE_TYPES.includes(mime)) return "image";
  if (ALLOWED_PDF_TYPES.includes(mime)) return "pdf";
  return "unsupported";
}

// imageConversion
export async function convertToWebP(buffer: Buffer): Promise<Buffer> {
  return await sharp(buffer)
    .rotate()
    .resize(960)
    .webp({ quality: 75 })
    .toBuffer();
}

// Upload to garage
export async function uploadToS3({
  buffer,
  key,
  contentType,
  bucket,
}: {
  buffer: Buffer;
  key: string;
  contentType: string;
  bucket: string;
}) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await s3Client.send(command);
  return key;
}

