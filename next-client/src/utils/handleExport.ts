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

//   styles += `
//     p:empty {
//       border-bottom: 2px solid red;
//       width: 10rem;
//       height: 2px;
//     }
//   `;

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

  iframeDoc.write(`
    <html>
      <head>
        <title>Print</title>
        <style>
          ${tiptapStyles}
          p:empty:not([class]):not([id]):not([style]) {
            min-height: 1em;
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        <div class="tiptap">
          ${htmlContent}
        </div>
      </body>
    </html>
  `);
  iframeDoc.close();

  iframe.onload = () => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };
}
