"use client";

import s from "@/components/page/document/editor.module.scss";
import { EditorContext, JSONContent, useEditor } from "@tiptap/react";
import React, { ReactNode, useEffect, useMemo } from "react";
// Starter kit includes history etc...
import StarterKit from "@tiptap/starter-kit";
// Underline mark (from starter kit)
// Text styles kit : For font family & text styles, color, font size
import { TextStyleKit } from "@tiptap/extension-text-style";
import { LineHeight } from "@/components/page/document/extensions/lineHeight";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
// List kit using some of from list kit
import { TaskList, TaskItem } from "@tiptap/extension-list";
// Table
import { TableKit } from "@tiptap/extension-table";
// Image (included with resize-image)
// Link (from starter kit)
// Custom resizer extension
import ImageResize from "tiptap-extension-resize-image";
// Code block, blockquote, strike from starter kit
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
// Placeholder is included in extensions
import { CharacterCount, Placeholder } from "@tiptap/extensions";
// ToC
import {
  getHierarchicalIndexes,
  TableOfContents,
} from "@tiptap/extension-table-of-contents";
import FileHandler from "@tiptap/extension-file-handler";
import { lineHeights } from "@/components/page/document/toolbar/buttons/line-height-button";

import { useDebouncedCallback } from "use-debounce";
import { useUpdateDocumentMutation } from "@/redux/apis/documentApiSlice";
import { useParams } from "next/navigation";
import { useGetUserProjectByIdQuery } from "@/redux/apis/projectApiSlice";
import { useEditorStore } from "@/stores/useEditorStore";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { setEditorDirty } from "@/redux/features/editorSlice";
import { PageExtension } from "@/components/page/document/extensions/page";
import classNames from "classnames";

const TipTapEditorProvider = ({ children }: { children: ReactNode }) => {
  // redux / rtk related states
  const dispatch = useAppDispatch();
  const isEditorDirty = useAppSelector((state) => state.editor.isEditorDirty);

  // zustand stores
  const { setTocItems, clearTocItems } = useEditorStore();

  const { projectId } = useParams<{ projectId: string }>();
  const {
    data: projectData,
    // isLoading: loadingProjectData,
    isFetching: fetchingProjectData,
  } = useGetUserProjectByIdQuery(projectId);

  const [updateDocument] = useUpdateDocumentMutation();

  const debouncedUpdate = useDebouncedCallback(
    (editorInstance: typeof editor) => {
      if (!editorInstance) return;
      const content: JSONContent = editorInstance.getJSON();
      // API call
      if (isEditorDirty) {
        updateDocument({ projectId, content });
      }
    },
    3000
  );

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: classNames(s.prop),
      },
    },

    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
        },
      }),
      Placeholder.configure({
        placeholder: "Start typing here...",
      }),
      //  Text styles font family color
      TextStyleKit.configure({
        lineHeight: false,
        fontSize: {
          types: ["textStyle"],
        },
      }),
      // Not using extension from kit using custom...
      LineHeight.configure({
        types: ["paragraph", "heading"],
        heights: lineHeights.map((i) => i.value),
        defaultHeight: "1.5",
      }),
      TableKit.configure({
        table: {
          resizable: true,
          cellMinWidth: 50,
          allowTableNodeSelection: true,
        },
      }),
      // Text Highlight
      Highlight.configure({ multicolor: true }),
      //   Image,
      ImageResize,
      //   From TaskList kit
      TaskItem.configure({ nested: true }),
      TaskList,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      // Subscript
      Subscript,
      // Superscript
      Superscript,
      // Counter
      CharacterCount,
      TableOfContents.configure({
        getIndex: getHierarchicalIndexes,
        onUpdate(content) {
          setTocItems(content);
        },
      }),
      // Drop file upload disabled
      FileHandler.configure({
        onDrop: () => false,
        onPaste: () => false,
        allowedMimeTypes: [], // Optional: block all file types
      }),
      PageExtension.configure({
        pageSize: "a3",
        orientation: "landscape",
        margin: {
          top: "1in",
          right: "1in",
          bottom: "1in",
          left: "1in",
        },
        showPageBreaks: true,
      }),
    ],
    onUpdate: ({ editor }) => {
      dispatch(setEditorDirty(true));
      debouncedUpdate(editor); // Debounced function call
    },
    immediatelyRender: false,
  });

  // Update editor content when document is fetched
  // (for first load time only not cache update)
  // To preserve history...
  useEffect(() => {
    if (
      !fetchingProjectData &&
      editor &&
      projectData?.data?.document?.content
    ) {
      editor.commands.setContent(projectData.data.document.content, {
        emitUpdate: false,
      });
    }
  }, [editor, fetchingProjectData]);

  // Memoize the provider value to avoid unnecessary re-renders
  const providerValue = useMemo(() => ({ editor }), [editor]);
  useEffect(() => {
    return () => clearTocItems();
  }, [clearTocItems]);

  return (
    <EditorContext.Provider value={providerValue}>
      {children}
    </EditorContext.Provider>
  );
};

export default TipTapEditorProvider;
