'use client';

export function CryptoChart() {
  return (
    <div
      className="rounded border border-gray-600 overflow-hidden"
      style={{ backgroundColor: '#1D2330', boxShadow: 'inset 0 -20px 0 0 #262B38' }}
    >
      <div className="p-1" style={{ height: '560px' }}>
        <iframe
          src="https://widget.coinlib.io/widget?type=chart&theme=dark&coin_id=859&pref_coin_id=1505"
          width="100%"
          height="536"
          scrolling="auto"
          className="border-0"
          title="Crypto Chart"
        />
      </div>
      <div className="text-right pr-2 pb-2">
        <span className="text-gray-400 text-xs">
          powered by{' '}
          <a 
            href="https://coinlib.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white"
          >
            Coinlib
          </a>
        </span>
      </div>
    </div>
  );
}