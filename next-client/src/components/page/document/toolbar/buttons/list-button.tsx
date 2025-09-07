import { CustomSelect } from "@/components/ui/select";
import { useCurrentEditor, useEditorState } from "@tiptap/react";
import { ListIcon, ListOrderedIcon } from "lucide-react";
import React from "react";

const ListButton = () => {
  const { editor } = useCurrentEditor();
  const lists = [
    {
      label: "Bullet List",
      value: "bulletList",
      icon: ListIcon,
    },
    {
      label: "Ordered List",
      value: "orderedList",
      icon: ListOrderedIcon,
    },
  ];

  // active list
  const currentValue = useEditorState({
    editor,
    selector: ({ editor }) => {
      return (
        lists.find((i) => editor?.isActive(i.value))?.value || "bulletList"
      );
    },
  });

  return (
    <CustomSelect
      value={currentValue as string}
      options={lists}
      showClearIcon={false}
      showDisplayText={false}
      showChevronIcon={false}
      tooltip="List"
      buttonVariant="icon_bordered"
      style={{ width: "fit-content" }}
      onChange={(value) => {
        value === "bulletList"
          ? editor?.chain().focus().toggleBulletList().run()
          : editor?.chain().focus().toggleOrderedList().run();
      }}
    />
  );
};

export default ListButton;
