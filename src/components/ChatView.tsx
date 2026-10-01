import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Volume2,
  VolumeX,
  Loader2,
  Square,
  AlertCircle,
  Shield,
} from 'lucide-react';
import { ChatMessage, LanguageKey, SpeechState } from '../types';
import { LANGUAGES } from '../constants/languages';
import { VoiceOrb } from './VoiceOrb';
import nilaAvatarImg from '../assets/images/nila_avatar_1790839459587.jpg';

interface ChatViewProps {
  messages: ChatMessage[];
  currentLanguage: LanguageKey;
  speechState: SpeechState;
  isRecognitionSupported: boolean;
  activeSpeechText?: string;
  loadingAudioText?: string | null;
  isMuted: boolean;
  onToggleMute: () => void;
  onSendMessage: (text: string) => void;
  onOrbClick: () => void;
  onStopSpeaking: () => void;
  onReplaySpeech: (text: string) => void;
  isProcessing: boolean;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  currentLanguage,
  speechState,
  isRecognitionSupported,
  activeSpeechText = '',
  loadingAudioText = null,
  isMuted,
  onToggleMute,
  onSendMessage,
  onOrbClick,
  onStopSpeaking,
  onReplaySpeech,
  isProcessing,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const langConfig = LANGUAGES[currentLanguage] || LANGUAGES.english;

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] max-w-4xl mx-auto w-full bg-[#0A0A0A]">
      {/* Unsupported voice recognition warning banner if needed */}
      {!isRecognitionSupported && (
        <div className="mx-4 mt-2 flex items-center gap-2 rounded-xl bg-[#1C1A0F] p-3 text-xs text-[#FFD60A] border border-[#FFD60A]/40">
          <AlertCircle className="h-4 w-4 shrink-0 text-[#FFD60A]" />
          <span>{langConfig.voiceUnsupportedWarning}</span>
        </div>
      )}

      {/* Main Conversation Stream */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isThisMsgLoading = loadingAudioText === msg.text;
          const isThisMsgPlaying = speechState === 'speaking' && activeSpeechText === msg.text;

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 ${
                isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* Nila Avatar for AI message */}
              {!isUser && (
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[#FFD60A]/40 shadow-sm bg-[#161616]">
                  <img
                    src={nilaAvatarImg}
                    alt="NilaAI"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {/* Message Bubble Container */}
              <div
                className={`group relative max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-md transition-all ${
                  isUser
                    ? 'bg-[#FFD60A] text-black font-semibold rounded-br-none shadow-[#FFD60A]/10'
                    : 'bg-[#161616] text-[#EDEDED] border border-[#FFD60A]/20 rounded-bl-none'
                }`}
              >
                {/* Safe plain text rendering (XSS safe) */}
                <p className="whitespace-pre-wrap leading-relaxed">
                  {msg.text}
                </p>

                {/* Footer with timestamp & speaker replay button */}
                <div
                  className={`mt-2 flex items-center justify-between gap-3 text-[11px] ${
                    isUser ? 'text-black/60 font-medium' : 'text-[#888888]'
                  }`}
                >
                  <span>{msg.timestamp}</span>

                  {!isUser && (
                    <div className="flex items-center gap-1.5">
                      {isThisMsgLoading ? (
                        <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-semibold text-[#FFD60A] bg-[#1C1A0F] border border-[#FFD60A]/40 text-[11px]">
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-[#FFD60A]" />
                          <span>Generating voice…</span>
                        </div>
                      ) : isThisMsgPlaying ? (
                        <button
                          type="button"
                          onClick={onStopSpeaking}
                          aria-label="Stop audio"
                          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-bold text-black bg-[#FFD60A] hover:bg-[#FFE047] transition text-[11px] active:scale-95"
                        >
                          <Square className="h-3 w-3 fill-black text-black" />
                          <span>Stop</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onReplaySpeech(msg.text)}
                          aria-label="Listen audio"
                          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-bold text-[#FFD60A] border border-[#FFD60A] bg-transparent hover:bg-[#FFD60A] hover:text-black transition-all text-[11px] active:scale-95"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                          <span>Listen</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator when processing */}
        {isProcessing && (
          <div className="flex items-end gap-2.5">
            <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[#FFD60A]/40 shadow-sm bg-[#161616]">
              <img
                src={nilaAvatarImg}
                alt="NilaAI"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="rounded-2xl rounded-bl-none border border-[#FFD60A]/20 bg-[#161616] px-4 py-3 text-xs text-[#EDEDED] shadow-sm">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[#FFD60A]">NilaAI is thinking…</span>
                <span className="inline-flex gap-1 ml-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FFD60A] animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FFD60A] animate-bounce delay-100" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FFD60A] animate-bounce delay-200" />
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice Centerpiece Orb Zone */}
      <div className="border-t border-[#FFD60A]/20 bg-[#0A0A0A]/95 backdrop-blur-md px-4 pt-2 pb-2">
        {/* Controls header: Mute/Unmute auto-voice toggle and Live Subtitle */}
        <div className="mx-auto max-w-xl mb-2 flex items-center justify-between gap-2">
          {/* Live Subtitle bar when speaking */}
          {speechState === 'speaking' && activeSpeechText ? (
            <div className="flex-1 flex items-center justify-between gap-2 rounded-xl bg-[#161616] border border-[#FFD60A]/40 px-3 py-1.5 text-xs shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="flex h-2.5 w-2.5 shrink-0 rounded-full bg-[#FFD60A] animate-pulse" />
                <Volume2 className="h-4 w-4 shrink-0 text-[#FFD60A]" />
                <p className="truncate font-medium text-white">
                  <span className="font-bold text-[#FFD60A] mr-1">Speaking:</span>
                  {activeSpeechText}
                </p>
              </div>
              <button
                type="button"
                onClick={onStopSpeaking}
                className="shrink-0 rounded-lg border border-[#FFD60A] bg-transparent px-2.5 py-0.5 font-bold text-[#FFD60A] hover:bg-[#FFD60A] hover:text-black transition text-[11px]"
              >
                Stop
              </button>
            </div>
          ) : (
            <div className="text-[11px] text-[#888888] font-medium flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#FFD60A]" />
              <span>Voice Ready: {langConfig.nativeName}</span>
            </div>
          )}

          {/* Auto-Voice Mute/Unmute Toggle: Yellow outline button that fills yellow on hover */}
          <button
            type="button"
            onClick={onToggleMute}
            className={`shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border transition-all shadow-sm ${
              isMuted
                ? 'border-[#333333] bg-[#161616] text-[#888888] hover:border-[#FFD60A] hover:text-[#FFD60A]'
                : 'border border-[#FFD60A] bg-transparent text-[#FFD60A] hover:bg-[#FFD60A] hover:text-black'
            }`}
            title={isMuted ? 'Auto-voice is muted. Click to turn on auto-voice' : 'Auto-voice is on. Click to mute auto-voice'}
          >
            {isMuted ? (
              <>
                <VolumeX className="h-3.5 w-3.5" />
                <span>Voice: Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="h-3.5 w-3.5" />
                <span>Voice: Auto-Play</span>
              </>
            )}
          </button>
        </div>

        <VoiceOrb
          speechState={speechState}
          currentLanguage={currentLanguage}
          onOrbClick={onOrbClick}
          onStopSpeaking={onStopSpeaking}
          disabled={isProcessing}
        />

        {/* Text Input Fallback */}
        <form onSubmit={handleSubmit} className="mx-auto max-w-xl pb-1">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={langConfig.inputPlaceholder}
              disabled={isProcessing}
              maxLength={500}
              className="w-full rounded-2xl border border-[#262626] bg-[#161616] px-4 py-3 pr-24 text-sm text-[#EDEDED] placeholder:text-[#666666] focus:border-[#FFD60A] focus:outline-none focus:ring-2 focus:ring-[#FFD60A]/20 disabled:opacity-60 transition"
            />
            {/* Send: Yellow outline button that fills yellow on hover */}
            <button
              type="submit"
              disabled={!inputText.trim() || isProcessing}
              className="absolute right-2 flex items-center gap-1 rounded-xl border border-[#FFD60A] bg-[#FFD60A] px-3.5 py-1.5 text-xs font-bold text-black shadow-sm hover:bg-[#FFE047] disabled:opacity-30 disabled:pointer-events-none transition active:scale-95"
            >
              <span>{langConfig.sendButton}</span>
              <Send className="h-3 w-3" />
            </button>
          </div>

          {/* Privacy Note */}
          <p className="mt-2 text-center text-[11px] text-[#666666] flex items-center justify-center gap-1">
            <Shield className="h-3 w-3 text-[#FFD60A]" />
            <span>{langConfig.privacyNotice}</span>
          </p>
        </form>
      </div>
    </div>
  );
};
