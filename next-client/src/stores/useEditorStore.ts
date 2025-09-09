import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PageOptions } from "@/components/page/document/extensions/pageOptions";
import { TableOfContentDataItem } from "@tiptap/extension-table-of-contents";

type EditorStore = {
  tocItems: TableOfContentDataItem[];
  setTocItems: (items: TableOfContentDataItem[]) => void;
  clearTocItems: () => void;
  showToC: boolean;
  setShowToC: (value: boolean) => void;

  isDirty: boolean;
  setIsDirty: (value: boolean) => void;

  pageOptions: PageOptions;
  setPageOptions: (options: PageOptions) => void;
};

export const useEditorStore = create<EditorStore>()(
  persist(
    (set) => ({
      tocItems: [],
      setTocItems: (tocItems) => set({ tocItems }),
      clearTocItems: () => set({ tocItems: [] }),
      showToC: false,
      setShowToC: (value) => set({ showToC: value }),

      isDirty: false,
      setIsDirty: (val) => set({ isDirty: val }),

      pageOptions: {
        pageSize: "a4",
        margins: { top: 16, right: 16, bottom: 16, left: 16 },
        showBreakLine: true,
      },
      setPageOptions: (options) => set({ pageOptions: options }),
    }),
    {
      name: "editor-store", //Key in localStorage
      partialize: (state) => ({
        pageOptions: state.pageOptions, // Only persist this part
      }),
    }
  )
);
