import { PageOptions } from "@/components/page/document/extensions/pageOptions";
import { ReferenceItem } from "@/types/document";
import { Editor } from "@tiptap/react";
import { createReferencesSection, getTiptapStyles } from "./exportUtil";

type PrintPdfContentProps = {
  editor: Editor;
  pageOptions: PageOptions;
  pdfTitle?: string;
  references?: ReferenceItem[];
};

export function printTiptapContent({
  editor,
  pageOptions,
  pdfTitle,
  references,
}: PrintPdfContentProps) {
  console.log(pageOptions, "PageOptions");
  if (editor) {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    // Clone the editor's main content element.
    // This is the key step that preserves all inline styles and classes,
    // including the dynamic CSS variables and the 'show-break-line' class.
    const clonedEditorContent = (
      editor?.options?.element as HTMLElement
    ).cloneNode(true) as HTMLElement;

    // Wrap the cloned content in a div to ensure proper styling
    const printWrapper = iframeDoc.createElement("div");
    printWrapper.appendChild(clonedEditorContent);

    // Add references section if available
    if (references && references?.length > 0) {
      const referencesSection = createReferencesSection(iframeDoc, references);
      printWrapper.appendChild(referencesSection);
    }

    // Get only the Tiptap-specific styles from the current document
    const tiptapStyles = getTiptapStyles(pageOptions);

    iframeDoc.open();

    // Build the document from scratch
    const html = iframeDoc.createElement("html");
    const head = iframeDoc.createElement("head");
    const body = iframeDoc.createElement("body");

    const title = iframeDoc.createElement("title");
    title.textContent = pdfTitle || "Document";
    head.appendChild(title);

    const style = iframeDoc.createElement("style");
    style.textContent = tiptapStyles;
    head.appendChild(style);

    // Append the prepared content
    body.appendChild(printWrapper);
    html.appendChild(head);
    html.appendChild(body);
    iframeDoc.appendChild(html);

    iframeDoc.close();

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    };
  }
}
