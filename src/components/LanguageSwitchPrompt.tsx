import React from 'react';
import { Globe, AlertCircle, Check, X } from 'lucide-react';
import { LanguageKey } from '../types';
import { LANGUAGES } from '../constants/languages';

interface LanguageSwitchPromptProps {
  currentLanguage: LanguageKey;
  detectedLanguage: LanguageKey;
  onConfirmSwitch: () => void;
  onDismiss: () => void;
}

export const LanguageSwitchPrompt: React.FC<LanguageSwitchPromptProps> = ({
  currentLanguage,
  detectedLanguage,
  onConfirmSwitch,
  onDismiss,
}) => {
  const currentConfig = LANGUAGES[currentLanguage] || LANGUAGES.english;
  const detectedConfig = LANGUAGES[detectedLanguage] || LANGUAGES.hindi;

  // Question in current language asking if they want to switch
  const question = currentConfig.switchQuestion(detectedConfig.nativeName);

  return (
    <div className="fixed inset-x-4 top-20 z-50 mx-auto max-w-lg animate-in fade-in slide-in-from-top-4 duration-200">
      <div className="rounded-2xl border-2 border-[#FFD60A] bg-[#161616] p-5 shadow-2xl shadow-black/80 ring-4 ring-[#FFD60A]/10">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1C1A0F] text-[#FFD60A] border border-[#FFD60A]/30">
            <Globe className="h-5 w-5" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FFD60A]">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Language Switch Detected</span>
            </div>

            <p className="mt-1 text-sm font-bold text-white leading-snug">
              {question}
            </p>

            <p className="mt-1 text-xs text-[#A1A1A1]">
              Detected: <span className="font-semibold text-[#FFD60A]">{detectedConfig.nativeName} ({detectedConfig.name})</span>
            </p>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={onConfirmSwitch}
                className="flex items-center gap-1.5 rounded-xl bg-[#FFD60A] px-4 py-2 text-xs font-extrabold text-black shadow-sm hover:bg-[#FFE047] active:scale-95 transition"
              >
                <Check className="h-4 w-4 stroke-[3]" />
                <span>{currentConfig.switchYes}</span>
              </button>

              <button
                type="button"
                onClick={onDismiss}
                className="flex items-center gap-1.5 rounded-xl border border-[#FFD60A]/40 bg-transparent px-4 py-2 text-xs font-bold text-[#FFD60A] hover:bg-[#FFD60A] hover:text-black active:scale-95 transition"
              >
                <X className="h-4 w-4" />
                <span>{currentConfig.switchNo}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
