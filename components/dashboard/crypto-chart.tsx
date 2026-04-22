'use client';

import { useState } from 'react';

export function CryptoChart() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="rounded-xl border border-white/8 overflow-hidden"
      style={{ backgroundColor: '#1D2330' }}
    >
      <div className="relative" style={{ height: '560px' }}>
        {/* Skeleton shown while iframe loads */}
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10"
            style={{ backgroundColor: '#1D2330' }}>
            <div className="w-10 h-10 rounded-full border-2 border-green-500/30 border-t-green-500 animate-spin" />
            <p className="text-gray-500 text-sm">Loading chart…</p>
            {/* Skeleton bars */}
            <div className="flex items-end gap-1.5 mt-2 opacity-20">
              {[40, 65, 45, 80, 55, 70, 50, 85, 60, 75, 45, 90, 65].map((h, i) => (
                <div
                  key={i}
                  className="w-4 rounded-t bg-green-500 animate-pulse"
                  style={{ height: `${h}px`, animationDelay: `${i * 80}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        <iframe
          src="https://widget.coinlib.io/widget?type=chart&theme=dark&coin_id=859&pref_coin_id=1505"
          width="100%"
          height="540"
          scrolling="auto"
          className="border-0 w-full"
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease', display: 'block' }}
          title="Crypto Chart"
          onLoad={() => setLoaded(true)}
        />
      </div>

      <div className="text-right pr-3 pb-2">
        <span className="text-gray-600 text-xs">
          powered by{' '}
          <a
            href="https://coinlib.io"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition-colors"
          >
            Coinlib
          </a>
        </span>
      </div>
    </div>
  );
}
