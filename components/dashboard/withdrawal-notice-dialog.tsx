'use client';

import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
  blocked: boolean;
  variant?: 'light' | 'dark';
};

// Stays open until the user taps OK (or the X) — no auto-dismiss timer, so an
// admin's withdrawal message can't be missed or scroll away on mobile the way
// a toast can. Shared by every withdrawal entry point that can hit a hold.
export function WithdrawalNoticeDialog({ open, onOpenChange, message, blocked, variant = 'light' }: Props) {
  const dark = variant === 'dark';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md w-[calc(100%-2rem)] max-h-[85vh] overflow-y-auto"
        style={dark ? { backgroundColor: '#1D2330', border: '1px solid white' } : undefined}
      >
        <DialogHeader>
          <DialogTitle className={`font-bold flex items-center gap-2 ${dark ? 'text-white' : ''}`}>
            {blocked ? (
              <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
            )}
            {blocked ? 'Withdrawal Not Available' : 'Withdrawal Submitted'}
          </DialogTitle>
        </DialogHeader>
        <p className={`whitespace-pre-wrap break-words ${dark ? 'text-white' : 'text-foreground'}`}>
          {message}
        </p>
        <Button
          onClick={() => onOpenChange(false)}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          OK
        </Button>
      </DialogContent>
    </Dialog>
  );
}
