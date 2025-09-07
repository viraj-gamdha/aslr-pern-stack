import { CustomSelect } from "@/components/ui/select";
import { useCurrentEditor, useEditorState } from "@tiptap/react";
import {
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
} from "lucide-react";
import React from "react";

const AlignButton = () => {
  const { editor } = useCurrentEditor();

  const alignments = [
    {
      label: "Align Left",
      value: "left",
      icon: AlignLeftIcon,
    },
    {
      label: "Align Center",
      value: "center",
      icon: AlignCenterIcon,
    },
    {
      label: "Align Right",
      value: "right",
      icon: AlignRightIcon,
    },
    {
      label: "Align Justify",
      value: "justify",
      icon: AlignJustifyIcon,
    },
  ];

  // active alignment
  const currentValue = useEditorState({
    editor,
    selector: ({ editor }) => {
      return (
        alignments.find((i) => editor?.isActive({ textAlign: i.value }))
          ?.value || "left"
      );
    },
  });

  return (
    <CustomSelect
      value={currentValue as string}
      options={alignments}
      showClearIcon={false}
      showChevronIcon={false}
      showDisplayText={false}
      tooltip="Text Align"
      buttonVariant="icon_bordered"
      onChange={(value) =>
        editor
          ?.chain()
          .focus()
          .setTextAlign(value as string)
          .run()
      }
    />
  );
};

export default AlignButton;
