export type LanguageKey = 'tamil' | 'hindi' | 'telugu' | 'english';
export type LanguageCode = 'ta-IN' | 'hi-IN' | 'te-IN' | 'en-IN';

export type AppScreen =
  | 'language_selection'
  | 'language_confirmation'
  | 'chat'
  | 'eligibility_result';

export type SpeechState = 'idle' | 'listening' | 'processing' | 'speaking';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'nila';
  text: string;
  timestamp: string;
  isDemoGreeting?: boolean;
}

export interface CollectedData {
  age: number | null;
  state: string | null;
  income: number | null;
}

export type EligibilityStatus = 'eligible' | 'not_eligible' | 'incomplete';

export interface EligibilityResult {
  status: EligibilityStatus;
  schemeName: string;
  schemeDescription: string;
  statusTitle: string;
  benefit: string;
  requiredDocuments: string[];
  nextSteps: string[];
  disclaimer: string;
  reasons: string[];
}

export interface PendingLanguageSwitch {
  detectedLanguage: LanguageKey;
  detectedText: string;
}
