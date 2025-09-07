import { TableOfContentDataItem } from "@tiptap/extension-table-of-contents";
import { create } from "zustand";

type EditorStore = {
  // Table of contents
  tocItems: TableOfContentDataItem[];
  setTocItems: (items: TableOfContentDataItem[]) => void;
  clearTocItems: () => void;
  showToC: boolean;
  setShowToC: (value: boolean) => void;

  // Saved
  isDirty: boolean;
  setIsDirty: (value: boolean) => void;
};

export const useEditorStore = create<EditorStore>((set) => ({
  // Table of contents
  tocItems: [],
  setTocItems: (tocItems) => set({ tocItems }),
  clearTocItems: () => set({ tocItems: [] }),
  showToC: false,
  setShowToC: (value) => set({ showToC: value }),

  // Saved state
  isDirty: false,
  setIsDirty: (val) => set({ isDirty: val }),
}));
