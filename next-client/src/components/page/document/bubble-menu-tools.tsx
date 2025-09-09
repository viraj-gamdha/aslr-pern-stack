import { useCurrentEditor, useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import s from "./bubble-menu-tools.module.scss";
import { useEnhanceTextMutation } from "@/redux/apis/documentApiSlice";
import { EnhanceOptions, EnhanceTextActions } from "@/types/aiAssist";
import { CSSProperties, useEffect, useState } from "react";
import {
  DropDown,
  DropDownMenu,
  DropDownTrigger,
} from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import { Modal, ModalContent, ModalHeader } from "@/components/ui/modal";
import {
  LanguagesIcon,
  MessageCircleMore,
  Mic2,
  StarsIcon,
  Text,
} from "lucide-react";
import { SkeletonLoader } from "@/components/ui/loader";
import { useParams } from "next/navigation";
import { errorToast } from "@/components/ui/toast";

const BubbleMenuTools = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { editor } = useCurrentEditor();

  const [ddTone, setDdTone] = useState(false);
  const [ddTranslate, setDdTranslate] = useState(false);
  const [ddTune, setDdTune] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [enhancedText, setEnhancedText] = useState("");

  const [enhanceText, { isLoading }] = useEnhanceTextMutation();

  const closeAllDropdowns = () => {
    setDdTone(false);
    setDdTranslate(false);
    setDdTune(false);
  };

  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) return { from: 0, to: 0, words: 0, selectedText: "" };

      const { from, to } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to, " ").trim();
      const wordCount = selectedText.split(/\s+/).filter(Boolean).length;

      return { from, to, words: wordCount, selectedText };
    },
  });

  const handleEnhance = async (action: string, options?: EnhanceOptions) => {
    if (!editor || (editorState?.words && editorState?.words < 3)) {
      errorToast("Please select minimum 3 words to proceed");
      return;
    }

    closeAllDropdowns();
    setShowModal(true);

    try {
      const res = await enhanceText({
        projectId,
        text: editorState?.selectedText || "",
        action,
        options,
      }).unwrap();

      if (res.success) {
        setEnhancedText(
          res.data || "Error while processing your request, please try again"
        );
      }
    } catch (error) {
      setEnhancedText("Error while processing your request, please try again");
    }
  };

  const applyEnhancedText = () => {
    if (!editor || !editorState) return;

    const { from, to } = editorState;

    editor
      .chain()
      .focus()
      .deleteRange({ from, to })
      .insertContent(enhancedText)
      .run();

    setShowModal(false);
    setEnhancedText("");
  };

  const ddMenuStyle: CSSProperties = {
    padding: "0.25rem",
    gap: "0.25rem",
    maxHeight: "10rem",
    overflowY: "auto",
  };

  // Safe returns
  if (
    !editor ||
    (editorState?.words &&
      (editorState.words < 3 ||
        editorState.words > 200 ||
        editorState.selectedText.length > 1600))
  ) {
    return null;
  }

  return (
    <>
      <BubbleMenu editor={editor} options={{ placement: "bottom", offset: 8 }}>
        <div className={s.container}>
          <span>
            <StarsIcon size={18} />
            Ai Enhance
          </span>

          <div className={s.wrapper}>
            {/* Translate */}
            <DropDown isOpen={ddTranslate} setIsOpen={setDdTranslate}>
              <DropDownTrigger asChild>
                <Button variant="icon_bordered">
                  <span>
                    <LanguagesIcon size={18} />
                  </span>
                  Translate
                </Button>
              </DropDownTrigger>
              <DropDownMenu style={ddMenuStyle}>
                {[
                  "Arabic",
                  "Hindi",
                  "Malay",
                  "Italian",
                  "Spanish",
                  "French",
                  "English",
                  "German",
                  "Chinese",
                  "Japanese",
                  "Russian",
                  "Portuguese",
                  "Dutch",
                  "Swedish",
                  "Turkish",
                  "Korean",
                ].map((language) => (
                  <Button
                    key={language}
                    variant="icon"
                    onClick={() => handleEnhance("translate", { language })}
                    disabled={isLoading}
                  >
                    {language}
                  </Button>
                ))}
              </DropDownMenu>
            </DropDown>

            {/* Tune */}
            <DropDown isOpen={ddTune} setIsOpen={setDdTune}>
              <DropDownTrigger asChild>
                <Button variant="icon_bordered">
                  <span>
                    <Text size={18} />
                  </span>
                  Tune Text
                </Button>
              </DropDownTrigger>
              <DropDownMenu style={ddMenuStyle}>
                {[
                  "Paraphrase",
                  "Summarize",
                  "Make Longer",
                  "Make Shorter",
                  "Generate Outline",
                  "Grammar Check",
                ].map((type) => (
                  <Button
                    key={type}
                    variant="icon"
                    onClick={() =>
                      handleEnhance("tune", {
                        type: type.toLowerCase().replace(/ /g, "_"),
                      })
                    }
                    disabled={isLoading}
                  >
                    {type}
                  </Button>
                ))}
              </DropDownMenu>
            </DropDown>

            {/* Tone */}
            <DropDown isOpen={ddTone} setIsOpen={setDdTone}>
              <DropDownTrigger asChild>
                <Button variant="icon_bordered">
                  <span>
                    <Mic2 size={18} />
                  </span>
                  Text Tone
                </Button>
              </DropDownTrigger>
              <DropDownMenu style={ddMenuStyle}>
                {["Academic", "Casual", "Bold", "Professional"].map((tone) => (
                  <Button
                    key={tone}
                    variant="icon"
                    onClick={() => handleEnhance("tone", { tone })}
                    disabled={isLoading}
                  >
                    {tone}
                  </Button>
                ))}
              </DropDownMenu>
            </DropDown>
          </div>
        </div>
      </BubbleMenu>
      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ModalHeader showCloseButton={false}>
          <span>
            <StarsIcon size={18} /> AI Enhanced Text
          </span>
        </ModalHeader>
        <ModalContent>
          {isLoading ? (
            <SkeletonLoader style={{ width: "100%", height: "5rem" }} />
          ) : (
            <p style={{ width: "100%" }}>{enhancedText}</p>
          )}

          <div className="modal-action-btns">
            <Button variant="bordered" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={applyEnhancedText}>
              Apply
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BubbleMenuTools;
