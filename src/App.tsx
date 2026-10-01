import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import {
  AppScreen,
  LanguageKey,
  ChatMessage,
  CollectedData,
  EligibilityResult,
  PendingLanguageSwitch,
} from './types';
import { LANGUAGES } from './constants/languages';
import { Header } from './components/Header';
import { LanguageSelection } from './components/LanguageSelection';
import { LanguageConfirmation } from './components/LanguageConfirmation';
import { ChatView } from './components/ChatView';
import { EligibilityResultCard } from './components/EligibilityResultCard';
import { LanguageSwitchPrompt } from './components/LanguageSwitchPrompt';
import { DemoFlowBar } from './components/DemoFlowBar';
import { useSpeech } from './hooks/useSpeech';
import { detectLanguage } from './services/languageDetector';
import { sendChatMessage } from './services/geminiService';
import { calculateEligibility } from './services/eligibilityEngine';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('language_selection');
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('tamil');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [collectedData, setCollectedData] = useState<CollectedData>({
    age: null,
    state: null,
    income: null,
  });
  const [pendingSwitch, setPendingSwitch] = useState<PendingLanguageSwitch | null>(null);
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const currentLangRef = useRef<LanguageKey>(currentLanguage);
  useEffect(() => {
    currentLangRef.current = currentLanguage;
  }, [currentLanguage]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  }, []);

  // Speech Hook
  const handleTranscript = useCallback((transcript: string) => {
    handleUserMessage(transcript);
  }, []);

  const handleSpeechError = useCallback((err: string) => {
    console.warn('Speech error received:', err);
  }, []);

  const {
    speechState,
    setSpeechState,
    isRecognitionSupported,
    activeSpeechText,
    loadingAudioText,
    isMuted,
    setIsMuted,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  } = useSpeech({
    currentLanguage,
    onTranscript: handleTranscript,
    onSpeechError: handleSpeechError,
    onToast: showToast,
  });

  // Helper to format timestamp
  const getTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Switch to language confirmation
  const handleSelectLanguage = (lang: LanguageKey) => {
    setCurrentLanguage(lang);
    setCurrentScreen('language_confirmation');
  };

  // Continue from confirmation to main chat screen
  const handleContinueToChat = () => {
    setCurrentScreen('chat');
    const langConfig = LANGUAGES[currentLanguage] || LANGUAGES.english;

    // Add initial greeting if messages are empty or reset
    if (messages.length === 0) {
      const initialGreeting: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'nila',
        text: langConfig.welcomeGreeting,
        timestamp: getTimestamp(),
        isDemoGreeting: true,
      };
      setMessages([initialGreeting]);

      // Speak greeting automatically after a brief natural delay
      setTimeout(() => {
        speak(langConfig.welcomeGreeting, currentLanguage, true);
      }, 400);
    }
  };

  // Send a user message and receive AI response
  const handleUserMessage = async (text: string, forceLanguage?: LanguageKey) => {
    if (!text.trim() || isProcessing) return;

    const activeLang = forceLanguage || currentLanguage;

    // 1. Language Detection Check (unless forced)
    if (!forceLanguage) {
      const detected = detectLanguage(text, activeLang);
      if (detected && detected !== activeLang) {
        setPendingSwitch({
          detectedLanguage: detected,
          detectedText: text,
        });
        return;
      }
    }

    // 2. Add user message to state
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: getTimestamp(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);
    setSpeechState('processing');

    // 3. Format history for server
    const history = messages.map((m) => ({
      role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
      parts: [{ text: m.text }],
    }));

    try {
      const result = await sendChatMessage(text, activeLang, history, collectedData);

      // Update extracted data
      const updatedData = {
        age: result.extracted?.age ?? collectedData.age,
        state: result.extracted?.state ?? collectedData.state,
        income: result.extracted?.income ?? collectedData.income,
      };
      setCollectedData(updatedData);

      // Add Nila's reply
      const replyMsg: ChatMessage = {
        id: `nila-${Date.now()}`,
        sender: 'nila',
        text: result.reply,
        timestamp: getTimestamp(),
      };
      setMessages((prev) => [...prev, replyMsg]);
      setIsProcessing(false);

      // Speak response aloud (auto-play mode respects mute toggle)
      speak(result.reply, activeLang, true);

      // Check if all 3 criteria are satisfied
      if (
        updatedData.age !== null &&
        updatedData.state !== null &&
        updatedData.income !== null
      ) {
        const evalResult = calculateEligibility(updatedData, activeLang);
        setEligibilityResult(evalResult);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setIsProcessing(false);
      setSpeechState('idle');
    }
  };

  // Orb click handler
  const handleOrbClick = () => {
    if (speechState === 'listening') {
      stopListening();
    } else if (speechState === 'speaking') {
      stopSpeaking();
    } else {
      startListening();
    }
  };

  // Replay message audio (manual replay plays even if auto-voice is muted)
  const handleReplaySpeech = (text: string) => {
    speak(text, currentLanguage, false);
  };

  // Confirm automatic language switch
  const handleConfirmSwitch = () => {
    if (!pendingSwitch) return;
    const newLang = pendingSwitch.detectedLanguage;
    const pendingText = pendingSwitch.detectedText;
    setPendingSwitch(null);

    // Switch current language
    setCurrentLanguage(newLang);
    const newConfig = LANGUAGES[newLang];

    // Announce switch in the new language
    const ackMsg: ChatMessage = {
      id: `ack-${Date.now()}`,
      sender: 'nila',
      text: newConfig.switchAck,
      timestamp: getTimestamp(),
    };
    setMessages((prev) => [...prev, ackMsg]);
    speak(newConfig.switchAck, newLang);

    // After brief delay, process the original message in the new language
    setTimeout(() => {
      handleUserMessage(pendingText, newLang);
    }, 800);
  };

  // Dismiss language switch
  const handleDismissSwitch = () => {
    if (!pendingSwitch) return;
    const pendingText = pendingSwitch.detectedText;
    setPendingSwitch(null);
    // Continue in current language
    handleUserMessage(pendingText, currentLanguage);
  };

  // View calculated eligibility result
  const handleViewResult = () => {
    stopSpeaking();
    stopListening();
    const evalResult = calculateEligibility(collectedData, currentLanguage);
    setEligibilityResult(evalResult);
    setCurrentScreen('eligibility_result');
  };

  // Start again (resets session)
  const handleStartAgain = () => {
    stopSpeaking();
    stopListening();
    setMessages([]);
    setCollectedData({ age: null, state: null, income: null });
    setEligibilityResult(null);
    setPendingSwitch(null);
    setIsLanguageModalOpen(false);
    setCurrentScreen('language_selection');
  };

  // Open language switcher
  const handleOpenLanguageSwitcher = () => {
    setIsLanguageModalOpen(true);
  };

  // Select new language from modal
  const handleModalSelectLanguage = (lang: LanguageKey) => {
    setCurrentLanguage(lang);
    setIsLanguageModalOpen(false);
    const langConfig = LANGUAGES[lang];

    // Add a localized status note
    const noteMsg: ChatMessage = {
      id: `lang-change-${Date.now()}`,
      sender: 'nila',
      text: langConfig.switchAck,
      timestamp: getTimestamp(),
    };
    setMessages((prev) => [...prev, noteMsg]);
    speak(langConfig.switchAck, lang);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] flex flex-col font-sans">
      {/* Top Header */}
      <Header
        currentLanguage={currentLanguage}
        onChangeLanguage={handleOpenLanguageSwitcher}
        onStartAgain={handleStartAgain}
        showLanguageSwitcher={currentScreen !== 'language_selection'}
      />

      {/* Toast Notification for unsupported language voice */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl bg-[#161616] text-[#FFD60A] px-4 py-2.5 text-xs font-bold shadow-2xl backdrop-blur-md border border-[#FFD60A]/40 animate-in fade-in slide-in-from-top-2 duration-150">
          <AlertCircle className="h-4 w-4 text-[#FFD60A] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Language Switch Confirmation Modal/Banner */}
      {pendingSwitch && (
        <LanguageSwitchPrompt
          currentLanguage={currentLanguage}
          detectedLanguage={pendingSwitch.detectedLanguage}
          onConfirmSwitch={handleConfirmSwitch}
          onDismiss={handleDismissSwitch}
        />
      )}

      {/* Main Content View Switcher */}
      <main className="flex-1 flex flex-col">
        {currentScreen === 'language_selection' && (
          <LanguageSelection onSelectLanguage={handleSelectLanguage} />
        )}

        {currentScreen === 'language_confirmation' && (
          <LanguageConfirmation
            language={currentLanguage}
            onContinue={handleContinueToChat}
            onChangeLanguage={() => setCurrentScreen('language_selection')}
          />
        )}

        {currentScreen === 'chat' && (
          <div className="flex-1 flex flex-col justify-between">
            <ChatView
              messages={messages}
              currentLanguage={currentLanguage}
              speechState={speechState}
              isRecognitionSupported={isRecognitionSupported}
              activeSpeechText={activeSpeechText}
              loadingAudioText={loadingAudioText}
              isMuted={isMuted}
              onToggleMute={() => setIsMuted((prev) => !prev)}
              onSendMessage={(text) => handleUserMessage(text)}
              onOrbClick={handleOrbClick}
              onStopSpeaking={stopSpeaking}
              onReplaySpeech={handleReplaySpeech}
              isProcessing={isProcessing}
            />

            {/* Bottom Demo Flow Assistant Bar */}
            <DemoFlowBar
              currentLanguage={currentLanguage}
              collectedData={collectedData}
              onQuickPrompt={(text) => handleUserMessage(text)}
              onViewResult={handleViewResult}
            />
          </div>
        )}

        {currentScreen === 'eligibility_result' && eligibilityResult && (
          <EligibilityResultCard
            result={eligibilityResult}
            collectedData={collectedData}
            language={currentLanguage}
            onStartAgain={handleStartAgain}
            onAskAnother={() => setCurrentScreen('chat')}
          />
        )}
      </main>

      {/* Language Modal (when clicking Change Language from Header) */}
      {isLanguageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl border border-[#FFD60A]/30 bg-[#161616] p-6 shadow-2xl text-[#EDEDED]">
            <h3 className="text-lg font-bold text-white mb-1">
              Select Language
            </h3>
            <p className="text-xs text-[#888888] mb-4">
              Your conversation history will be kept.
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {(['tamil', 'hindi', 'telugu', 'english'] as LanguageKey[]).map(
                (lang) => {
                  const cfg = LANGUAGES[lang];
                  const isActive = currentLanguage === lang;
                  return (
                    <button
                      key={lang}
                      onClick={() => handleModalSelectLanguage(lang)}
                      className={`flex flex-col items-center justify-center rounded-2xl border-2 p-3 text-center transition active:scale-95 ${
                        isActive
                          ? 'border-[#FFD60A] bg-[#1C1A0F] text-[#FFD60A]'
                          : 'border-[#262626] bg-[#0A0A0A] hover:border-[#FFD60A]/50 text-[#EDEDED]'
                      }`}
                    >
                      <span className="text-base font-bold">{cfg.nativeName}</span>
                      <span className="text-[11px] text-[#888888]">{cfg.name}</span>
                    </button>
                  );
                }
              )}
            </div>

            <button
              onClick={() => setIsLanguageModalOpen(false)}
              className="mt-5 w-full rounded-xl border border-[#FFD60A]/40 bg-transparent py-2.5 text-xs font-bold text-[#FFD60A] hover:bg-[#FFD60A] hover:text-black transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
