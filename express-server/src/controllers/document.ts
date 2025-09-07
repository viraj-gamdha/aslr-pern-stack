import { db } from "@/db/dbInit";
import { document, DocumentType, NewDocument } from "@/db/schema/document";
import { TryCatch } from "@/utils/asyncHandler.js";
import ErrorHandler from "@/utils/errorHandler";
import { and, eq } from "drizzle-orm";
import { Document, Packer, Paragraph, TextRun } from "docx";
import PDFDocument from "pdfkit";
import { JSDOM } from "jsdom";
import katex from "katex";
import { project, projectMember } from "@/db/schema/index.js";
import { generateHTML } from "@tiptap/html";

// Save or create document
// export const saveDocument = TryCatch<DocumentType, {}, {}, {}, DocumentType>(
//   async (req, res, next) => {
//     const { id, content } = req.body;

//     const userId = req.userId as string;

//     if (!content) {
//       return next(new ErrorHandler(400, "Missing required fields"));
//     }

//     const existingDoc = await db.query.document.findFirst({
//       where: eq(document.id, id),
//     });

//     if (existingDoc) {
//       const [updatedDoc] = await db
//         .update(document)
//         .set({ content, updatedAt: new Date() })
//         .where(eq(document.id, id))
//         .returning();

//       return res.status(200).json({
//         success: true,
//         message: "Document saved successfully",
//         data: updatedDoc,
//       });
//     }

//     const [newDoc] = await db
//       .insert(document)
//       .values({ content, userId })
//       .returning();

//     return res.status(200).json({
//       success: true,
//       message: "Document created successfully",
//       data: newDoc,
//     });
//   }
// );

//  <NOT NEEDED>
export const getDocumentByProjectId = TryCatch<
  {},
  { projectId: string },
  {},
  {},
  DocumentType
>(async (req, res, next) => {
  const userId = req.userId as string;
  const { projectId } = req.params;

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

  if (!projectData.document) {
    return next(new ErrorHandler(404, "Document not found"));
  }

  return res.status(200).json({
    success: true,
    message: "Document retrieved successfully",
    data: projectData.document,
  });
});

// Update document content
export const updateDocument = TryCatch<
  Partial<NewDocument>,
  { projectId: string },
  {},
  {},
  DocumentType
>(async (req, res, next) => {
  const userId = req.userId as string;
  const { projectId } = req.params;
  const { content } = req.body;

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

  if (!projectData.document) {
    return next(new ErrorHandler(404, "Document not found"));
  }

  // Update document
  const [updatedDocument] = await db
    .update(document)
    .set({
      content: content ?? projectData.document.content,
      updatedAt: new Date(),
    })
    .where(eq(document.id, projectData.document.id))
    .returning();

  return res.status(200).json({
    success: true,
    message: "Document saved successfully",
    data: updatedDocument,
  });
});

// Dummy refs (replace with dynamic fetch)
const getReferences = async (projectId: string) => [
  {
    author: "Doe, J.",
    year: 2020,
    title: "Sample Title",
    source: "Journal of Examples",
  },
];

// APA-style CSS for research paper formatting
const apaStyles = `
  @page { size: 8.5in 11in; margin: 1in; }
  body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 2; text-align: left; }
  p { text-indent: 0.5in; margin: 0; }
  h1 { font-size: 12pt; font-weight: bold; text-align: center; }
  ul { list-style-type: none; padding-left: 0.5in; }
`;

// export const exportDocument = TryCatch<
//   {},
//   { projectId: string; format: "word" | "pdf" | "latex" | "html" }
// >(async (req, res, next) => {
//   const { projectId, format } = req.params;
//   const userId = req.userId as string;

//   const projectData = await db.query.project.findFirst({
//     where: eq(project.id, projectId),
//     with: {
//       projectMembers: {
//         where: eq(projectMember.userId, userId),
//       },
//       document: true,
//     },
//   });

//   if (!projectData || !projectData.document) {
//     return next(new ErrorHandler(400, "Unauthorized"));
//   }

//   const doc = projectData?.document;

//   const jsonContent = doc.content; // JSONB from DB

//   // Generate main HTML from Tiptap JSON
//   const mainHtml = generateHTML(jsonContent, Object.values(extensions)); // Use shared extensions

//   // Get references and generate snippet
//   const refs = await getReferences(projectId);
//   const refsHtml = `<div style="page-break-before: always; margin-top: 1in;"><h1>References</h1><ul>${refs.map(r => `<li>${r.author} (${r.year}). ${r.title}. <i>${r.source}</i>.</li>`).join('')}</ul></div>`;

//   // Full HTML with styles and references
//   const fullHtml = `<!DOCTYPE html><html><head><style>${apaStyles}</style></head><body>${mainHtml}${refsHtml}</body></html>`;

//   let fileBuffer: Buffer;
//   let mimeType: string;
//   let fileExt: string;

//   switch (format) {
//     case 'html':
//       fileBuffer = Buffer.from(fullHtml);
//       mimeType = 'text/html';
//       fileExt = 'html';
//       break;

//     case 'docx':
//       fileBuffer = await htmlToDocx(fullHtml, null, { // Options for footer/page num if needed
//         table: { cellPadding: 0.1 }, // Inches
//         numbering: [{ reference: 'ref-num', levels: [{ format: 'decimal' }] }],
//       });
//       mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
//       fileExt = 'docx';
//       break;

//     case 'pdf':
//       const browser = await puppeteer.launch({ headless: true });
//       const page = await browser.newPage();
//       await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
//       fileBuffer = await page.pdf({
//         format: 'letter', // 8.5x11 inches
//         printBackground: true,
//         margin: { top: '1in', right: '1in', bottom: '1in', left: '1in' },
//       });
//       await browser.close();
//       mimeType = 'application/pdf';
//       fileExt = 'pdf';
//       break;

//     case 'latex':
//       nodePandoc(fullHtml, ['-f', 'html', '-t', 'latex'], (err: Error, result: string | boolean) => {
//         if (err) return res.status(500).send('LaTeX conversion failed');
//         fileBuffer = Buffer.from(result as string);
//         mimeType = 'text/plain';
//         fileExt = 'tex';
//         res.setHeader('Content-Type', mimeType);
//         res.setHeader('Content-Disposition', `attachment; filename=document.${fileExt}`);
//         res.send(fileBuffer);
//       });
//       return; // Async callback, return early

//     default:
//       return res.status(400).send('Invalid format');
//   }

//   res.setHeader('Content-Type', mimeType);
//   res.setHeader('Content-Disposition', `attachment; filename=document.${fileExt}`);
//   res.send(fileBuffer);
// });
