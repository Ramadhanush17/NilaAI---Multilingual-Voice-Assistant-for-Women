import { LanguageKey } from '../types';

/**
 * Detects whether the input transcript strongly matches another supported language.
 * Only returns a language if there is high confidence, preventing false triggers
 * for single foreign loanwords or numbers.
 */
export function detectLanguage(text: string, currentLang: LanguageKey): LanguageKey | null {
  if (!text || text.trim().length < 3) return null;

  const trimmed = text.trim();

  // 1. Script-based character count checks (highest fidelity)
  // Tamil Unicode Block: U+0B80 - U+0BFF
  const tamilChars = (trimmed.match(/[\u0B80-\u0BFF]/g) || []).length;
  // Devanagari (Hindi) Unicode Block: U+0900 - U+097F
  const hindiChars = (trimmed.match(/[\u0900-\u097F]/g) || []).length;
  // Telugu Unicode Block: U+0C00 - U+0C7F
  const teluguChars = (trimmed.match(/[\u0C00-\u0C7F]/g) || []).length;
  // Latin / English characters
  const latinChars = (trimmed.match(/[a-zA-Z]/g) || []).length;

  const totalChars = trimmed.replace(/\s+/g, '').length;
  if (totalChars === 0) return null;

  // If a distinct Indic script has 3+ characters and forms a significant portion
  if (tamilChars >= 3 && tamilChars / totalChars > 0.3) {
    return currentLang !== 'tamil' ? 'tamil' : null;
  }
  if (hindiChars >= 3 && hindiChars / totalChars > 0.3) {
    return currentLang !== 'hindi' ? 'hindi' : null;
  }
  if (teluguChars >= 3 && teluguChars / totalChars > 0.3) {
    return currentLang !== 'telugu' ? 'telugu' : null;
  }

  // 2. Keyword/phrase indicators in Romanized or script text
  const lower = trimmed.toLowerCase();

  const hindiPatterns = [
    /\bmujhe\b/,
    /\bsarkari\b/,
    /\bsahayata\b/,
    /\byojana\b/,
    /\bchahiye\b/,
    /\bmeri umar\b/,
    /\bkripya\b/,
    /\bmadad\b/,
    /\bnamaste\b/,
  ];

  const tamilPatterns = [
    /\benakku\b/,
    /\barasu\b/,
    /\budhavi\b/,
    /\bthittam\b/,
    /\bvendum\b/,
    /\bvanakkam\b/,
    /\bvayathu\b/,
    /\bnandri\b/,
  ];

  const teluguPatterns = [
    /\bnaaku\b/,
    /\bprabhutva\b/,
    /\bsahayam\b/,
    /\bpathakam\b/,
    /\bkaavali\b/,
    /\bnamaskaram\b/,
    /\bvayassu\b/,
    /\bdhanyavadalu\b/,
  ];

  const englishPatterns = [
    /\bi need government assistance\b/,
    /\bi want government help\b/,
    /\bgovernment scheme\b/,
    /\bmy age is\b/,
    /\bannual income\b/,
    /\bi live in\b/,
  ];

  const hindiMatches = hindiPatterns.filter((p) => p.test(lower)).length;
  const tamilMatches = tamilPatterns.filter((p) => p.test(lower)).length;
  const teluguMatches = teluguPatterns.filter((p) => p.test(lower)).length;
  const englishMatches = englishPatterns.filter((p) => p.test(lower)).length;

  if (hindiMatches >= 2 && currentLang !== 'hindi') return 'hindi';
  if (tamilMatches >= 2 && currentLang !== 'tamil') return 'tamil';
  if (teluguMatches >= 2 && currentLang !== 'telugu') return 'telugu';
  if (englishMatches >= 1 && latinChars >= 12 && currentLang !== 'english') return 'english';

  return null;
}
