'use client';

import Link from 'next/link';

export default function SettingsPage() {
  return (
    <div className="px-4 pt-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Settings</h1>

      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
            About
          </h2>
          <p className="text-slate-800 font-medium">AIDhd v0.1.0</p>
          <p className="text-slate-500 text-sm mt-1">
            Voice-first second brain for ADHD. Powered by Claude.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
            Configuration
          </h2>
          <p className="text-slate-600 text-sm">
            API keys and database settings are configured via environment variables.
            See <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">.env.local</code> for details.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
            Voice
          </h2>
          <p className="text-slate-600 text-sm">
            Voice capture uses the Web Speech API. Works best in Chrome, Edge, or Safari.
            Requires microphone permission.
          </p>
        </div>

        <Link
          href="https://github.com/Data-Tamers-Ltd/aidhd"
          target="_blank"
          className="text-center text-sm text-blue-500 hover:text-blue-600 py-4"
        >
          View on GitHub
        </Link>
      </div>
    </div>
  );
}
