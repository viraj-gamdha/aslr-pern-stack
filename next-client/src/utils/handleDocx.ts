import htmlDocx from "html-docx-js/dist/html-docx";
import { saveAs } from "file-saver";
import { Editor } from "@tiptap/react";
import { PageOptions } from "@/components/page/document/extensions/pageOptions";
import { createReferencesSection, getTiptapStyles } from "./exportUtil";
import { ReferenceItem } from "@/types/document";

type ExportDocxProps = {
  editor: Editor;
  pageOptions: PageOptions;
  docxTitle?: string;
  references?: ReferenceItem[];
};

export async function exportTiptapToDocx({
  editor,
  pageOptions,
  docxTitle = "Document",
  references = [],
}: ExportDocxProps) {
  if (!editor) return;

  const clonedEditorContent = (editor.options.element as HTMLElement).cloneNode(
    true
  ) as HTMLElement;

  const wrapper = document.createElement("div");
  wrapper.className = "tiptap";
  wrapper.appendChild(clonedEditorContent);

  console.log(clonedEditorContent, "CONTENT");

  // Process images to base64 and preserve sizing
  //

  if (references.length > 0) {
    const referencesSection = createReferencesSection(document, references);
    wrapper.appendChild(referencesSection);
  }

  const styles = getTiptapStyles(pageOptions);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${docxTitle}</title>
        <style>${styles}</style>
      </head>
      <body>${wrapper.innerHTML}</body>
    </html>
  `;

  const blob = htmlDocx.asBlob(html);
  saveAs(blob, `${docxTitle}.docx`);
}
