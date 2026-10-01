import React from 'react';
import { Mic, Volume2, Square, Sparkles } from 'lucide-react';
import { SpeechState, LanguageKey } from '../types';
import { LANGUAGES } from '../constants/languages';

interface VoiceOrbProps {
  speechState: SpeechState;
  currentLanguage: LanguageKey;
  onOrbClick: () => void;
  onStopSpeaking: () => void;
  disabled?: boolean;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({
  speechState,
  currentLanguage,
  onOrbClick,
  onStopSpeaking,
  disabled = false,
}) => {
  const langConfig = LANGUAGES[currentLanguage] || LANGUAGES.english;

  const isListening = speechState === 'listening';
  const isProcessing = speechState === 'processing';
  const isSpeaking = speechState === 'speaking';
  const isIdle = speechState === 'idle';

  return (
    <div className="flex flex-col items-center justify-center py-3">
      {/* Outer interactive container */}
      <div className="relative flex items-center justify-center">
        {/* Animated concentric pulsing yellow waves when listening */}
        {isListening && (
          <>
            <span className="absolute h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-[#FFD60A]/25 animate-ping opacity-75" />
            <span className="absolute h-40 w-40 sm:h-48 sm:w-48 rounded-full bg-[#FFD60A]/15 animate-pulse" />
            <span className="absolute h-48 w-48 sm:h-56 sm:w-56 rounded-full border border-[#FFD60A]/40 animate-pulse" />
          </>
        )}

        {/* Animated revolving halo when processing */}
        {isProcessing && (
          <>
            <div className="absolute h-32 w-32 sm:h-40 sm:w-40 rounded-full border-4 border-[#262626] border-t-[#FFD60A] animate-spin" />
            <span className="absolute h-36 w-36 sm:h-44 sm:w-44 rounded-full bg-[#FFD60A]/10 animate-pulse" />
          </>
        )}

        {/* Sound wave visualizer ring when speaking */}
        {isSpeaking && (
          <div className="absolute -inset-4 sm:-inset-6 flex items-center justify-center pointer-events-none">
            <span className="absolute h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-[#FFD60A]/20 animate-ping opacity-60" />
            <span className="absolute h-36 w-36 sm:h-44 sm:w-44 rounded-full border border-[#FFD60A]/50 animate-pulse" />
          </div>
        )}

        {/* Main Central Orb Button: Yellow gradient with black icon and soft yellow glow */}
        <button
          type="button"
          onClick={onOrbClick}
          disabled={disabled || isProcessing}
          aria-label={
            isListening
              ? langConfig.orbStates.listening
              : isSpeaking
              ? langConfig.orbStates.stopSpeaking
              : langConfig.orbStates.idle
          }
          className={`relative z-10 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#FFD60A]/50 ${
            isListening
              ? 'bg-gradient-to-tr from-[#FFB800] to-[#FFD60A] text-black shadow-[0_0_40px_rgba(255,214,10,0.6)] scale-105'
              : isSpeaking
              ? 'bg-[#1C1A0F] border-2 border-[#FFD60A] text-[#FFD60A] shadow-[0_0_30px_rgba(255,214,10,0.35)]'
              : isProcessing
              ? 'bg-[#161616] border border-[#FFD60A]/30 text-[#FFD60A]/50 cursor-wait'
              : 'bg-gradient-to-tr from-[#FFB800] via-[#FFD60A] to-[#FFE047] text-black shadow-[0_0_30px_rgba(255,214,10,0.35)] hover:shadow-[0_0_45px_rgba(255,214,10,0.6)] hover:scale-105'
          }`}
        >
          {isListening ? (
            <div className="flex flex-col items-center">
              <span className="flex gap-1 mb-1">
                <span className="h-2 w-1 bg-black rounded-full animate-bounce" />
                <span className="h-3.5 w-1 bg-black rounded-full animate-bounce delay-100" />
                <span className="h-2 w-1 bg-black rounded-full animate-bounce delay-200" />
              </span>
              <Mic className="h-6 w-6 text-black" />
            </div>
          ) : isProcessing ? (
            <Sparkles className="h-7 w-7 text-[#FFD60A] animate-pulse" />
          ) : isSpeaking ? (
            <Volume2 className="h-7 w-7 text-[#FFD60A] animate-pulse" />
          ) : (
            <Mic className="h-8 w-8 text-black" />
          )}
        </button>
      </div>

      {/* Primary Instruction Label */}
      <div className="mt-2 text-center">
        <p className="text-sm font-bold tracking-wide">
          {isListening && (
            <span className="inline-flex items-center gap-1.5 text-[#FFD60A]">
              <span className="h-2 w-2 rounded-full bg-[#FFD60A] animate-ping" />
              {langConfig.orbStates.listening}
            </span>
          )}
          {isProcessing && (
            <span className="text-[#FFD60A] animate-pulse">
              {langConfig.orbStates.processing}
            </span>
          )}
          {isSpeaking && (
            <span className="text-[#FFD60A]">
              {langConfig.orbStates.speaking}
            </span>
          )}
          {isIdle && (
            <span className="text-[#EDEDED] font-semibold">
              {langConfig.orbStates.idle}
            </span>
          )}
        </p>

        {/* Secondary Subtitle */}
        <p className="text-[11px] text-[#A1A1A1] mt-0.5">
          {isListening
            ? 'Speaking to NilaAI…'
            : isSpeaking
            ? langConfig.orbStates.stopSpeaking
            : langConfig.tagline}
        </p>
      </div>

      {/* Quick interrupt control button if speaking */}
      {isSpeaking && (
        <button
          type="button"
          onClick={onStopSpeaking}
          className="mt-2 flex items-center gap-1.5 rounded-full border border-[#FFD60A] bg-transparent px-3 py-1 text-xs font-bold text-[#FFD60A] hover:bg-[#FFD60A] hover:text-black transition shadow-sm"
        >
          <Square className="h-3 w-3 fill-current" />
          <span>Stop Voice</span>
        </button>
      )}
    </div>
  );
};
