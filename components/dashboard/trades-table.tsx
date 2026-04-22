'use client';

import { Trade } from '@/lib/database.types';
import { RefreshCw, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TradesTableProps {
  trades: Trade[];
}

export function TradesTable({ trades }: TradesTableProps) {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handlePrint = () => {
    const printContent = document.getElementById('trades-table');
    if (printContent) {
      const newWin = window.open('');
      newWin?.document.write(printContent.outerHTML);
      newWin?.print();
      newWin?.close();
    }
  };

  return (
    <div 
      className="rounded-lg border border-green-500"
      style={{ backgroundColor: '#1D2330', height: '370px' }}
    >
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">Live Order History</h3>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="text-white hover:text-gray-300"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrint}
              className="text-white hover:text-gray-300"
            >
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-4" style={{ height: '300px' }}>
        <div className="overflow-auto h-full" id="trades-table">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white border-b border-gray-700">
                <th className="text-left py-2">S/N</th>
                <th className="text-left py-2">Trade Time</th>
                <th className="text-left py-2">Symbol</th>
                <th className="text-left py-2">Volume</th>
                <th className="text-left py-2">S/L</th>
                <th className="text-left py-2">T/P</th>
                <th className="text-left py-2">Expire Time</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {trades.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400">
                    No record found
                  </td>
                </tr>
              ) : (
                trades.map((trade, index) => (
                  <tr key={trade.id} className="border-b border-gray-700">
                    <td className="py-2">{index + 1}</td>
                    <td className="py-2">{new Date(trade.created_at).toLocaleString()}</td>
                    <td className="py-2">{trade.symbol}</td>
                    <td className="py-2">{trade.volume}</td>
                    <td className="py-2">{trade.stop_loss ? `$${trade.stop_loss}` : '-'}</td>
                    <td className="py-2">{trade.take_profit ? `$${trade.take_profit}` : '-'}</td>
                    <td className="py-2">
                      {trade.expire_time ? new Date(trade.expire_time).toLocaleString() : '-'}
                    </td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        trade.status === 'open' ? 'bg-green-600' :
                        trade.status === 'closed' ? 'bg-blue-600' :
                        trade.status === 'cancelled' ? 'bg-gray-600' :
                        'bg-yellow-600'
                      }`}>
                        {trade.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}