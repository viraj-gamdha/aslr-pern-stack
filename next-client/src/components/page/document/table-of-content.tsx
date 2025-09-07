"use client";

import React from "react";
import { useCurrentEditor } from "@tiptap/react";
import type { TableOfContentDataItem } from "@tiptap/extension-table-of-contents";
import s from "./table-of-content.module.scss";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/stores/useEditorStore";

const ToCItem: React.FC<{
  item: TableOfContentDataItem;
  onItemClick: (e: React.MouseEvent, id: string) => void;
}> = ({ item, onItemClick }) => (
  <div
    className={[
      s.item,
      item.isActive && !item.isScrolledOver ? s.item_isActive : "",
      item.isScrolledOver ? s.item_isScrolledOver : "",
    ]
      .filter(Boolean)
      .join(" ")}
    style={{ ["--level" as string]: item.level }}
  >
    <Button
      variant="icon"
      onClick={(e) => onItemClick(e, item.id)}
      data-item-index={item.itemIndex}
      className={s.item_link}
    >
      {item.textContent}
    </Button>
  </div>
);

const ToCEmptyState: React.FC = () => (
  <div className={s.empty_state}>
    <p>Add headings to see the outline.</p>
  </div>
);

export const ToC: React.FC = () => {
  const { editor } = useCurrentEditor();
  const items = useEditorStore((state) => state.tocItems);

  if (!items.length) return <ToCEmptyState />;

  const onItemClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (!editor) return;

    // Use Tiptap's built-in scrollIntoView command
    editor.chain().focus().scrollIntoView().run();

    const element = editor.view.dom.querySelector(
      `[data-toc-id="${id}"]`
    ) as HTMLElement | null;
    if (!element) return;

    // Calculate the position of the element using the editor's state
    const pos = editor.view.posAtDOM(element, 0);

    // Set the selection to that position
    editor.chain().setTextSelection(pos).scrollIntoView().run();
  };

  return (
    <div className={s.sidebar}>
      <div className={s.sidebar_options}>
        <div className={s.label_large}>Table of contents</div>
        <div className={s.table_of_contents}>
          {items.map((item, i) => (
            <ToCItem
              key={item.id}
              item={{ ...item, itemIndex: i + 1 }}
              onItemClick={onItemClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
