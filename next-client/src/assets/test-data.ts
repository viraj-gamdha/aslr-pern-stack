export const tocContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Getting Started" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Welcome to the demo editor with Table of Contents. Below are some sections.",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Installation" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Run npm install or yarn add to get started.",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Usage" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Import the editor and start writing. The Table of Contents will update automatically.",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Basic Example" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "This is a nested heading example. Notice how it indents in the ToC.",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Conclusion" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "That’s all! You now have a working ToC component.",
        },
      ],
    },
  ],
}
