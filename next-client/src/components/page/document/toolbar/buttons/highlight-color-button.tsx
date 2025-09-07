import {
  DropDown,
  DropDownTrigger,
  DropDownMenu,
} from "@/components/ui/dropdown";
import { SelectButton } from "@/components/ui/select";
import { useCurrentEditor, useEditorState } from "@tiptap/react";
import { HighlighterIcon } from "lucide-react";
import React from "react";
import { CirclePicker, ColorResult } from "react-color";

const HighlightColorButton = () => {
  const { editor } = useCurrentEditor();
  const currentValue: string = useEditorState({
    editor,
    selector: ({ editor }) => {
      return editor?.getAttributes("highlight")?.color || "#4CAF50";
    },
  });

  return (
    <DropDown style={{ width: "fit-content" }}>
      <DropDownTrigger asChild>
        <SelectButton
          showChevron={false}
          buttonVariant="icon_bordered"
          tooltip="Highlight Text"
        >
          <span>
            <HighlighterIcon size={16} />
          </span>
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

      <DropDownMenu>
        <div
          style={{
            width: "fit-content",
            display: "flex",
            alignContent: "center",
            padding: "0.5rem",
          }}
        >
          <CirclePicker
            color={currentValue}
            onChange={(color: ColorResult) =>
              editor?.chain().focus().setHighlight({ color: color.hex }).run()
            }
          />
        </div>
      </DropDownMenu>
    </DropDown>
  );
};

export default HighlightColorButton;
