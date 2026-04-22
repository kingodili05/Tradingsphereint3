'use client';

export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="relative">
        {/* Outer spinner */}
        <div className="w-24 h-24 border-8 border-transparent border-t-gray-300 border-b-gray-300 rounded-full animate-spin"></div>
        
        {/* Middle spinner */}
        <div className="absolute top-2 left-2 w-20 h-20 border-8 border-transparent border-t-gray-400 border-b-gray-400 rounded-full animate-spin" style={{ animationDuration: '0.5s' }}></div>
        
        {/* Inner spinner */}
        <div className="absolute top-4 left-4 w-16 h-16 border-8 border-transparent border-t-gray-500 border-b-gray-500 rounded-full animate-spin"></div>
        
        {/* Loading text */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-white text-sm font-bold tracking-wider animate-pulse">
            LOADING...
          </div>
        </div>
        
        {/* Timeout message */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-8 text-center">
          {/* <div className="text-gray-400 text-xs">
            If this takes too long, try refreshing the page
          </div> */}
        </div>
      </div>
    </div>
  );
}