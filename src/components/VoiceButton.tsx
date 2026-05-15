'use client';

interface VoiceButtonProps {
  isListening: boolean;
  isSupported: boolean;
  onStart: () => void;
  onStop: () => void;
}

export function VoiceButton({ isListening, isSupported, onStart, onStop }: VoiceButtonProps) {
  if (!isSupported) return null;

  return (
    <button
      onClick={isListening ? onStop : onStart}
      className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
        isListening
          ? 'bg-orange-500 shadow-lg shadow-orange-300 scale-110'
          : 'bg-blue-500 shadow-lg shadow-blue-200 hover:bg-blue-600 hover:scale-105 active:scale-95'
      }`}
      aria-label={isListening ? 'Stop recording' : 'Start recording'}
    >
      {isListening && (
        <>
          <span className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-30" />
          <span className="absolute inset-[-8px] rounded-full border-2 border-orange-300 animate-pulse" />
        </>
      )}
      <svg
        className="w-10 h-10 text-white relative z-10"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        {isListening ? (
          <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
          />
        )}
      </svg>
    </button>
  );
}
