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
};

export const references = [
  {
    id: "ref1",
    name: "Smith, J.",
    reference:
      "Understanding Typography in Digital Media. Journal of Design Studies, 2020.",
  },
  {
    id: "ref2",
    name: "Chen, L. & Kumar, R.",
    reference:
      "The Impact of Margins on Readability. International Conference on UX Research, 2019.",
  },
  {
    id: "ref3",
    name: "W3C",
    reference:
      "CSS Paged Media Module Level 3. Retrieved from https://www.w3.org/TR/css-page-3/",
  },
  {
    id: "ref4",
    name: "Doe, A.",
    reference:
      "Designing for Print: A Practical Guide. PrintWorks Publishing, 2018.",
  },
  {
    id: "ref5",
    name: "OpenAI",
    reference:
      "Generative Models and Their Applications. Technical Report, 2021.",
  },
];
