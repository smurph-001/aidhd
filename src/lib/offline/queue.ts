import { openDB, type IDBPDatabase } from 'idb';
import { OFFLINE_DB_NAME, OFFLINE_STORE_NAME } from '../constants';
import type { OfflineCapture, CaptureSource } from '@/types';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(OFFLINE_DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(OFFLINE_STORE_NAME)) {
          db.createObjectStore(OFFLINE_STORE_NAME, { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveOfflineCapture(
  rawText: string,
  source: CaptureSource,
): Promise<OfflineCapture> {
  const db = await getDB();
  const capture: OfflineCapture = {
    id: crypto.randomUUID(),
    raw_text: rawText,
    source,
    client_created_at: new Date().toISOString(),
    synced: false,
  };
  await db.put(OFFLINE_STORE_NAME, capture);
  return capture;
}

export async function getPendingCaptures(): Promise<OfflineCapture[]> {
  const db = await getDB();
  const all = await db.getAll(OFFLINE_STORE_NAME);
  return all.filter((c: OfflineCapture) => !c.synced);
}

export async function markSynced(id: string): Promise<void> {
  const db = await getDB();
  const capture = await db.get(OFFLINE_STORE_NAME, id);
  if (capture) {
    capture.synced = true;
    await db.put(OFFLINE_STORE_NAME, capture);
  }
}

export async function clearSyncedCaptures(): Promise<void> {
  const db = await getDB();
  const all = await db.getAll(OFFLINE_STORE_NAME);
  const tx = db.transaction(OFFLINE_STORE_NAME, 'readwrite');
  for (const capture of all) {
    if (capture.synced) {
      await tx.store.delete(capture.id);
    }
  }
  await tx.done;
}
