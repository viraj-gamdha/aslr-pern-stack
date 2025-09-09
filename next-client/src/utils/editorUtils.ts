import { Editor, JSONContent } from "@tiptap/core";
import { EditorState } from "prosemirror-state";

export function resetEditorContent(editor: Editor, newContent: JSONContent) {
  editor.commands.setContent(newContent, { emitUpdate: false });

  // The following code clears the history. Hopefully without side effects.
  const newEditorState = EditorState.create({
    doc: editor.state.doc,
    plugins: editor.state.plugins,
    schema: editor.state.schema,
  });
  editor.view.updateState(newEditorState);
}
