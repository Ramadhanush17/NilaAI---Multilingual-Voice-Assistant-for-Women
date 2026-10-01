import React from 'react';
import { CheckCircle2, ArrowRight, Globe } from 'lucide-react';
import { LanguageKey } from '../types';
import { LANGUAGES } from '../constants/languages';
import nilaAvatarImg from '../assets/images/nila_avatar_1790839459587.jpg';

interface LanguageConfirmationProps {
  language: LanguageKey;
  onContinue: () => void;
  onChangeLanguage: () => void;
}

export const LanguageConfirmation: React.FC<LanguageConfirmationProps> = ({
  language,
  onContinue,
  onChangeLanguage,
}) => {
  const langConfig = LANGUAGES[language] || LANGUAGES.english;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-4 py-8 bg-[#0A0A0A]">
      <div className="w-full rounded-3xl border border-[#FFD60A]/30 bg-[#161616] p-6 sm:p-8 text-center shadow-2xl shadow-black/80">
        {/* NilaAI Avatar with Yellow Ring */}
        <div className="relative mx-auto mb-6 h-28 w-28 overflow-hidden rounded-full border-4 border-[#FFD60A] bg-[#0A0A0A] shadow-md shadow-[#FFD60A]/20">
          <img
            src={nilaAvatarImg}
            alt="NilaAI Assistant"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#FFD60A] text-black ring-2 ring-[#161616]">
            <CheckCircle2 className="h-4 w-4 stroke-[3]" />
          </div>
        </div>

        {/* Selected Language badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1C1A0F] px-3.5 py-1 text-xs font-bold text-[#FFD60A] mb-3 border border-[#FFD60A]/40">
          <Globe className="h-3.5 w-3.5" />
          <span>{langConfig.name} ({langConfig.nativeName})</span>
        </div>

        {/* Confirmation Text */}
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {langConfig.confirmationText}
        </h2>

        <p className="mt-3 text-xs leading-relaxed text-[#A1A1A1]">
          {langConfig.tagline}
        </p>

        {/* Primary Continue Button & Outline Change Button */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={onContinue}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FFD60A] px-6 py-4 text-base font-extrabold text-black shadow-lg shadow-[#FFD60A]/20 hover:bg-[#FFE047] active:scale-[0.98] transition focus:outline-none focus:ring-4 focus:ring-[#FFD60A]/40"
          >
            <span>{langConfig.continueButton}</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={onChangeLanguage}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#FFD60A]/50 bg-transparent px-6 py-3.5 text-sm font-bold text-[#FFD60A] hover:bg-[#FFD60A] hover:text-black transition"
          >
            <span>Change Language / மொழியை மாற்றவும்</span>
          </button>
        </div>
      </div>
    </div>
  );
};
