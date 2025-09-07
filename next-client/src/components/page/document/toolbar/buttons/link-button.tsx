import { Button } from "@/components/ui/button";
import {
  DropDown,
  DropDownTrigger,
  DropDownMenu,
} from "@/components/ui/dropdown";
import { FormInput } from "@/components/ui/form-input";
import { SelectButton } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCurrentEditor, useEditorState } from "@tiptap/react";
import { Link2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

// Link url for editor...
export const linkSchema = z.object({
  link: z.url({ message: "Enter a valid URL" }),
});

export type LinkFormValues = z.infer<typeof linkSchema>;

const LinkButton = () => {
  const { editor } = useCurrentEditor();
  // externally controlled state
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: { link: "" },
  });
  const { handleSubmit, setValue, reset } = form;

  // getting reactive state from editor
  const currentHref: string | undefined = useEditorState({
    editor,
    selector: ({ editor }) => editor?.getAttributes("link")?.href,
  });

  useEffect(() => {
    if (isOpen && currentHref) {
      setValue("link", currentHref);
    } else {
      reset();
    }
  }, [isOpen, currentHref]);

  const onSubmit = (data: LinkFormValues) => {
    editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: data.link })
      .run();
    reset();
    setIsOpen(false);
  };

  const handleRemove = () => {
    editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    reset();
    setIsOpen(false);
  };

  return (
    <DropDown
      style={{ width: "fit-content" }}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <DropDownTrigger asChild>
        <SelectButton
          showChevron={false}
          buttonVariant="icon_bordered"
          tooltip="Link"
        >
          <span>
            <Link2Icon size={16} />
          </span>
        </SelectButton>
      </DropDownTrigger>

      <DropDownMenu>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            width: "100%",
            padding: "0.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <FormInput
            variant="input"
            form={form}
            id="link"
            showError={true}
            placeholder="https://example.com"
            type="text"
            style={{ maxWidth: "12rem" }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              alignSelf: "flex-end",
            }}
          >
            <Button variant="bordered_sm" type="button" onClick={handleRemove}>
              Remove
            </Button>
            <Button variant="primary_sm" type="submit">
              Apply
            </Button>
          </div>
        </form>
      </DropDownMenu>
    </DropDown>
  );
};

export default LinkButton;
