"use client";

import { useCurrentEditor, useEditorState } from "@tiptap/react";
import { DragHandle } from "@tiptap/extension-drag-handle-react";
import type { Editor } from "@tiptap/core";
import { DOMSerializer, Node as PMNode } from "@tiptap/pm/model";
import { GripVertical, Plus, Copy, Minus, Equal } from "lucide-react";
import {
  DropDown,
  DropDownTrigger,
  DropDownMenu,
} from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import { useCallback, useMemo, useState } from "react";
import { successToast } from "@/components/ui/toast";

type Hovered = { node: PMNode; pos: number } | null;

export default function DragHandleButton() {
  const { editor } = useCurrentEditor();

  // Track the node currently under the drag handle (from the DragHandle React API)
  const [hovered, setHovered] = useState<Hovered>(null);

  // Use the selector-based hook
  const { isEditable } = useEditorState({
    editor: editor as Editor | null,
    selector: ({ editor }) => ({
      isEditable: !!editor && editor.isEditable,
    }),
  }) ?? { isEditable: false };

  const hasTarget = !!hovered && !!editor;
  const range = useMemo(
    () =>
      hovered
        ? { from: hovered.pos, to: hovered.pos + hovered.node.nodeSize }
        : null,
    [hovered]
  );

  // --- Actions --------------------------------------------------------------

  const duplicateNode = useCallback(() => {
    if (!editor || !hovered) return;
    const insertPos = hovered.pos + hovered.node.nodeSize;
    // Insert a JSON clone of the node directly after itself
    editor
      .chain()
      .focus()
      .insertContentAt(insertPos, hovered.node.toJSON(), {
        // ensure we insert even if it replaces a gap cursor, etc.
        updateSelection: false,
      })
      .run();
  }, [editor, hovered]);

  const copyNodeToClipboard = useCallback(async () => {
    if (!editor || !hovered) return;

    // Build HTML and plain text for the hovered node using ProseMirror’s DOMSerializer
    const serializer = DOMSerializer.fromSchema(editor.schema);
    const dom = serializer.serializeNode(hovered.node);
    const container = document.createElement("div");
    container.appendChild(dom);
    const html = container.innerHTML;
    const text = hovered.node.textBetween(0, hovered.node.content.size, "\n");

    try {
      if ("clipboard" in navigator && "write" in navigator.clipboard) {
        // Write both text/html and text/plain when available
        const item = new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([text], { type: "text/plain" }),
        });
        await (navigator.clipboard).write([item]);
      } else {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      // Fallback: select the node and let the platform handle copy
      if (range) {
        editor.chain().setTextSelection(range).run();
      }
    }
  }, [editor, hovered, range]);

  const deleteNode = useCallback(() => {
    if (!editor || !range) return;
    // Safely remove the node range
    editor.chain().focus().deleteRange(range).run();
  }, [editor, range]);

  // Disable buttons when editor isn’t ready / not editable / nothing hovered
  const disabled = !isEditable || !hasTarget;

  if (!editor) return null;

  return (
    <DragHandle
      editor={editor as Editor}
      // Keep track of whichever block the handle is over
      onNodeChange={({ node, pos }) => {
        setHovered(node ? { node, pos } : null);
      }}
    >
      <DropDown style={{ width: "100%", height: "100%" }}>
        <DropDownTrigger style={{ width: "100%", height: "100%" }}>
          <span className="drag-handle-button">
            <Equal size={16} color="var(--color-text-l)"/>
          </span>
        </DropDownTrigger>

        <DropDownMenu style={{ padding: "0.25rem", gap: "0.25rem" }}>
          <Button variant="icon" onClick={duplicateNode} disabled={disabled}>
            <span>
              <Plus size={18} />
            </span>
            Duplicate
          </Button>

          <Button
            variant="icon"
            onClick={copyNodeToClipboard}
            disabled={!hasTarget}
          >
            <span>
              <Copy size={18} />
            </span>
            Copy to clipboard
          </Button>

          <Button
            variant="icon"
            onClick={deleteNode}
            disabled={disabled}
            style={{ color: "var(--color-red)" }}
          >
            <span>
              <Minus size={18} />
            </span>
            Delete
          </Button>
        </DropDownMenu>
      </DropDown>
    </DragHandle>
  );
}
