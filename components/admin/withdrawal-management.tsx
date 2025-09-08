'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const withdrawals = [
  {
    id: '1',
    user: 'Alice Brown',
    amount: '$3,200.00',
    method: 'Bank Transfer',
    status: 'pending',
    time: '2024-01-15 11:15:00',
  },
  {
    id: '2',
    user: 'Bob Wilson',
    amount: '$1,800.00',
    method: 'Crypto',
    status: 'processing',
    time: '2024-01-15 10:30:00',
  },
  {
    id: '3',
    user: 'Carol Davis',
    amount: '$5,500.00',
    method: 'Wire Transfer',
    status: 'completed',
    time: '2024-01-14 16:45:00',
  },
];

export function WithdrawalManagement() {
  const handleApprove = (withdrawalId: string) => {
    toast.success('Withdrawal approved successfully');
  };

  const handleReject = (withdrawalId: string) => {
    toast.success('Withdrawal rejected');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Withdrawals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {withdrawals.map((withdrawal) => (
            <div key={withdrawal.id} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{withdrawal.user}</div>
                  <div className="text-sm text-muted-foreground">{withdrawal.method}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600">{withdrawal.amount}</div>
                  <Badge 
                    variant={
                      withdrawal.status === 'completed' ? 'default' : 
                      withdrawal.status === 'processing' ? 'secondary' : 'outline'
                    }
                  >
                    {withdrawal.status}
                  </Badge>
                </div>
              </div>
              
              {withdrawal.status === 'pending' && (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(withdrawal.id)}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(withdrawal.id)}
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
              
              <div className="text-xs text-muted-foreground">
                {withdrawal.time}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}