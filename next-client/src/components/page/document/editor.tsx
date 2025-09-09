import { EditorContent, useCurrentEditor } from "@tiptap/react";
import "./styles/editor.scss";
import s from "./editor.module.scss";
import DragHandleButton from "./drag-handle-button";
import { ToC } from "./table-of-content";
import { useEditorStore } from "@/stores/useEditorStore";
import classNames from "classnames";
import BubbleMenuTools from "./bubble-menu-tools";

const Editor = () => {
  const { editor } = useCurrentEditor();
  const { showToC } = useEditorStore();

  return (
    <div className={s.container}>
      <div className={classNames(s.wrapper)}>
        <DragHandleButton />
        {/* Ai assist via bubble menu */}
        <BubbleMenuTools />
        <EditorContent editor={editor} />
        {showToC && <ToC />}
      </div>
    </div>
  );
};

export default Editor;
