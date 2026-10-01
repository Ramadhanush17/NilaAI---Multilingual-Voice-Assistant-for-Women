import { useState, useEffect, useRef, useCallback } from 'react';
import { LanguageKey, LanguageCode, SpeechState } from '../types';
import { LANGUAGES } from '../constants/languages';

interface UseSpeechOptions {
  currentLanguage: LanguageKey;
  onTranscript: (transcript: string) => void;
  onSpeechError?: (error: string) => void;
  onToast?: (message: string) => void;
}

// Window interface augmentation for Web Speech API
interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
  webkitAudioContext?: any;
}

// Client-side in-memory audio cache to prevent redundant TTS API requests
const clientAudioCache = new Map<string, string>();

// Clean text for speech
function cleanTextForSpeech(raw: string): string {
  return raw
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/[`_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function useSpeech({
  currentLanguage,
  onTranscript,
  onSpeechError,
  onToast,
}: UseSpeechOptions) {
  const [speechState, setSpeechState] = useState<SpeechState>('idle');
  const [isRecognitionSupported, setIsRecognitionSupported] = useState<boolean>(true);
  const [isSynthesisSupported, setIsSynthesisSupported] = useState<boolean>(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [activeSpeechText, setActiveSpeechText] = useState<string>('');
  const [loadingAudioText, setLoadingAudioText] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);
  const currentLangRef = useRef<LanguageKey>(currentLanguage);
  const activeAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const isMutedRef = useRef<boolean>(isMuted);

  useEffect(() => {
    currentLangRef.current = currentLanguage;
  }, [currentLanguage]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Autoplay Policy Unlock: Unlock HTMLAudio & AudioContext on first user interaction
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const unlockAudio = () => {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as IWindow).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          if (ctx.state === 'suspended') {
            ctx.resume();
          }
        }
        // Unlock HTMLAudio element
        const dummyAudio = new Audio();
        dummyAudio.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
        dummyAudio.play().catch(() => {});
      } catch {
        // ignore
      }
    };

    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });

    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  // Listen for 'voiceschanged' event to load browser speech voices
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!('speechSynthesis' in window)) {
      setIsSynthesisSupported(false);
      return;
    }

    const handleVoicesChanged = () => {
      try {
        const available = window.speechSynthesis.getVoices();
        if (available && available.length > 0) {
          setVoices(available);
        }
      } catch (e) {
        console.warn('Could not read speech voices:', e);
      }
    };

    handleVoicesChanged();
    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Initialize Web Speech Recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const win = window as unknown as IWindow;
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setIsRecognitionSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        isListeningRef.current = true;
        setSpeechState('listening');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          onTranscript(transcript.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error);
        isListeningRef.current = false;
        setSpeechState((prev) => (prev === 'listening' ? 'idle' : prev));
        if (event.error === 'not-allowed') {
          onSpeechError?.('Microphone access was denied. Please allow microphone permission.');
        } else if (event.error !== 'no-speech') {
          onSpeechError?.(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        isListeningRef.current = false;
        setSpeechState((prev) => (prev === 'listening' ? 'idle' : prev));
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Failed to initialize speech recognition:', err);
      setIsRecognitionSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [onTranscript, onSpeechError]);

  // Stop speaking (audio element + browser speech synthesis)
  const stopSpeaking = useCallback(() => {
    if (activeAudioElementRef.current) {
      try {
        activeAudioElementRef.current.pause();
        activeAudioElementRef.current.currentTime = 0;
        activeAudioElementRef.current = null;
      } catch {
        // ignore
      }
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }

    setActiveSpeechText('');
    setLoadingAudioText(null);
    setSpeechState('idle');
  }, []);

  // Start listening with microphone
  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      onSpeechError?.('Speech recognition is not supported in this browser.');
      return;
    }

    stopSpeaking();

    try {
      const speechCode: LanguageCode = LANGUAGES[currentLangRef.current]?.speechCode || 'en-IN';
      recognitionRef.current.lang = speechCode;
      recognitionRef.current.start();
    } catch (err) {
      console.warn('Could not start recognition:', err);
      try {
        recognitionRef.current.stop();
        setTimeout(() => {
          try {
            recognitionRef.current.start();
          } catch {
            // ignore
          }
        }, 200);
      } catch {
        // ignore
      }
    }
  }, [onSpeechError, stopSpeaking]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListeningRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setSpeechState('idle');
  }, []);

  // Primary: Play server-side Gemini TTS audio with client cache
  const playServerAudio = useCallback(
    async (text: string, lang: LanguageKey): Promise<boolean> => {
      const clean = cleanTextForSpeech(text);
      if (!clean) return false;

      const cacheKey = `${lang}:${clean}`;
      let audioUrl = clientAudioCache.get(cacheKey);

      if (!audioUrl) {
        try {
          const res = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: clean, language: lang }),
          });

          if (!res.ok) throw new Error(`Server returned ${res.status}`);
          const data = await res.json();
          if (data && data.audioUrl) {
            audioUrl = data.audioUrl;
            clientAudioCache.set(cacheKey, audioUrl!);
          }
        } catch (fetchErr) {
          console.warn('Server TTS fetch failed:', fetchErr);
          return false;
        }
      }

      if (!audioUrl) return false;

      return new Promise<boolean>((resolve) => {
        try {
          const audio = new Audio(audioUrl);
          activeAudioElementRef.current = audio;

          audio.onplay = () => {
            setSpeechState('speaking');
            setLoadingAudioText(null);
          };

          audio.onended = () => {
            activeAudioElementRef.current = null;
            setActiveSpeechText('');
            setLoadingAudioText(null);
            setSpeechState('idle');
            resolve(true);
          };

          audio.onerror = (e) => {
            console.warn('Audio playback error:', e);
            activeAudioElementRef.current = null;
            setActiveSpeechText('');
            setLoadingAudioText(null);
            setSpeechState('idle');
            resolve(false);
          };

          audio.play().catch((playErr) => {
            console.warn('Audio play was prevented by browser policy:', playErr);
            activeAudioElementRef.current = null;
            setLoadingAudioText(null);
            setSpeechState('idle');
            resolve(false);
          });
        } catch (err) {
          console.warn('Audio instantiation failed:', err);
          setLoadingAudioText(null);
          resolve(false);
        }
      });
    },
    []
  );

  // Fallback: Browser SpeechSynthesis ONLY IF matching voice exists
  const playBrowserSpeechFallback = useCallback(
    (text: string, lang: LanguageKey): boolean => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return false;
      }

      const speechCode: LanguageCode = LANGUAGES[lang]?.speechCode || 'en-IN';
      const langPrefix = speechCode.split('-')[0].toLowerCase();

      // Only proceed if speechSynthesis.getVoices() actually contains a matching voice
      const currentVoices = window.speechSynthesis.getVoices();
      const hasMatchingVoice = currentVoices.some(
        (v) =>
          v.lang.toLowerCase() === speechCode.toLowerCase() ||
          v.lang.toLowerCase().replace('_', '-').startsWith(langPrefix)
      );

      if (!hasMatchingVoice) {
        return false;
      }

      const matchedVoice =
        currentVoices.find((v) => v.lang.toLowerCase() === speechCode.toLowerCase()) ||
        currentVoices.find((v) => v.lang.toLowerCase().replace('_', '-').startsWith(langPrefix));

      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(cleanTextForSpeech(text));
        utterance.lang = speechCode;
        if (matchedVoice) utterance.voice = matchedVoice;
        utterance.rate = 0.95;

        utterance.onstart = () => {
          setSpeechState('speaking');
          setLoadingAudioText(null);
        };

        utterance.onend = () => {
          setActiveSpeechText('');
          setLoadingAudioText(null);
          setSpeechState('idle');
        };

        utterance.onerror = () => {
          setActiveSpeechText('');
          setLoadingAudioText(null);
          setSpeechState('idle');
        };

        window.speechSynthesis.speak(utterance);
        return true;
      } catch {
        return false;
      }
    },
    []
  );

  // Main speak function:
  // 1. Server-side TTS is PRIMARY
  // 2. Browser SpeechSynthesis is FALLBACK (only if voice actually exists)
  // 3. If both fail, trigger toast notification
  const speak = useCallback(
    async (text: string, overrideLang?: LanguageKey, isAutoPlay = false) => {
      if (!text || !text.trim()) return;

      // If this is an auto-play trigger and user has muted, skip playing audio
      if (isAutoPlay && isMutedRef.current) {
        return;
      }

      stopSpeaking();
      const langToUse = overrideLang || currentLangRef.current;
      setActiveSpeechText(text);
      setLoadingAudioText(text);

      // Step 1: Attempt Server-side Primary TTS
      const serverSucceeded = await playServerAudio(text, langToUse);
      if (serverSucceeded) {
        return;
      }

      // Step 2: Attempt Browser SpeechSynthesis Fallback
      const fallbackSucceeded = playBrowserSpeechFallback(text, langToUse);
      if (fallbackSucceeded) {
        return;
      }

      // Step 3: Both failed -> Show toast
      setLoadingAudioText(null);
      setSpeechState('idle');
      setActiveSpeechText('');
      onToast?.('Voice not available for this language');
    },
    [stopSpeaking, playServerAudio, playBrowserSpeechFallback, onToast]
  );

  return {
    speechState,
    setSpeechState,
    isRecognitionSupported,
    isSynthesisSupported,
    activeSpeechText,
    loadingAudioText,
    isMuted,
    setIsMuted,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}
