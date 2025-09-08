'use client';

import { Button } from '@/components/ui/button';
import { RefreshCw, Printer } from 'lucide-react';

export function OrderHistory() {
  const handleRefresh = () => {
    // Refresh order history
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 h-64">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">Live Order History</h3>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="text-left py-2">S/N</th>
                <th className="text-left py-2">Trade Time</th>
                <th className="text-left py-2">Symbol</th>
                <th className="text-left py-2">Volume</th>
                <th className="text-left py-2">S/L</th>
                <th className="text-left py-2">T/P</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No trading history available
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}