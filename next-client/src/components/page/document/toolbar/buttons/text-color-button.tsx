import {
  DropDown,
  DropDownTrigger,
  DropDownMenu,
} from "@/components/ui/dropdown";
import { SelectButton } from "@/components/ui/select";
import { useCurrentEditor, useEditorState } from "@tiptap/react";
import React from "react";
import { SketchPicker, ColorResult } from "react-color";

const TextColorButton = () => {
  const { editor } = useCurrentEditor();
  const currentValue: string = useEditorState({
    editor,
    selector: ({ editor }) => {
      return editor?.getAttributes("textStyle")?.color || "#000000";
    },
  });

  return (
    <DropDown>
      <DropDownTrigger asChild>
        <SelectButton
          buttonVariant="icon_bordered"
          showChevron={false}
          tooltip="Text Color"
        >
          <span style={{ fontWeight: 500 }}>A</span>
          <div
            style={{
              height: "0.3rem",
              width: "1rem",
              borderRadius: "2px",
              backgroundColor: currentValue,
            }}
          />
        </SelectButton>
      </DropDownTrigger>

      <DropDownMenu style={{ maxHeight: "fit-content" }}>
        <div style={{ display: "flex", alignContent: "center" }}>
          <SketchPicker
            color={currentValue}
            disableAlpha={true}
            onChange={(color: ColorResult) =>
              editor?.commands.setColor(color.hex)
            }
          />
        </div>
      </DropDownMenu>
    </DropDown>
  );
};

export default TextColorButton;
