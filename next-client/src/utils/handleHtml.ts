import { saveAs } from "file-saver";
import { PageOptions } from "@/components/page/document/extensions/pageOptions";
import { ReferenceItem } from "@/types/document";
import { Editor } from "@tiptap/react";
import { createReferencesSection, getTiptapStyles } from "./exportUtil";

type ExportHtmlContentProps = {
  editor: Editor;
  pageOptions: PageOptions;
  htmlTitle?: string;
  references?: ReferenceItem[];
};

export function downloadTiptapHtmlContent({
  editor,
  pageOptions,
  htmlTitle = "Document",
  references,
}: ExportHtmlContentProps) {
  if (!editor) return;

  const clonedEditorContent = (
    editor.options.element as HTMLElement
  ).cloneNode(true) as HTMLElement;

  const wrapper = document.createElement("div");
  wrapper.appendChild(clonedEditorContent);

  if (references && references.length > 0) {
    const referencesSection = createReferencesSection(document, references);
    wrapper.appendChild(referencesSection);
  }

  const styles = getTiptapStyles(pageOptions);

  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${htmlTitle}</title>
        <style>${styles}</style>
      </head>
      <body>${wrapper.innerHTML}</body>
    </html>
  `;

  const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
  saveAs(blob, `${htmlTitle}.html`);
}
