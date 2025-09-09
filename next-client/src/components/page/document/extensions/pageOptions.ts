import { useEditorStore } from "@/stores/useEditorStore";
import { Extension } from "@tiptap/core";
import z from "zod";

// Define the shape of our extension options and command parameters for type safety.
export const pageOptionsSchema = z.object({
  margins: z.object({
    top: z.int().min(0),
    right: z.int().min(0),
    bottom: z.int().min(0),
    left: z.int().min(0),
  }),
});

export type PageOptions = z.infer<typeof pageOptionsSchema>;

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    setPageOptions: {
      setPageOptions: (options: Partial<PageOptions>) => ReturnType;
    };
  }
}

const PageOptionsExtension = Extension.create<PageOptions>({
  name: "pageOptions",

  addOptions() {
    return {
      margins: { top: 16, right: 16, bottom: 16, left: 16 },
    };
  },

  addCommands() {
    return {
      setPageOptions:
        (options) =>
        ({ editor }) => {
          const newOptions = { ...this.options, ...options };
          this.options = newOptions;

          useEditorStore.getState().setPageOptions(newOptions);

          const { margins } = newOptions;

          const tiptapElement = (
            editor?.options?.element as HTMLElement
          )?.querySelector(".tiptap") as HTMLElement;
          if (!tiptapElement) return false;

          tiptapElement.style.setProperty(
            "--page-padding-top",
            `${margins.top}mm`
          );
          tiptapElement.style.setProperty(
            "--page-padding-right",
            `${margins.right}mm`
          );
          tiptapElement.style.setProperty(
            "--page-padding-bottom",
            `${margins.bottom}mm`
          );
          tiptapElement.style.setProperty(
            "--page-padding-left",
            `${margins.left}mm`
          );

          return true;
        },
    };
  },
});

export default PageOptionsExtension;
