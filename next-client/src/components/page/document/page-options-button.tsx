import { Button } from "@/components/ui/button";
import {
  DropDown,
  DropDownMenu,
  DropDownTrigger,
} from "@/components/ui/dropdown";
import { FormInput } from "@/components/ui/form-input";
import Tooltip from "@/components/ui/tooltip";
import { PanelLeftRightDashedIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { PageOptions, pageOptionsSchema } from "./extensions/pageOptions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditorStore } from "@/stores/useEditorStore";
import { useCurrentEditor } from "@tiptap/react";

const PageOptionsButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { editor } = useCurrentEditor();

  // reactive state (current values)
  const { pageOptions } = useEditorStore();
  const form = useForm<PageOptions>({
    resolver: zodResolver(pageOptionsSchema),
    defaultValues: {
      margins: pageOptions.margins,
    },
  });

  // A helper function to update options and call the editor command.
  const onSubmit = (newValues: PageOptions) => {
    const newOptions = { ...pageOptions, ...newValues };
    // Call the custom command to update the editor's state and apply the styles.
    editor?.commands.setPageOptions(newOptions);
  };

  return (
    <DropDown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropDownTrigger asChild>
        <Tooltip
          tooltip="Page Options"
          style={{ display: isOpen ? "none" : undefined }}
        >
          <Button variant="icon_bordered" isActive={isOpen}>
            <span>
              <PanelLeftRightDashedIcon size={18} />
            </span>
          </Button>
        </Tooltip>
      </DropDownTrigger>
      <DropDownMenu style={{ padding: "1rem" }}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 8rem)",
              gap: "0.5rem",
            }}
          >
            <FormInput
              form={form}
              id="margins.top"
              label="Top margin"
              type="number"
            />
            <FormInput
              form={form}
              id="margins.right"
              label="Right margin"
              type="number"
            />
            <FormInput
              form={form}
              id="margins.bottom"
              label="Bottom margin"
              type="number"
            />
            <FormInput
              form={form}
              id="margins.left"
              label="Left margin"
              type="number"
            />
          </div>

          <Button
            variant="primary_sm"
            style={{ marginTop: "1rem", marginLeft: "auto" }}
          >
            Update
          </Button>
        </form>
      </DropDownMenu>
    </DropDown>
  );
};

export default PageOptionsButton;
