import { JSONContent } from "@tiptap/react";

export type DocumentType = {
  id?: string;
  projectId: string;
  content: JSONContent;
  createdAt: Date;
  updatedAt: Date;
};
