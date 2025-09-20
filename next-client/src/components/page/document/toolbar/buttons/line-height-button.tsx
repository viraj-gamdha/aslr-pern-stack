import { Button } from "@/components/ui/button";
import {
  DropDown,
  DropDownMenu,
  DropDownTrigger,
} from "@/components/ui/dropdown";
import { SelectButton } from "@/components/ui/select";
import { useCurrentEditor, useEditorState } from "@tiptap/react";
import { AlignVerticalSpaceAroundIcon } from "lucide-react";
import React from "react";

export const lineHeights = [
  { label: "1", value: "1.0" },
  { label: "1.15", value: "1.15" },
  { label: "1.5", value: "1.5" },
  { label: "1.75", value: "1.75" },
  { label: "2", value: "2.0" },
  { label: "2.5", value: "2.5" },
  { label: "3", value: "3.0" },
  { label: "3.5", value: "3.5" },
];

const LineHeightButton = () => {
  const { editor } = useCurrentEditor();

  const currentHeight = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) return "1.5";

      return (
        lineHeights.find((lh) =>
          editor.isActive("lineHeight", { lineHeight: lh.value })
        )?.value || "1.5"
      );
    },
  });

  return (
    <DropDown>
      <DropDownTrigger asChild>
        <SelectButton
          buttonVariant="icon_bordered"
          showChevron={false}
          buttonStyle={{ width: "4rem", justifyContent: "space-between" }}
          tooltip="Line Height"
        >
          <span>
            <AlignVerticalSpaceAroundIcon size={16} />
          </span>
          <span>
            {lineHeights.find((i) => i.value === currentHeight)?.label}
          </span>
        </SelectButton>
      </DropDownTrigger>

      <DropDownMenu
        style={{
          padding: "0.25rem",
          display: "flex",
          flexDirection: "row",
          gap: "0.25rem",
          alignItems: "center",
        }}
      >
        {lineHeights.map((i) => {
          return (
            <Button
              variant="icon"
              key={i.value}
              onClick={() => {
                editor?.chain().focus().setLineHeight(i.value).run();
              }}
              isActive={currentHeight === i.value}
              style={{ justifyContent: "center" }}
            >
              {i.label}
            </Button>
          );
        })}
      </DropDownMenu>
    </DropDown>
  );
};
export default LineHeightButton;
