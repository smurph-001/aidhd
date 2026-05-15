'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  saveOfflineCapture,
  getPendingCaptures,
  markSynced,
  clearSyncedCaptures,
} from '@/lib/offline/queue';
import type { CaptureSource, OfflineCapture } from '@/types';

export function useOfflineQueue() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const goOnline = () => {
      setIsOnline(true);
      syncPending();
    };
    const goOffline = () => setIsOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    refreshCount();

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refreshCount() {
    const pending = await getPendingCaptures();
    setPendingCount(pending.length);
  }

  const saveCapture = useCallback(
    async (rawText: string, source: CaptureSource) => {
      const offline = await saveOfflineCapture(rawText, source);
      setPendingCount((c) => c + 1);
      return offline;
    },
    [],
  );

  const syncPending = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);

    try {
      const pending = await getPendingCaptures();
      for (const capture of pending) {
        try {
          const res = await fetch('/api/captures', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              raw_text: capture.raw_text,
              source: capture.source,
              client_created_at: capture.client_created_at,
            }),
          });

          if (res.ok) {
            await markSynced(capture.id);
            setPendingCount((c) => Math.max(0, c - 1));

            const saved = await res.json();
            fetch('/api/process', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ capture_id: saved.id }),
            });
          }
        } catch {
          break;
        }
      }

      await clearSyncedCaptures();
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing]);

  const captureAndSync = useCallback(
    async (rawText: string, source: CaptureSource): Promise<{ offline: OfflineCapture; serverCapture?: { id: string } }> => {
      const offline = await saveCapture(rawText, source);

      if (!navigator.onLine) {
        return { offline };
      }

      try {
        const res = await fetch('/api/captures', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            raw_text: rawText,
            source,
            client_created_at: offline.client_created_at,
          }),
        });

        if (res.ok) {
          await markSynced(offline.id);
          setPendingCount((c) => Math.max(0, c - 1));
          const serverCapture = await res.json();
          return { offline, serverCapture };
        }
      } catch {
        // Network failed — capture is safe in IndexedDB
      }

      return { offline };
    },
    [saveCapture],
  );

  return {
    isOnline,
    pendingCount,
    isSyncing,
    captureAndSync,
    syncPending,
  };
}
