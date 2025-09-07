import { Button } from "@/components/ui/button";
import {
  DropDown,
  DropDownTrigger,
  DropDownMenu,
} from "@/components/ui/dropdown";
import { Modal, ModalContent, ModalHeader } from "@/components/ui/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Upload, SearchIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { LinkFormValues, linkSchema } from "./link-button";
import { FormInput } from "@/components/ui/form-input";
import { useCurrentEditor } from "@tiptap/react";
import { SelectButton } from "@/components/ui/select";
import { useUploadFileMutation } from "@/redux/apis/uploadApiSlice";
import { errorToast, loaderToast } from "@/components/ui/toast";
import { parseError } from "@/utils/helpers";

const ImageButton = () => {
  const { editor } = useCurrentEditor();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const form = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: { link: "" },
  });

  const { handleSubmit, reset } = form;
  const [uploadFile, { isLoading }] = useUploadFileMutation();

  const onChange = (src: string) => {
    editor?.chain().focus().setImage({ src }).run();
    reset();
  };

  const onUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadPromise = uploadFile(formData).unwrap();

        loaderToast(
          uploadPromise,
          "Uploading file",
          "Upload complete!",
          "Upload failed!"
        );

        try {
          const res = await uploadPromise;
          if (res.success) {
            onChange(res.data);
            setIsMenuOpen(false)
          }
        } catch (error) {
          errorToast(parseError(error));
        }
      }
    };

    input.click();
  };

  const OnImageUrlSubmit = (data: LinkFormValues) => {
    const imageUrl = data.link;
    if (imageUrl) {
      onChange(imageUrl);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <DropDown
        style={{ width: "fit-content" }}
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
      >
        <DropDownTrigger asChild>
          <SelectButton
            buttonVariant="icon_bordered"
            showChevron={false}
            tooltip="Image"
          >
            <span>
              <ImageIcon size={16} />
            </span>
          </SelectButton>
        </DropDownTrigger>

        <DropDownMenu
          style={{
            padding: "0.25rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button variant="icon" onClick={onUpload} disabled={isLoading}>
            <span>
              <Upload size={16} />
            </span>
            Upload
          </Button>
          <Button
            variant="icon"
            onClick={() => {
              setIsModalOpen(true);
              setIsMenuOpen(false);
            }}
          >
            <span>
              <SearchIcon size={16} />
            </span>
            Insert image url
          </Button>
        </DropDownMenu>
      </DropDown>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalHeader>
            <span>Insert image URL</span>
          </ModalHeader>
          <ModalContent>
            <form onSubmit={handleSubmit(OnImageUrlSubmit)}>
              <FormInput
                variant="input"
                form={form}
                label="Image URL"
                id="link"
                showError={true}
                placeholder="https://example.com"
                type="text"
              />

              <Button type="submit" variant="primary">
                Insert
              </Button>
            </form>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default ImageButton;
