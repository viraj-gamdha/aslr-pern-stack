"use client";

import { useGetUserProjectByIdQuery } from "@/redux/apis/projectApiSlice";
import s from "./document.module.scss";
import { useParams } from "next/navigation";
import Tooltip from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  DownloadIcon,
  File,
  History,
  Redo2Icon,
  SaveIcon,
  TableConfigIcon,
  Undo2Icon,
} from "lucide-react";
import { SkeletonLoader } from "@/components/ui/loader";
import Editor from "@/components/page/document/editor";
import Toolbar from "@/components/page/document/toolbar/toolbar";
import { useCurrentEditor, useEditorState } from "@tiptap/react";
import { useEditorStore } from "@/stores/useEditorStore";
import { useUpdateDocumentMutation } from "@/redux/apis/documentApiSlice";
import { errorToast, successToast } from "@/components/ui/toast";
import { parseError } from "@/utils/helpers";
import { useAppSelector } from "@/hooks/storeHooks";
import ExportPDFButton from "@/components/page/document/export-button";
import { printTiptapContent } from "@/utils/handlePrint";
// import { printTiptapContent } from "@/utils/handleExport";

const Document = () => {
  // tiptap provided state
  const { editor } = useCurrentEditor();
  const { projectId } = useParams<{ projectId: string }>();
  const { data: projectData, isLoading: loadingProjectData } =
    useGetUserProjectByIdQuery(projectId);

  const characterStats = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) return { characters: 0, words: 0 };

      const count = editor.storage.characterCount;
      return {
        characters: count.characters(),
        words: count.words(),
      };
    },
  });

  // zustand store
  const { showToC, setShowToC } = useEditorStore();

  // rtk relates states
  const isEditorDirty = useAppSelector((state) => state.editor.isEditorDirty);
  const [updateDocument, { isLoading: loadingSave }] =
    useUpdateDocumentMutation();

  const handleSaveDoc = async () => {
    if (!editor?.getJSON()) return;
    try {
      const res = await updateDocument({
        projectId,
        content: editor?.getJSON(),
      }).unwrap();
      if (res.success) {
        successToast(res.message);
      }
    } catch (error) {
      errorToast(parseError(error));
    }
  };

  // export

  return (
    <div className="layout-a">
      <header className={s.header}>
        <h4 className="truncate-text" title={projectData?.data.title}>
          {loadingProjectData ? (
            <SkeletonLoader style={{ height: "1.5rem", width: "6rem" }} />
          ) : (
            projectData?.data?.title
          )}
        </h4>

        <div className={s.header_wrapper}>
          <Tooltip tooltip="Table of contents" position="bottom">
            <Button
              variant="icon"
              isActive={showToC}
              onClick={() => setShowToC(!showToC)}
            >
              <span>
                <TableConfigIcon size={18} />
              </span>
            </Button>
          </Tooltip>

          {/* <Tooltip tooltip="View history" position="bottom">
            <Button variant="icon">
              <span>
                <History size={18} />
              </span>
            </Button>
          </Tooltip> */}

          {/* <Tooltip tooltip="View abstract" position="bottom">
            <Button
              variant="icon"
              onClick={() => {}}
            >
              <span>
                <File size={18} />
              </span>
            </Button>
          </Tooltip> */}
          {/* <ExportPDFButton projectId={projectId} editor={editor!} /> */}

          <Tooltip tooltip="Undo" position="bottom">
            <Button
              variant="icon"
              onClick={() => editor?.chain().focus().undo().run()}
            >
              <span>
                <Undo2Icon size={18} />
              </span>
            </Button>
          </Tooltip>

          <Tooltip tooltip="Redo" position="bottom">
            <Button
              variant="icon"
              onClick={() => editor?.chain().focus().redo().run()}
            >
              <span>
                <Redo2Icon size={18} />
              </span>
            </Button>
          </Tooltip>
        </div>

        <div className={s.header_wrapper} style={{ marginLeft: "auto" }}>
          <div className={s.char_counter}>
            <p>
              <span>{characterStats?.characters}</span> chars
            </p>
            <p>
              <span>{characterStats?.words}</span> words
            </p>
          </div>

          <Button
            variant="icon_bordered"
            disabled={!isEditorDirty || loadingSave}
            onClick={handleSaveDoc}
          >
            <span>
              <SaveIcon size={18} />
            </span>
            Save
          </Button>

          {editor && (
            <Button
              variant="icon_bordered"
              onClick={() => printTiptapContent(editor)}
            >
              <span>
                <DownloadIcon size={18} />
              </span>
              Export
            </Button>
          )}
        </div>
      </header>
      <Toolbar />

      <div className="layout-content-wrapper">
        <section className={s.content}>
          <Editor />
        </section>
      </div>
    </div>
  );
};

export default Document;
