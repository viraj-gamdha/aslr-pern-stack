import { db } from "@/db/dbInit.js";
import { project, projectMember } from "@/db/schema/index.js";
import { JSONContent } from "@/types/document";
import {
  extractPlainTextFromTiptap,
  getAiEnhancerPrompt,
  validateEnhanceOptions,
} from "@/utils/aiUtils.js";
import { TryCatch } from "@/utils/asyncHandler.js";
import ErrorHandler from "@/utils/errorHandler.js";
import { eq } from "drizzle-orm";
import OpenAI from "openai";

const openai = new OpenAI({
  // baseURL: "http://localhost:3000/ollama/v1",
  // baseURL: "http://localhost:3002/api",
  apiKey: process.env.OPENAI_API_KEY,
  // apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjdjMDEyZjI0LWEwNGQtNDIwNS05NDk3LWU0MzI4MzU0YmZjMyJ9.1jOfMH4jxU6YZvS447FztJQaNePlefsGJEl1FBYUfLA",
});

export const enhanceText = TryCatch<EnhanceTextRequest, { projectId: string }>(
  async (req, res, next) => {
    const { text, action, options } = req.body;
    const userId = req.userId as string;
    const { projectId } = req.params;

    if (!text || !action || !projectId) {
      return next(new ErrorHandler(400, "Missing required parameters"));
    }

    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount < 3) {
      return next(
        new ErrorHandler(400, "Please select minimum 3 words to proceed")
      );
    }

    if (wordCount > 200 || text.length > 1600) {
      return next(
        new ErrorHandler(
          400,
          "Input text should be less than 200 words or 1600 characters"
        )
      );
    }

    // Validate options strictly based on action
    if (!validateEnhanceOptions(action, options)) {
      return next(
        new ErrorHandler(
          400,
          "Invalid or missing options for the specified action"
        )
      );
    }

    // Fetch project to verify access
    const projectData = await db.query.project.findFirst({
      where: eq(project.id, projectId),
      with: {
        projectMembers: {
          where: eq(projectMember.userId, userId),
        },
        document: true,
      },
    });

    if (!projectData) {
      return next(new ErrorHandler(404, "Project not found"));
    }

    if (projectData.userId !== userId && !projectData.projectMembers.length) {
      return next(new ErrorHandler(403, "Unauthorized to access this project"));
    }

    const rawContext = extractPlainTextFromTiptap(
      projectData?.document?.content as JSONContent
    );
    const context = rawContext.split(/\s+/).slice(0, 100).join(" ");

    const prompt = `
You are a helpful assistant that enhances text based on instructions.
Use the following context as reference: "${context}"
Respond in plain language, no chatty tone, no explanations.
Limit your response to 50 words max.
${getAiEnhancerPrompt(action, options, text)}
`.trim();

    const completion = await openai.chat.completions.create({
      // model: "gemma3:1b",
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const enhancedText = completion.choices[0].message.content?.trim() || "";

    return res.status(200).json({
      success: true,
      message: "",
      data: enhancedText,
    });
  }
);
