"use client";

import { useCurrentEditor, useEditorState } from "@tiptap/react";
import s from "./toolbar.module.scss";
import {
  BoldIcon,
  Code2Icon,
  ItalicIcon,
  ListTodoIcon,
  LucideIcon,
  QuoteIcon,
  RemoveFormattingIcon,
  StrikethroughIcon,
  Subscript,
  Superscript,
  Underline,
} from "lucide-react";
// Tool buttons
import AlignButton from "./buttons/align-button";
import BaseButton from "./buttons/base-button";
import FontFamilyButton from "./buttons/font-family-button";
import FontSizeButton from "./buttons/font-size-button";
import HeadingLevelButton from "./buttons/heading-level-button";
import HighlightColorButton from "./buttons/highlight-color-button";
import ImageButton from "./buttons/image-button";
import LineHeightButton from "./buttons/line-height-button";
import LinkButton from "./buttons/link-button";
import ListButton from "./buttons/list-button";
import TableButton from "./buttons/table-button";
import TextColorButton from "./buttons/text-color-button";

const Toolbar = () => {
  const { editor } = useCurrentEditor();

  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) return null;

      return {
        isBold: editor.isActive("bold"),
        isItalic: editor.isActive("italic"),
        isUnderline: editor.isActive("underline"),
        isTaskList: editor.isActive("taskList"),
        isCodeBlock: editor.isActive("codeBlock"),
        isBlockquote: editor.isActive("blockquote"),
        isStrikethrough: editor.isActive("strike"),
        isSubscript: editor.isActive("subscript"),
        isSuperscript: editor.isActive("superscript"),
      };
    },
  });

  // Some non-dropdown simple tool sections
  const sections: {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    isActive?: boolean;
  }[][] = [
    [
      {
        label: "Bold",
        icon: BoldIcon,
        onClick: () => editor?.chain().focus().toggleBold().run(),
        isActive: editorState?.isBold,
      },
      {
        label: "Italic",
        icon: ItalicIcon,
        onClick: () => editor?.chain().focus().toggleItalic().run(),
        isActive: editorState?.isItalic,
      },
      {
        label: "Underline",
        icon: Underline,
        onClick: () => editor?.chain().focus().toggleUnderline().run(),
        isActive: editorState?.isUnderline,
      },
      {
        label: "Strikethrough",
        icon: StrikethroughIcon,
        onClick: () => editor?.chain().focus().toggleStrike().run(),
        isActive: editorState?.isStrikethrough,
      },
    ],
    [
      {
        label: "Subscript",
        icon: Subscript,
        onClick: () => editor?.chain().focus().toggleSubscript().run(),
        isActive: editorState?.isSubscript,
      },
      {
        label: "Superscript",
        icon: Superscript,
        onClick: () => editor?.chain().focus().toggleSuperscript().run(),
        isActive: editorState?.isSuperscript,
      },
    ],
    [
      {
        label: "List Todo",
        icon: ListTodoIcon,
        onClick: () => editor?.chain().focus().toggleTaskList().run(),
        isActive: editorState?.isTaskList,
      },

      {
        label: "Code Block",
        icon: Code2Icon,
        onClick: () => editor?.chain().focus().toggleCodeBlock().run(),
        isActive: editorState?.isCodeBlock,
      },
      {
        label: "Blockquote",
        icon: QuoteIcon,
        onClick: () => editor?.chain().focus().toggleBlockquote().run(),
        isActive: editorState?.isBlockquote,
      },
      {
        label: "Remove Formatting",
        icon: RemoveFormattingIcon,
        onClick: () => editor?.chain().focus().unsetAllMarks().run(),
      },
    ],
  ];

  return (
    <div className={s.container}>
      {sections[0].map((item) => (
        <BaseButton key={item.label} {...item} />
      ))}
      <FontFamilyButton />
      <HeadingLevelButton />
      <FontSizeButton />
      {sections[1].map((item) => (
        <BaseButton key={item.label} {...item} />
      ))}
      <TextColorButton />
      <HighlightColorButton />
      <LinkButton />
      <ImageButton />
      <TableButton />
      <AlignButton />
      <LineHeightButton />
      <ListButton />
      {sections[2].map((item) => (
        <BaseButton key={item.label} {...item} />
      ))}
    </div>
  );
};

export default Toolbar;
