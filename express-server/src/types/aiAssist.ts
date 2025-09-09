// Text enhancer
interface ToneOptions {
  tone: 'Academic' | 'Casual' | 'Bold' | 'Professional';
}

interface TranslateOptions {
  language: 'Arabic' | 'Hindi' | 'Malay' | 'Italian' | 'Spanish' | 'French' | 'English' | 'German' | 'Chinese' | 'Japanese' | 'Russian' | 'Portuguese' | 'Dutch' | 'Swedish' | 'Turkish' | 'Korean';
}

interface TuneOptions {
  type: 'paraphrase' | 'summarize' | 'make_longer' | 'make_shorter' | 'generate_outline' | 'grammar_check';
}

interface CustomOptions {
  prompt: string;
}

type EnhanceOptions = ToneOptions | TranslateOptions | TuneOptions | CustomOptions;

// Define request body type
interface EnhanceTextRequest {
  text: string;
  action: 'tone' | 'translate' | 'tune' | 'custom';
  options?: EnhanceOptions;
}