'use client';

import { Button } from '@/components/ui/button';
import { Bell, User, Mail } from 'lucide-react';

interface TradingHeaderProps {
  onProfileClick: () => void;
}

export function TradingHeader({ onProfileClick }: TradingHeaderProps) {
  return (
    <div className="bg-gray-800 border-b border-gray-700">
      {/* Top ticker */}
      <div className="bg-gray-900 px-4 py-2 overflow-x-auto">
        <div className="flex space-x-8 text-sm whitespace-nowrap">
          <span className="text-white">Nasdaq 100 • 23,412.5 <span className="text-red-400">-301.4 (-1.27%)</span></span>
          <span className="text-white">EUR/USD • 1.16826 <span className="text-green-400">+0.00060 (+0.05%)</span></span>
          <span className="text-white">BTC/USD • 108,349 <span className="text-red-400">-478.00 (-0.44%)</span></span>
          <span className="text-white">ETH/USD • 4,467.9 <span className="text-green-400">+94.20 (+2.15%)</span></span>
        </div>
      </div>
      
      {/* Main header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            Request Demo Account
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Live Acc Active
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-white">
              <Mail className="h-4 w-4" />
              <span className="ml-1 bg-red-500 text-xs px-1 rounded">1</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-white">
              <Bell className="h-4 w-4" />
              <span className="ml-1 bg-yellow-500 text-xs px-1 rounded">0</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white"
              onClick={onProfileClick}
            >
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}