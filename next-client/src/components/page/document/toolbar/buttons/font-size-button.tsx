import { CustomSelect } from "@/components/ui/select";
import { useCurrentEditor, useEditorState } from "@tiptap/react";
import React from "react";

const FontSizeButton = () => {
  const { editor } = useCurrentEditor();

  const fontSizes = [
    { label: "8 pt", value: "8pt" },
    { label: "10 pt", value: "10pt" },
    { label: "12 pt", value: "12pt" },
    { label: "14 pt", value: "14pt" },
    { label: "16 pt", value: "16pt" },
    { label: "18 pt", value: "18pt" },
    { label: "24 pt", value: "24pt" },
    { label: "32 pt", value: "32pt" },
    { label: "48 pt", value: "48pt" },
  ];

  const currentSize = useEditorState({
    editor,
    selector: ({ editor }) => {
      return (
        fontSizes.find((size) =>
          editor?.isActive("textStyle", { fontSize: size.value })
        )?.value || "12pt"
      );
    },
  });

  return (
    <CustomSelect
      value={currentSize as string}
      options={fontSizes}
      showClearIcon={false}
      showDisplayText={true}
      showChevronIcon={true}
      tooltip="Font Size"
      buttonVariant="icon_bordered"
      style={{ width: "fit-content" }}
      buttonStyle={{ width: "5rem" }}
      onChange={(value) => {
        editor
          ?.chain()
          .focus()
          .setFontSize(value as string)
          .run();
      }}
    />
  );
};

export default FontSizeButton;
