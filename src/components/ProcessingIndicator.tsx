'use client';

interface ProcessingIndicatorProps {
  message?: string;
}

export function ProcessingIndicator({ message = 'Got it. Thinking...' }: ProcessingIndicatorProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
      <div className="flex gap-1">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:300ms]" />
      </div>
      <span className="text-sm text-blue-600 font-medium">{message}</span>
    </div>
  );
}
