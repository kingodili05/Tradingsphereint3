'use client';

import { useEffect, useRef } from 'react';

export function CryptoChart() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: 'BITSTAMP:BTCUSD',
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      allow_symbol_change: true,
      calendar: false,
      support_host: 'https://www.tradingview.com',
      backgroundColor: '#1D2330',
      gridColor: 'rgba(255,255,255,0.04)',
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, []);

  return (
    <div
      className="rounded-xl border border-white/8 overflow-hidden"
      style={{ backgroundColor: '#1D2330', height: '500px' }}
    >
      <div
        ref={containerRef}
        className="tradingview-widget-container w-full h-full"
      >
        <div className="tradingview-widget-container__widget w-full h-full" />
      </div>
    </div>
  );
}
