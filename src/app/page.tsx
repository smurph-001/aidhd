'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { VoiceButton } from '@/components/VoiceButton';
import { CaptureInput } from '@/components/CaptureInput';
import { CaptureCard } from '@/components/CaptureCard';
import { ProcessingIndicator } from '@/components/ProcessingIndicator';
import { OfflineBanner } from '@/components/OfflineBanner';
import { useVoiceCapture } from '@/hooks/useVoiceCapture';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';
import type { Capture, CaptureSource } from '@/types';

export default function CapturePage() {
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const voice = useVoiceCapture();
  const offline = useOfflineQueue();

  const fetchCaptures = useCallback(async () => {
    try {
      const res = await fetch('/api/captures?limit=5');
      if (res.ok) {
        const data = await res.json();
        setCaptures(data);
      }
    } catch {
      // Offline — captures shown from next fetch
    }
  }, []);

  useEffect(() => {
    fetchCaptures();
  }, [fetchCaptures]);

  useEffect(() => {
    if (voice.finalTranscript && !voice.isListening) {
      handleCapture(voice.finalTranscript, 'voice');
      voice.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voice.finalTranscript, voice.isListening]);

  async function handleCapture(text: string, source: CaptureSource) {
    setIsProcessing(true);
    setProcessingMessage('Got it. Thinking...');
    toast.success('Captured!');

    const { serverCapture } = await offline.captureAndSync(text, source);

    if (serverCapture) {
      setProcessingMessage('Categorising...');
      try {
        const processRes = await fetch('/api/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ capture_id: serverCapture.id }),
        });

        if (processRes.ok) {
          const result = await processRes.json();
          setProcessingMessage(
            `${result.category === 'task' ? 'Added as task' : result.category}: ${result.summary}`,
          );
        }
      } catch {
        setProcessingMessage('Saved. Will process when online.');
      }
    } else {
      setProcessingMessage('Saved offline. Will sync later.');
    }

    await fetchCaptures();

    setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
  }

  return (
    <div className="flex flex-col items-center px-4 pt-8">
      {!offline.isOnline && <OfflineBanner pendingCount={offline.pendingCount} />}

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">AIDhd</h1>
        <p className="text-slate-500 text-sm mt-1">Capture a thought. I&apos;ll sort it out.</p>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <VoiceButton
          isListening={voice.isListening}
          isSupported={voice.isSupported}
          onStart={voice.startListening}
          onStop={voice.stopListening}
        />

        {voice.isListening && voice.transcript && (
          <p className="text-slate-600 text-center animate-pulse italic">
            &ldquo;{voice.transcript}&rdquo;
          </p>
        )}

        {voice.error && (
          <p className="text-red-500 text-sm text-center">{voice.error}</p>
        )}

        <CaptureInput
          onCapture={(text) => handleCapture(text, 'text')}
          disabled={isProcessing}
        />

        {isProcessing && <ProcessingIndicator message={processingMessage} />}
      </div>

      {captures.length > 0 && (
        <div className="w-full max-w-md mt-8">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">
            Recent
          </h2>
          <div className="flex flex-col gap-3">
            {captures.map((capture) => (
              <CaptureCard key={capture.id} capture={capture} />
            ))}
          </div>
        </div>
      )}

      {captures.length === 0 && !isProcessing && (
        <div className="mt-12 text-center">
          <p className="text-slate-400">No captures yet.</p>
          <p className="text-slate-400 text-sm mt-1">
            Tap the mic or type something to get started.
          </p>
        </div>
      )}
    </div>
  );
}
