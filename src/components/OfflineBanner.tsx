'use client';

interface OfflineBannerProps {
  pendingCount: number;
}

export function OfflineBanner({ pendingCount }: OfflineBannerProps) {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center">
      <p className="text-sm text-amber-700">
        You&apos;re offline. {pendingCount > 0 && `${pendingCount} capture${pendingCount !== 1 ? 's' : ''} saved locally.`}{' '}
        They&apos;ll sync when you&apos;re back online.
      </p>
    </div>
  );
}
