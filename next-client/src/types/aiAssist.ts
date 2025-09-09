// Text enhancer
interface ToneOptions {
  tone: string;
}

interface TranslateOptions {
  language: string;
}

interface TuneOptions {
  type: string;
}

interface CustomOptions {
  prompt: string;
}

export type EnhanceOptions =
  | ToneOptions
  | TranslateOptions
  | TuneOptions
  | CustomOptions;

export type EnhanceTextActions = "tone" | "translate" | "tune" | "custom";

// Define request body type
export type EnhanceTextRequest = {
  text: string;
  action: EnhanceTextActions;
  options?: EnhanceOptions;
};
