import React from 'react';
import { Volume2, Sparkles, ArrowRight } from 'lucide-react';
import { LanguageKey } from '../types';
import heroBannerImg from '../assets/images/nila_hero_banner_1790839485793.jpg';

interface LanguageSelectionProps {
  onSelectLanguage: (lang: LanguageKey) => void;
}

interface LanguageOption {
  key: LanguageKey;
  nativeTitle: string;
  englishTitle: string;
  region: string;
  sampleGreeting: string;
  badge: string;
}

const languageOptions: LanguageOption[] = [
  {
    key: 'tamil',
    nativeTitle: 'தமிழ்',
    englishTitle: 'Tamil',
    region: 'Tamil Nadu & Puducherry',
    sampleGreeting: 'வணக்கம், நான் உங்களுக்கு உதவுகிறேன்',
    badge: 'ta-IN',
  },
  {
    key: 'hindi',
    nativeTitle: 'हिन्दी',
    englishTitle: 'Hindi',
    region: 'North & Central India',
    sampleGreeting: 'नमस्ते, मैं आपकी सहायता करूँगी',
    badge: 'hi-IN',
  },
  {
    key: 'telugu',
    nativeTitle: 'తెలుగు',
    englishTitle: 'Telugu',
    region: 'Andhra Pradesh & Telangana',
    sampleGreeting: 'నమస్కారం, నేను మీకు సహాయం చేస్తాను',
    badge: 'te-IN',
  },
  {
    key: 'english',
    nativeTitle: 'English',
    englishTitle: 'English',
    region: 'Pan-India',
    sampleGreeting: 'Hello, I will guide you through schemes',
    badge: 'en-IN',
  },
];

export const LanguageSelection: React.FC<LanguageSelectionProps> = ({ onSelectLanguage }) => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 bg-[#0A0A0A] text-[#EDEDED]">
      {/* Hero Showcase Card */}
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-[#FFD60A]/30 bg-[#161616] text-white shadow-xl shadow-black/60">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          <div className="p-6 sm:p-8 md:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#1C1A0F] px-3 py-1 text-xs font-bold border border-[#FFD60A]/40 text-[#FFD60A] mb-3">
              <Sparkles className="h-3.5 w-3.5 text-[#FFD60A]" />
              <span>Voice-First AI Assistant</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              NilaAI
            </h1>
            <p className="mt-2 text-base text-[#FFD60A] sm:text-lg font-semibold">
              “Speak your language. Get the guidance you need.”
            </p>
            <p className="mt-3 text-xs sm:text-sm text-[#A1A1A1] leading-relaxed">
              Designed specifically for first-time women users in India. Talk naturally via voice in Tamil, Hindi, Telugu, or English to learn about government schemes, loans, self-help groups, and training.
            </p>
          </div>

          <div className="relative h-48 md:h-full md:col-span-5 border-t md:border-t-0 md:border-l border-[#FFD60A]/20">
            <img
              src={heroBannerImg}
              alt="Indian women talking and learning"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-center opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-transparent via-[#161616]/40 to-[#161616]" />
          </div>
        </div>
      </div>

      {/* Language Header */}
      <div className="mb-6 text-center">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Choose Your Language / உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#A1A1A1]">
          Select the language you are most comfortable speaking. You can change it anytime.
        </p>
      </div>

      {/* Language Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {languageOptions.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => onSelectLanguage(opt.key)}
            className="group relative flex flex-col justify-between rounded-3xl border border-[#FFD60A]/20 bg-[#161616] p-5 sm:p-6 text-left shadow-lg transition-all duration-200 hover:border-[#FFD60A] hover:shadow-[0_0_25px_rgba(255,214,10,0.15)] hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#FFD60A]"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#1C1A0F] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#FFD60A] border border-[#FFD60A]/30">
                  {opt.badge}
                </span>
                <span className="text-xs text-[#888888]">
                  {opt.region}
                </span>
              </div>

              <div className="mt-3">
                <h3 className="text-2xl font-extrabold tracking-tight text-white group-hover:text-[#FFD60A] transition-colors">
                  {opt.nativeTitle}
                </h3>
                <p className="text-xs font-semibold text-[#A1A1A1]">
                  {opt.englishTitle}
                </p>
              </div>

              {/* Sample phrase badge */}
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#0A0A0A] p-2.5 text-xs text-[#CCCCCC] border border-[#222222]">
                <Volume2 className="h-4 w-4 shrink-0 text-[#FFD60A]" />
                <span className="truncate italic">“{opt.sampleGreeting}”</span>
              </div>
            </div>

            {/* Bottom action trigger */}
            <div className="mt-4 flex items-center justify-between border-t border-[#262626] pt-3 text-xs font-bold text-[#FFD60A]">
              <span>Start in {opt.nativeTitle}</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#FFD60A] bg-transparent group-hover:bg-[#FFD60A] group-hover:text-black transition-all">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
