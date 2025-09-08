'use client';

import { useEffect } from 'react';

export function CurrencyMatrix() {
  useEffect(() => {
    // Create TradingView forex cross rates widget
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: 400,
      currencies: [
        "EUR",
        "USD", 
        "JPY",
        "GBP",
        "CHF",
        "AUD",
        "CAD",
        "NZD",
        "CNY"
      ],
      isTransparent: false,
      colorTheme: "dark",
      locale: "en"
    });

    const container = document.getElementById('currency-matrix-widget');
    if (container) {
      container.appendChild(script);
    }

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div 
      className="rounded-lg border border-green-500 overflow-hidden"
      style={{ height: '370px' }}
    >
      <div id="currency-matrix-widget" className="tradingview-widget-container h-full">
        <div className="tradingview-widget-container__widget h-full"></div>
      </div>
    </div>
  );
}