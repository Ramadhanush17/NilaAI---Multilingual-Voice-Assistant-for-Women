import React from 'react';
import {
  CheckCircle,
  AlertTriangle,
  FileText,
  RotateCcw,
  MessageSquare,
  ShieldAlert,
  Info,
  ArrowRight,
} from 'lucide-react';
import { EligibilityResult, LanguageKey, CollectedData } from '../types';
import { LANGUAGES } from '../constants/languages';

interface EligibilityResultCardProps {
  result: EligibilityResult;
  collectedData: CollectedData;
  language: LanguageKey;
  onStartAgain: () => void;
  onAskAnother: () => void;
}

export const EligibilityResultCard: React.FC<EligibilityResultCardProps> = ({
  result,
  collectedData,
  language,
  onStartAgain,
  onAskAnother,
}) => {
  const langConfig = LANGUAGES[language] || LANGUAGES.english;
  const isEligible = result.status === 'eligible';

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-10 bg-[#0A0A0A] text-[#EDEDED]">
      {/* Prominent Demo Notice Banner */}
      <div className="mb-4 flex items-center justify-between rounded-xl bg-[#1C1A0F] border border-[#FFD60A]/40 px-4 py-2.5 text-xs text-[#FFD60A]">
        <div className="flex items-center gap-2 font-bold tracking-wide">
          <ShieldAlert className="h-4 w-4 text-[#FFD60A] shrink-0" />
          <span>DEMO DATA — NOT AN OFFICIAL GOVERNMENT RESULT</span>
        </div>
        <span className="rounded bg-[#FFD60A] px-2 py-0.5 text-[10px] font-extrabold text-black uppercase tracking-wider">
          DEMO ONLY
        </span>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[#FFD60A]/30 bg-[#161616] shadow-2xl shadow-black/80">
        {/* Status Header */}
        <div
          className={`p-6 sm:p-8 text-white ${
            isEligible
              ? 'bg-[#1C1A0F] border-b border-[#FFD60A]/30'
              : 'bg-[#161616] border-b border-[#262626]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFD60A]">
              {langConfig.resultTitle}
            </span>
            <span className="rounded-full bg-[#0A0A0A] border border-[#FFD60A]/30 px-3 py-0.5 text-xs font-bold text-[#FFD60A]">
              {result.schemeName}
            </span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFD60A] text-black">
              {isEligible ? (
                <CheckCircle className="h-7 w-7 stroke-[2.5]" />
              ) : (
                <AlertTriangle className="h-7 w-7 stroke-[2.5]" />
              )}
            </div>

            <div>
              <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                {isEligible
                  ? langConfig.eligibleTitle
                  : langConfig.notEligibleTitle}
              </h2>
              <p className="mt-1 text-xs text-[#A1A1A1] sm:text-sm">
                {result.statusTitle}
              </p>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* User Details Summary */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#888888] mb-3">
              Your Evaluated Profile
            </h3>
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
              <div className="rounded-2xl border border-[#262626] bg-[#0A0A0A] p-3 text-center">
                <span className="text-[10px] font-bold uppercase text-[#666666]">Age</span>
                <p className="mt-1 text-base sm:text-lg font-black text-white">
                  {collectedData.age !== null ? `${collectedData.age} yrs` : 'N/A'}
                </p>
              </div>

              <div className="rounded-2xl border border-[#262626] bg-[#0A0A0A] p-3 text-center">
                <span className="text-[10px] font-bold uppercase text-[#666666]">State</span>
                <p className="mt-1 text-base sm:text-lg font-black text-white truncate">
                  {collectedData.state || 'N/A'}
                </p>
              </div>

              <div className="rounded-2xl border border-[#262626] bg-[#0A0A0A] p-3 text-center">
                <span className="text-[10px] font-bold uppercase text-[#666666]">Income</span>
                <p className="mt-1 text-base sm:text-lg font-black text-white">
                  {collectedData.income !== null
                    ? `₹${(collectedData.income / 100000).toFixed(1)}L`
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Scheme Benefit */}
          <div className="rounded-2xl border border-[#FFD60A]/20 bg-[#1C1A0F] p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFD60A] mb-1">
              {langConfig.benefitLabel}
            </h4>
            <p className="text-sm font-semibold text-white">
              {result.benefit}
            </p>
          </div>

          {/* Evaluation Reasons */}
          {result.reasons && result.reasons.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#888888] mb-3">
                Evaluation Notes
              </h3>
              <div className="space-y-2">
                {result.reasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-xl border border-[#262626] bg-[#0A0A0A] px-4 py-2.5 text-xs text-[#EDEDED]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FFD60A] shrink-0" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Required Documents Section */}
          {result.requiredDocuments && result.requiredDocuments.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-[#FFD60A]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#888888]">
                  {langConfig.documentsLabel}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.requiredDocuments.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 rounded-xl border border-[#262626] bg-[#0A0A0A] p-3 text-xs text-[#EDEDED]"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1C1A0F] text-[10px] font-black text-[#FFD60A] border border-[#FFD60A]/40">
                      {idx + 1}
                    </span>
                    <span className="font-semibold">{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Steps */}
          {result.nextSteps && result.nextSteps.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#888888] mb-3">
                {langConfig.nextStepsLabel}
              </h3>
              <div className="space-y-2">
                {result.nextSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-xl border border-[#262626] bg-[#0A0A0A] px-4 py-2.5 text-xs text-[#EDEDED]"
                  >
                    <ArrowRight className="h-3.5 w-3.5 text-[#FFD60A] shrink-0" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Important Advisory */}
          <div className="flex items-start gap-2.5 rounded-2xl bg-[#0A0A0A] border border-[#262626] p-4 text-xs text-[#888888]">
            <Info className="h-4 w-4 shrink-0 text-[#FFD60A] mt-0.5" />
            <p className="leading-relaxed">
              {result.disclaimer || langConfig.demoNotice}
            </p>
          </div>

          {/* Action Buttons: Yellow outline buttons that fill yellow on hover */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onAskAnother}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[#FFD60A] px-5 py-3.5 text-sm font-black text-black shadow-lg shadow-[#FFD60A]/20 hover:bg-[#FFE047] active:scale-98 transition"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{langConfig.askAnotherQuestion}</span>
            </button>

            <button
              type="button"
              onClick={onStartAgain}
              className="flex items-center justify-center gap-2 rounded-2xl border border-[#FFD60A] bg-transparent px-5 py-3.5 text-sm font-bold text-[#FFD60A] hover:bg-[#FFD60A] hover:text-black transition"
            >
              <RotateCcw className="h-4 w-4" />
              <span>{langConfig.startAgain}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
