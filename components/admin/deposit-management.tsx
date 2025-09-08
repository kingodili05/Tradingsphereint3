'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const deposits = [
  {
    id: '1',
    user: 'John Doe',
    amount: '$5,000.00',
    method: 'Bank Transfer',
    status: 'pending',
    time: '2024-01-15 10:30:00',
  },
  {
    id: '2',
    user: 'Sarah Smith',
    amount: '$2,500.00',
    method: 'Credit Card',
    status: 'processing',
    time: '2024-01-15 09:45:00',
  },
  {
    id: '3',
    user: 'Mike Johnson',
    amount: '$1,000.00',
    method: 'Crypto',
    status: 'completed',
    time: '2024-01-15 08:20:00',
  },
];

export function DepositManagement() {
  const handleApprove = (depositId: string) => {
    toast.success('Deposit approved successfully');
  };

  const handleReject = (depositId: string) => {
    toast.success('Deposit rejected');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Deposits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deposits.map((deposit) => (
            <div key={deposit.id} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{deposit.user}</div>
                  <div className="text-sm text-muted-foreground">{deposit.method}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">{deposit.amount}</div>
                  <Badge 
                    variant={
                      deposit.status === 'completed' ? 'default' : 
                      deposit.status === 'processing' ? 'secondary' : 'outline'
                    }
                  >
                    {deposit.status}
                  </Badge>
                </div>
              </div>
              
              {deposit.status === 'pending' && (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(deposit.id)}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(deposit.id)}
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
              
              <div className="text-xs text-muted-foreground">
                {deposit.time}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}