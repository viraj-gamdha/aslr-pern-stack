import { CustomSelect } from "@/components/ui/select";
import { type Level } from "@tiptap/extension-heading";
import { useCurrentEditor, useEditorState } from "@tiptap/react";
import React from "react";

const HeadingLevelButton = () => {
  const { editor } = useCurrentEditor();

  const headings = [
    { label: "Normal", value: "0", optionStyle: { fontSize: "0.9rem" } },
    { label: "H1", value: "1", optionStyle: { fontSize: "20px" } },
    { label: "H2", value: "2", optionStyle: { fontSize: "18px" } },
    { label: "H3", value: "3", optionStyle: { fontSize: "17px" } },
    { label: "H4", value: "4", optionStyle: { fontSize: "16px" } },
  ];

  const currentHeadingValue = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) return "0";

      for (let level = 1; level <= 5; level++) {
        if (editor.isActive("heading", { level })) {
          return String(level);
        }
      }

      return "0"; // Normal paragraph
    },
  });

  return (
    <CustomSelect
      value={currentHeadingValue as string}
      options={headings}
      showClearIcon={false}
      buttonVariant="icon_bordered"
      tooltip="Heading Level"
      buttonStyle={{ width: "6rem" }}
      onChange={(value) => {
        if (value === "0") {
          editor?.chain().focus().setParagraph().run();
        } else {
          editor
            ?.chain()
            .focus()
            .toggleHeading({ level: Number(value) as Level })
            .run();
        }
      }}
    />
  );
};

export default HeadingLevelButton;
