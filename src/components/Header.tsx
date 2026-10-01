import React from 'react';
import { Globe, RotateCcw, ShieldAlert } from 'lucide-react';
import { LanguageKey } from '../types';
import { LANGUAGES } from '../constants/languages';

interface HeaderProps {
  currentLanguage: LanguageKey;
  onChangeLanguage: () => void;
  onStartAgain: () => void;
  showLanguageSwitcher?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onChangeLanguage,
  onStartAgain,
  showLanguageSwitcher = true,
}) => {
  const langConfig = LANGUAGES[currentLanguage] || LANGUAGES.english;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#FFD60A]/20 bg-[#0A0A0A]/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          {/* Yellow square with black letter N */}
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFD60A] text-black shadow-md shadow-[#FFD60A]/20">
            <span className="text-xl font-black tracking-tight">N</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">
                NilaAI
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-[#1C1A0F] px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#FFD60A] border border-[#FFD60A]/40 uppercase">
                <ShieldAlert className="h-3 w-3 text-[#FFD60A]" />
                Demo Mode
              </span>
            </div>
            <p className="hidden text-xs text-[#A1A1A1] sm:block">
              {langConfig.tagline}
            </p>
          </div>
        </div>

        {/* Action Controls: Yellow outline buttons that fill yellow on hover */}
        <div className="flex items-center gap-2 sm:gap-3">
          {showLanguageSwitcher && (
            <button
              onClick={onChangeLanguage}
              aria-label={langConfig.changeLanguage}
              className="flex items-center gap-1.5 rounded-xl border border-[#FFD60A] bg-transparent px-3 py-1.5 text-xs font-bold text-[#FFD60A] hover:bg-[#FFD60A] hover:text-black transition-all active:scale-95 shadow-sm"
            >
              <Globe className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{langConfig.changeLanguage}</span>
              <span className="sm:ml-1 font-extrabold">
                {langConfig.nativeName}
              </span>
            </button>
          )}

          <button
            onClick={onStartAgain}
            aria-label={langConfig.startAgain}
            className="flex items-center gap-1.5 rounded-xl border border-[#FFD60A]/50 bg-transparent px-3 py-1.5 text-xs font-bold text-[#FFD60A] hover:bg-[#FFD60A] hover:text-black transition-all active:scale-95 shadow-sm"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{langConfig.startAgain}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
