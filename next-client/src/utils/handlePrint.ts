import { Editor } from "@tiptap/react";

function getTiptapStyles(): string {
  let styles = "";
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      const rules = sheet.cssRules;
      for (const rule of Array.from(rules)) {
        if (rule.cssText.includes(".tiptap")) {
          styles += rule.cssText + "\n";
        }
      }
    } catch (e) {
      // Skip cross-origin stylesheets
    }
  }

  // other overriding styles
  styles += `
    *,
    *::before,
    *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    p:empty:not([class]):not([id]):not([style]) {
      min-height: 1em;
      line-height: 1;
    }

    @media print {
      table th {
        background-color: #f5f5f5;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      mark {
        background-color: #059d00;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  `;
  return styles;
}

export function printTiptapContent(editor: Editor) {
  if (!editor) return;

  const htmlContent = editor.getHTML();
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

  const tiptapStyles = getTiptapStyles();

  // Modern approach: Build the document using DOM methods instead of document.write()
  iframeDoc.open();

  // Create and populate the HTML structure
  const html = iframeDoc.createElement("html");
  const head = iframeDoc.createElement("head");
  const body = iframeDoc.createElement("body");

  // Set up the title
  const title = iframeDoc.createElement("title");
  title.textContent = "Print";
  head.appendChild(title);

  // Set up the styles
  const style = iframeDoc.createElement("style");
  style.textContent = tiptapStyles;
  head.appendChild(style);

  // Set up the content container
  const contentDiv = iframeDoc.createElement("div");
  contentDiv.className = "tiptap";
  contentDiv.innerHTML = htmlContent;
  body.appendChild(contentDiv);

  // Assemble the document
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
