import { CustomSelect } from "@/components/ui/select";
import { useCurrentEditor, useEditorState } from "@tiptap/react";
import React from "react";

const FontFamilyButton = () => {
  const { editor } = useCurrentEditor();
  const fonts = [
    { label: "Arial", value: "Arial", optionStyle: { fontFamily: "Arial" } },
    {
      label: "Times New Roman",
      value: "Times New Roman",
      optionStyle: { fontFamily: "Times New Roman" },
    },
    {
      label: "Couries New",
      value: "Courier New",
      optionStyle: { fontFamily: "Courier New" },
    },
    {
      label: "Georgia",
      value: "Georgia",
      optionStyle: { fontFamily: "Georgia" },
    },
    {
      label: "Verdana",
      value: "Verdana",
      optionStyle: { fontFamily: "Verdana" },
    },
  ];

  const currentValue: string = useEditorState({
    editor,
    selector: ({ editor }) => {
      return editor?.getAttributes("textStyle")?.fontFamily || "Arial";
    },
  });
  
  return (
    <CustomSelect
      value={currentValue}
      options={fonts}
      showClearIcon={false}
      buttonVariant="icon_bordered"
      tooltip="Font Family"
      position="bottom"
      align="start"
      buttonStyle={{ width: "6rem", fontFamily: currentValue || "Arial" }}
      onChange={(value) =>
        editor
          ?.chain()
          .focus()
          .setFontFamily(value as string)
          .run()
      }
    />
  );
};

export default FontFamilyButton;
