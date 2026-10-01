import React from 'react';
import { Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { CollectedData, LanguageKey } from '../types';
import { LANGUAGES } from '../constants/languages';

interface DemoFlowBarProps {
  currentLanguage: LanguageKey;
  collectedData: CollectedData;
  onQuickPrompt: (text: string) => void;
  onViewResult: () => void;
}

export const DemoFlowBar: React.FC<DemoFlowBarProps> = ({
  currentLanguage,
  collectedData,
  onQuickPrompt,
  onViewResult,
}) => {
  const langConfig = LANGUAGES[currentLanguage] || LANGUAGES.english;
  const isComplete =
    collectedData.age !== null &&
    collectedData.state !== null &&
    collectedData.income !== null;

  return (
    <div className="border-t border-[#FFD60A]/20 bg-[#0A0A0A]/95 px-4 py-3 backdrop-blur-md">
      <div className="mx-auto max-w-3xl space-y-2">
        {/* Status progress pill row */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#888888] uppercase tracking-wider text-[10px]">
              Demo Criteria:
            </span>

            {/* Age pill */}
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-bold text-[11px] ${
                collectedData.age !== null
                  ? 'bg-[#1C1A0F] text-[#FFD60A] border border-[#FFD60A]/40'
                  : 'bg-[#161616] text-[#666666] border border-[#262626]'
              }`}
            >
              {collectedData.age !== null ? <Check className="h-3 w-3 text-[#FFD60A] stroke-[3]" /> : null}
              <span>Age: {collectedData.age !== null ? `${collectedData.age}y` : '18-60'}</span>
            </span>

            {/* State pill */}
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-bold text-[11px] ${
                collectedData.state !== null
                  ? 'bg-[#1C1A0F] text-[#FFD60A] border border-[#FFD60A]/40'
                  : 'bg-[#161616] text-[#666666] border border-[#262626]'
              }`}
            >
              {collectedData.state !== null ? <Check className="h-3 w-3 text-[#FFD60A] stroke-[3]" /> : null}
              <span>State: {collectedData.state || 'Tamil Nadu'}</span>
            </span>

            {/* Income pill */}
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-bold text-[11px] ${
                collectedData.income !== null
                  ? 'bg-[#1C1A0F] text-[#FFD60A] border border-[#FFD60A]/40'
                  : 'bg-[#161616] text-[#666666] border border-[#262626]'
              }`}
            >
              {collectedData.income !== null ? <Check className="h-3 w-3 text-[#FFD60A] stroke-[3]" /> : null}
              <span>
                Income:{' '}
                {collectedData.income !== null
                  ? `₹${(collectedData.income / 100000).toFixed(1)}L`
                  : '≤ ₹3L'}
              </span>
            </span>
          </div>

          {/* Quick result check button once all criteria collected */}
          {isComplete && (
            <button
              type="button"
              onClick={onViewResult}
              className="flex items-center gap-1.5 rounded-xl bg-[#FFD60A] px-3.5 py-1 text-xs font-black text-black shadow-md shadow-[#FFD60A]/20 hover:bg-[#FFE047] active:scale-95 transition"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Check Eligibility</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#666666] mr-1 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-[#FFD60A]" />
            Try:
          </span>
          {langConfig.quickPrompts.map((promptText, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onQuickPrompt(promptText)}
              className="rounded-lg border border-[#FFD60A]/30 bg-[#161616] px-2.5 py-1 text-xs font-semibold text-[#EDEDED] hover:border-[#FFD60A] hover:bg-[#FFD60A] hover:text-black transition-all active:scale-95 shadow-2xs"
            >
              {promptText}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
