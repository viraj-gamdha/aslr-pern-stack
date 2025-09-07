import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

// Define page size options with type safety
export const PageSizes = {
  A4: "a4",
  LETTER: "letter",
  LEGAL: "legal",
  A3: "a3",
  A5: "a5",
} as const;

export type PageSize = (typeof PageSizes)[keyof typeof PageSizes];

// Define orientation options with type safety
export const Orientations = {
  PORTRAIT: "portrait",
  LANDSCAPE: "landscape",
} as const;

export type Orientation = (typeof Orientations)[keyof typeof Orientations];

// Interface for page extension options
export interface PageExtensionOptions {
  pageSize: PageSize;
  orientation: Orientation;
  margin: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  showPageBreaks: boolean;
}

// Extend Tiptap's command interface
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    page: {
      setPageSize: (size: PageSize) => ReturnType;
      setPageOrientation: (orientation: Orientation) => ReturnType;
      setPageMargins: (margins: {
        top: string;
        right: string;
        bottom: string;
        left: string;
      }) => ReturnType;
      togglePageBreaks: () => ReturnType;
    };
  }
}

export const PageExtension = Extension.create<PageExtensionOptions>({
  name: "page",

  // Default options
  addOptions() {
    return {
      pageSize: PageSizes.A4,
      orientation: Orientations.PORTRAIT,
      margin: {
        top: "1in",
        right: "1in",
        bottom: "1in",
        left: "1in",
      },
      showPageBreaks: true,
    };
  },

  // Add global attributes to the document node
  addGlobalNodeAttributes() {
    return [
      {
        types: ["doc"],
        attributes: {
          pageStyle: {
            default: null,
            parseHTML: () => null,
            renderHTML: (attributes) => {
              if (!attributes.pageStyle) return {};

              const { pageSize, orientation, margin } = attributes.pageStyle;

              // Calculate dimensions based on page size and orientation
              const dimensions = getPageDimensions(pageSize, orientation);

              return {
                style: `
                  width: ${dimensions.width};
                  min-height: "297mm";
                  margin: 0 auto;
                  padding: ${margin.top} ${margin.right} ${margin.bottom} ${
                  margin.left
                };
                  box-sizing: border-box;
                  background: white;
                  box-shadow: ${
                    this.options.showPageBreaks
                      ? "0 0 10px rgba(0,0,0,0.1)"
                      : "none"
                  };
                  position: relative;
                `,
                "data-page-size": pageSize,
                "data-orientation": orientation,
              };
            },
          },
        },
      },
    ];
  },

  // Add commands to update page settings
  addCommands() {
    return {
      setPageSize:
        (size: PageSize) =>
        ({ commands }) => {
          const currentAttrs = this.editor.getAttributes("doc").pageStyle || {};
          return commands.updateAttributes("doc", {
            pageStyle: {
              ...currentAttrs,
              pageSize: size,
            },
          });
        },
      setPageOrientation:
        (orientation: Orientation) =>
        ({ commands }) => {
          const currentAttrs = this.editor.getAttributes("doc").pageStyle || {};
          return commands.updateAttributes("doc", {
            pageStyle: {
              ...currentAttrs,
              orientation,
            },
          });
        },
      setPageMargins:
        (margins: {
          top: string;
          right: string;
          bottom: string;
          left: string;
        }) =>
        ({ commands }) => {
          const currentAttrs = this.editor.getAttributes("doc").pageStyle || {};
          return commands.updateAttributes("doc", {
            pageStyle: {
              ...currentAttrs,
              margin: margins,
            },
          });
        },
      togglePageBreaks:
        () =>
        ({ commands }) => {
          // This command toggles the visibility of page breaks
          // Note: This doesn't persist in the document attributes
          // but controls the display of page breaks
          return commands.focus(); // Placeholder - actual implementation would need state management
        },
    };
  },

  // Add ProseMirror plugin to handle page break decorations
  addProseMirrorPlugins() {
    const { showPageBreaks } = this.options;

    return [
      new Plugin({
        key: new PluginKey("pageBreaks"),
        props: {
          decorations: (state) => {
            if (!showPageBreaks) return null;

            const decorations: Decoration[] = [];
            const { doc } = state;

            // Get current page style or use defaults
            const pageStyle = this.editor.getAttributes("doc").pageStyle || {};
            const pageSize = pageStyle.pageSize || this.options.pageSize;
            const orientation =
              pageStyle.orientation || this.options.orientation;

            const pageHeight = getPageHeightInPixels(pageSize, orientation);

            // Only add page breaks if we have a valid page height
            if (pageHeight > 0) {
              let currentHeight = 0;

              doc.descendants((node, pos) => {
                if (node.isTextblock) {
                  // Estimate height of this node (this is approximate)
                  const lineHeight = 1.5; // Assume 1.5 line height
                  const fontSize = 16; // Assume 16px base font size
                  const lines = node.textContent.split("\n").length;
                  const nodeHeight = lines * lineHeight * fontSize;

                  currentHeight += nodeHeight;

                  // If we've exceeded the page height, add a page break
                  if (currentHeight >= pageHeight) {
                    decorations.push(
                      Decoration.widget(pos, () => {
                        const div = document.createElement("div");
                        div.className = "page-break";
                        div.textContent = "Page Break";
                        return div;
                      })
                    );
                    currentHeight = nodeHeight; // Reset for new page
                  }
                }
              });
            }

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});

// Helper function to get page dimensions
function getPageDimensions(pageSize: PageSize, orientation: Orientation) {
  const dimensions: Record<PageSize, { width: number; height: number }> = {
    [PageSizes.A4]: { width: 210, height: 297 },
    [PageSizes.LETTER]: { width: 216, height: 279 },
    [PageSizes.LEGAL]: { width: 216, height: 356 },
    [PageSizes.A3]: { width: 297, height: 420 },
    [PageSizes.A5]: { width: 148, height: 210 },
  };

  const size = dimensions[pageSize] || dimensions[PageSizes.A4];
  const width =
    orientation === Orientations.LANDSCAPE ? size.height : size.width;
  const height =
    orientation === Orientations.LANDSCAPE ? size.width : size.height;

  return {
    width: `${width}mm`,
    height: `${height}mm`,
  };
}

// Helper function to get page height in pixels for page break calculations
function getPageHeightInPixels(
  pageSize: PageSize,
  orientation: Orientation
): number {
  const dimensions = getPageDimensions(pageSize, orientation);

  // Convert mm to pixels (1mm ≈ 3.78px at standard screen resolution)
  const heightMm = parseFloat(dimensions.height);
  return heightMm * 3.78;
}
