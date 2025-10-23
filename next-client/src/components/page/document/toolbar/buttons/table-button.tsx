import { Button } from "@/components/ui/button";
import {
  DropDown,
  DropDownMenu,
  DropDownTrigger,
} from "@/components/ui/dropdown";
import { SelectButton } from "@/components/ui/select";
import { useCurrentEditor, useEditorState } from "@tiptap/react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Columns2Icon,
  Minus,
  Plus,
  Rows,
  Table,
  TableCellsMerge,
  TableCellsSplit,
} from "lucide-react";
import React, { useState } from "react";

const TableButton = () => {
  const { editor } = useCurrentEditor();

  //   common style prop
  const menuWrapperStyle = { padding: "0.25rem", gap: "0.25rem" };

  // Check if cursor is in a table
  // const isInTable = useEditorState({
  //   editor,
  //   selector: ({ editor }) => {
  //     return editor?.isActive("table") ?? false;
  //   },
  // });

  //  dd external state
  const [isOpen, setIsOpen] = useState(false);

  const insertTable = ({ rows, cols }: { rows: number; cols: number }) => {
    editor
      ?.chain()
      .focus()
      .insertTable({
        rows,
        cols,
        withHeaderRow: true,
      })
      .run();
    setIsOpen(false);
  };

  const deleteTable = () => {
    editor?.chain().focus().deleteTable().run();
    setIsOpen(false);
  };

  // Column operations
  const addColumnBefore = () => {
    editor?.chain().focus().addColumnBefore().run();
    setIsOpen(false);
  };

  const addColumnAfter = () => {
    editor?.chain().focus().addColumnAfter().run();
    setIsOpen(false);
  };

  const deleteColumn = () => {
    editor?.chain().focus().deleteColumn().run();
    setIsOpen(false);
  };

  // Row operations
  const addRowBefore = () => {
    editor?.chain().focus().addRowBefore().run();
    setIsOpen(false);
  };

  const addRowAfter = () => {
    editor?.chain().focus().addRowAfter().run();
    setIsOpen(false);
  };

  const deleteRow = () => {
    editor?.chain().focus().deleteRow().run();
    setIsOpen(false);
  };

  // Cell operations
  const mergeCells = () => {
    editor?.chain().focus().mergeCells().run();
    setIsOpen(false);
  };

  const splitCell = () => {
    editor?.chain().focus().splitCell().run();
    setIsOpen(false);
  };

  const toggleHeaderColumn = () => {
    editor?.chain().focus().toggleHeaderColumn().run();
    setIsOpen(false);
  };

  const toggleHeaderRow = () => {
    editor?.chain().focus().toggleHeaderRow().run();
    setIsOpen(false);
  };

  return (
    <DropDown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropDownTrigger asChild>
        <SelectButton tooltip="Table" showChevron={false}>
          <span>
            <Table size={18} />
          </span>
        </SelectButton>
      </DropDownTrigger>
      <DropDownMenu style={{ width: "9rem", ...menuWrapperStyle }}>
        <span
          style={{
            fontFamily: "var(--font-1)",
            color: "var(--color-text-l)",
            fontSize: "0.8rem",
            padding: "0.25rem",
          }}
        >
          Insert Table
        </span>
        <Button
          variant="icon"
          onClick={() => insertTable({ rows: 1, cols: 1 })}
        >
          1 × 1
        </Button>
        <Button
          variant="icon"
          onClick={() => insertTable({ rows: 2, cols: 2 })}
        >
          2 × 2
        </Button>
        <Button
          variant="icon"
          onClick={() => insertTable({ rows: 3, cols: 3 })}
        >
          3 × 3
        </Button>

        <div className="hr-line" />

        {/* Table management */}
        <span
          style={{
            fontFamily: "var(--font-1)",
            color: "var(--color-text-l)",
            fontSize: "0.8rem",
            padding: "0.25rem",
          }}
        >
          Manage Table
        </span>
        {/* Column Operations */}
        <DropDown position="right" align="end" style={{ width: "100%" }} offset={14}>
          <DropDownTrigger asChild>
            <SelectButton buttonVariant="icon" isSubmenu={true}>
              <span>
                <Columns2Icon size={18} />
              </span>
              Column
            </SelectButton>
          </DropDownTrigger>
          <DropDownMenu style={menuWrapperStyle}>
            <Button variant="icon" onClick={addColumnBefore}>
              <span>
                <ArrowLeft size={18} />
              </span>
              Add Before
            </Button>
            <Button variant="icon" onClick={addColumnAfter}>
              <span>
                <ArrowRight size={18} />
              </span>
              Add After
            </Button>
            <Button
              variant="icon"
              onClick={deleteColumn}
              style={{ color: "var(--color-red)" }}
            >
              <Minus size={18} />
              Delete
            </Button>
            <div className="hr-line" />
            <Button variant="icon" onClick={toggleHeaderColumn}>
              Toggle Header
            </Button>
          </DropDownMenu>
        </DropDown>

        {/* Row Operations */}
        <DropDown position="right" align="start" style={{ width: "100%" }}>
          <DropDownTrigger asChild>
            <SelectButton buttonVariant="icon" isSubmenu={true}>
              <span>
                <Rows size={18} />
              </span>
              Row
            </SelectButton>
          </DropDownTrigger>
          <DropDownMenu style={menuWrapperStyle}>
            <Button
              variant="icon"
              onClick={addRowBefore}
              title="Add row before current"
            >
              <span>
                <ArrowUp size={18} />
              </span>
              Add Before
            </Button>
            <Button
              variant="icon"
              onClick={addRowAfter}
              title="Add row after current"
            >
              <span>
                <ArrowDown size={18} />
              </span>
              Add After
            </Button>
            <Button
              variant="icon"
              onClick={deleteRow}
              title="Delete current row"
              style={{ color: "var(--color-red)" }}
            >
              <span>
                <Minus size={18} />
              </span>
              Delete
            </Button>
            <div className="hr-line" />
            <Button
              variant="icon"
              onClick={toggleHeaderRow}
              title="Toggle header row"
            >
              Toggle Header
            </Button>
          </DropDownMenu>
        </DropDown>

        {/* Cell Operations */}
        <DropDown position="right" align="start" style={{ width: "100%" }}>
          <DropDownTrigger asChild>
            <SelectButton buttonVariant="icon" isSubmenu={true}>
              <span>
                <Plus size={18} />
              </span>
              Cell
            </SelectButton>
          </DropDownTrigger>
          <DropDownMenu style={menuWrapperStyle}>
            <Button variant="icon" onClick={mergeCells}>
              <span>
                <TableCellsMerge size={18} />
              </span>
              Merge Cells
            </Button>
            <Button variant="icon" onClick={splitCell}>
              <span>
                <TableCellsSplit size={18} />
              </span>
              Split Cell
            </Button>
          </DropDownMenu>
        </DropDown>

        <div className="hr-line" />

        {/* Delete Table */}
        <Button
          variant="icon"
          onClick={deleteTable}
          style={{ color: "var(--color-red)" }}
        >
          <span>
            <Minus size={18} />
          </span>
          Delete Table
        </Button>
      </DropDownMenu>
    </DropDown>
  );
};

export default TableButton;
