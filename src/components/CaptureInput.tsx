'use client';

import { useState, type FormEvent } from 'react';

interface CaptureInputProps {
  onCapture: (text: string) => void;
  disabled?: boolean;
}

export function CaptureInput({ onCapture, disabled }: CaptureInputProps) {
  const [text, setText] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onCapture(trimmed);
    setText('');
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Or type something..."
          disabled={disabled}
          className="w-full px-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all disabled:opacity-50"
        />
        {text.trim() && (
          <button
            type="submit"
            disabled={disabled}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
}
