import { PageOptions } from "@/components/page/document/extensions/pageOptions";
import { ReferenceItem } from "@/types/document";

export function getTiptapStyles(pageOptions: PageOptions): string {
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

  const margins = pageOptions.margins;

  styles += `@page { margin: ${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm; }`;

  // other overriding styles
  // Its necessary to add some overrides
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
      .tiptap {
        padding: 0 !important;
        width: auto !important;
        min-height: auto !important;
        box-shadow: none !important;
        background-image: none !important;
      }

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

  // references page
  styles += `
   .references-page {
     break-before: page;
     page-break-before: always;
     padding-top: 0;
     margin-top: 0;
   }
 `;

  return styles;
}

export function createReferencesSection(
  doc: Document,
  references: ReferenceItem[]
): HTMLElement {
  const wrapper = doc.createElement("div");
  wrapper.className = "tiptap references-page";
  const heading = doc.createElement("h1");
  heading.textContent = "References";
  heading.style.marginBottom = "1em";
  wrapper.appendChild(heading);

  const list = doc.createElement("ol");
  references.forEach((ref) => {
    const item = doc.createElement("li");
    item.textContent = `${ref.name}: ${ref.reference}`;
    list.appendChild(item);
  });

  wrapper.appendChild(list);
  return wrapper;
}
