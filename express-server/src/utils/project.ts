import { db } from "@/db/dbInit";
import { project, projectMember } from "@/db/schema/index.js";
import { eq } from "drizzle-orm";
import ErrorHandler from "./errorHandler";
import { JSONContent } from "@/types/document";

// Fetch project to verify access
export const verifyProjectOwnerShip = async (
  userId: string,
  projectId: string
) => {
  const projectData = await db.query.project.findFirst({
    where: eq(project.id, projectId),
    with: {
      projectMembers: {
        where: eq(projectMember.userId, userId),
        with: {
          user: true,
        },
      },
      document: true,
    },
  });

  if (!projectData) {
    throw new ErrorHandler(404, "Project not found");
  }

  if (projectData.userId !== userId && !projectData.projectMembers.length) {
    throw new ErrorHandler(403, "Unauthorized to access this project");
  }

  return projectData;
};

// For deleting images from doc
export function extractImageKeys(content: JSONContent): Set<string> {
  const keys = new Set<string>();
  const s3BaseUrl = process.env.S3_PUBLIC_URL!;

  function traverse(node: JSONContent) {
    if (node.type === "imageResize" && node.attrs?.src) {
      const url = node.attrs.src;

      // Only process images hosted on S3
      if (url.startsWith(s3BaseUrl)) {
        const key = extractKeyFromUrl(url, s3BaseUrl);
        if (key) keys.add(key);
      }
    }

    if (node.content) {
      node.content.forEach(traverse);
    }
  }

  traverse(content);
  return keys;
}

function extractKeyFromUrl(url: string, baseUrl: string): string | null {
  try {
    const parsed = new URL(url);
    const base = new URL(baseUrl);

    // Ensure the host matches your S3 base
    if (parsed.host !== base.host) return null;

    // Extract key by removing base path
    return parsed.pathname.replace(base.pathname, "").replace(/^\/+/, "");
  } catch {
    return null;
  }
}
