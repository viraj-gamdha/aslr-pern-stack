import { JSONContent } from "@/types/document";

export function getAiEnhancerPrompt(
  action: EnhanceTextRequest["action"],
  options: EnhanceOptions | undefined,
  text: string
): string {
  switch (action) {
    case "tone":
      if (options && "tone" in options) {
        return `Rewrite this literature review text in a ${options.tone} tone: ${text}`;
      }
      throw new Error("Invalid tone options");
    case "translate":
      if (options && "language" in options) {
        return `Translate this literature review text to ${options.language}: ${text}`;
      }
      throw new Error("Invalid translate options");
    case "tune":
      if (options && "type" in options) {
        switch (options.type) {
          case "paraphrase":
            return `Paraphrase this literature review text: ${text}`;
          case "summarize":
            return `Summarize this literature review text concisely: ${text}`;
          case "make_longer":
            return `Expand this literature review text with more details: ${text}`;
          case "make_shorter":
            return `Shorten this literature review text while keeping key points: ${text}`;
          case "generate_outline":
            return `Generate an outline for this literature review text: ${text}`;
          case "grammar_check":
            return `Correct grammar and improve clarity in this literature review text: ${text}`;
          default:
            throw new Error("Invalid tune type");
        }
      }
      throw new Error("Invalid tune options");
    case "custom":
      if (options && "prompt" in options) {
        return `${options.prompt} for this literature review text: ${text}`;
      }
      throw new Error("Invalid custom options");
    default:
      throw new Error("Invalid action");
  }
}

export function extractPlainTextFromTiptap(content: JSONContent): string {
  if (!content || !Array.isArray(content.content)) return "";

  const extractText = (node: JSONContent): string => {
    let text = "";

    if (node.type === "text" && node.text) {
      text += node.text;
    }

    if (Array.isArray(node.content)) {
      for (const child of node.content) {
        text += " " + extractText(child);
      }
    }

    return text.trim();
  };

  return content.content.map(extractText).join(" ").trim();
}

export function validateEnhanceOptions(
  action: EnhanceTextRequest["action"],
  options: EnhanceOptions | undefined
): boolean {
  if (!options) return false;

  switch (action) {
    case "tone":
      return (
        "tone" in options &&
        ["Academic", "Casual", "Bold", "Professional"].includes(
          (options as ToneOptions).tone
        )
      );

    case "translate":
      return (
        "language" in options &&
        [
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
        ].includes((options as TranslateOptions).language)
      );

    case "tune":
      return (
        "type" in options &&
        [
          "paraphrase",
          "summarize",
          "make_longer",
          "make_shorter",
          "generate_outline",
          "grammar_check",
        ].includes((options as TuneOptions).type)
      );

    // Pending for now
    case "custom":
      return (
        "prompt" in options &&
        typeof (options as CustomOptions).prompt === "string"
      );

    default:
      return false;
  }
}
