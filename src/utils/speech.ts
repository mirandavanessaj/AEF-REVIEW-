// Enhanced Speech Synthesis Utility for English Language Learning

type SpeechListener = (speakingText: string | null) => void;

const listeners = new Set<SpeechListener>();
let currentUtterance: SpeechSynthesisUtterance | null = null;
let activeSpeakingText: string | null = null;
let voicesLoaded = false;
let preferredVoice: SpeechSynthesisVoice | null = null;

// Initialize and pre-cache best English voice
function updateBestVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return;

  voicesLoaded = true;

  // Prioritize natural US English voices
  preferredVoice =
    voices.find(
      (v) =>
        (v.lang === 'en-US' || v.lang.startsWith('en')) &&
        (v.name.includes('Natural') ||
          v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.name.includes('Karen') ||
          v.name.includes('Zira') ||
          v.name.includes('David') ||
          v.name.includes('Alex'))
    ) ||
    voices.find((v) => v.lang === 'en-US') ||
    voices.find((v) => v.lang.startsWith('en')) ||
    null;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  updateBestVoice();
  window.speechSynthesis.onvoiceschanged = () => {
    updateBestVoice();
  };
}

function notifyListeners(text: string | null) {
  activeSpeakingText = text;
  listeners.forEach((listener) => {
    try {
      listener(text);
    } catch {
      // Ignore listener error
    }
  });
}

export function subscribeSpeech(listener: SpeechListener): () => void {
  listeners.add(listener);
  listener(activeSpeakingText);
  return () => {
    listeners.delete(listener);
  };
}

export function getActiveSpeakingText(): string | null {
  return activeSpeakingText;
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      console.warn('Error stopping speech:', e);
    }
  }
  currentUtterance = null;
  notifyListeners(null);
}

export interface SpeakOptions {
  lang?: string;
  rate?: number; // 0.1 to 2, 0.9 is normal learner speed, 0.65-0.7 is slow pronunciation
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

/**
 * Clean text for natural speech synthesis
 * Removes markdown markers, phonetic brackets if in same string, etc.
 */
function cleanTextForSpeech(text: string): string {
  return text
    .replace(/[*_#`~]/g, '') // remove markdown
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Pronounces the given text using the Web Speech API.
 * If the exact same text is currently speaking, it cancels/stops speech.
 */
export function speakText(text: string, options?: number | SpeakOptions): void {
  if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  // Handle backward compatibility where second arg was rate or lang string
  let config: SpeakOptions = {};
  if (typeof options === 'number') {
    config = { rate: options };
  } else if (typeof options === 'object' && options !== null) {
    config = options;
  }

  const rate = config.rate ?? 0.88; // clear learner cadence
  const lang = config.lang ?? 'en-US';
  const pitch = config.pitch ?? 1.0;

  // If already speaking this exact text, toggle off
  if (activeSpeakingText === text && window.speechSynthesis.speaking) {
    stopSpeech();
    return;
  }

  try {
    stopSpeech();

    const cleaned = cleanTextForSpeech(text);
    if (!cleaned) return;

    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = pitch;

    if (!voicesLoaded) {
      updateBestVoice();
    }

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      notifyListeners(text);
      config.onStart?.();
    };

    utterance.onend = () => {
      if (activeSpeakingText === text) {
        notifyListeners(null);
      }
      currentUtterance = null;
      config.onEnd?.();
    };

    utterance.onerror = (event) => {
      // 'canceled' or 'interrupted' is expected when stopping
      if (activeSpeakingText === text) {
        notifyListeners(null);
      }
      currentUtterance = null;
      if (event.error !== 'canceled' && event.error !== 'interrupted') {
        config.onError?.(event);
      }
    };

    // Store reference to avoid garbage collection bug in Chrome
    currentUtterance = utterance;

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('Speech synthesis execution failed:', err);
    notifyListeners(null);
    currentUtterance = null;
  }
}
