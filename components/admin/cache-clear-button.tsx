'use client';

import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export function CacheClearButton() {
  const { refreshProfile, clearCacheAndReload } = useAuth();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <Button
        onClick={refreshProfile}
        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        size="sm"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        
      </Button>
      
      <Button
        onClick={clearCacheAndReload}
        className="bg-red-600 hover:bg-red-700 text-white shadow-lg block w-full"
        size="sm"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        
      </Button>
    </div>
  );
}