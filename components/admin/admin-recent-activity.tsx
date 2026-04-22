'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminData } from '@/hooks/use-admin-data';
import { Clock, User, TrendingUp, ArrowDownToLine } from 'lucide-react';

export function AdminRecentActivity() {
  const { users, trades, deposits, loading } = useAdminData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const recentUsers = users?.slice(0, 5) || [];
  const recentTrades = trades?.slice(0, 5) || [];
  const recentDeposits = deposits?.slice(0, 5) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Recent Users</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUsers.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No users found</p>
            ) : (
              recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{user.full_name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={user.account_status === 'active' ? 'default' : 'secondary'}>
                      {user.account_status}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Recent Trades */}
            {recentTrades.slice(0, 2).map((trade) => (
              <div key={trade.id} className="flex items-center space-x-3">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    New {trade.trade_type} trade: {trade.symbol}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(trade.created_at).toLocaleString()}
                  </div>
                </div>
                <Badge variant="outline">${trade.unit_worth}</Badge>
              </div>
            ))}

            {/* Recent Deposits */}
            {recentDeposits.slice(0, 2).map((deposit) => (
              <div key={deposit.id} className="flex items-center space-x-3">
                <ArrowDownToLine className="h-4 w-4 text-blue-600" />
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    Deposit request: ${deposit.amount}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(deposit.created_at).toLocaleString()}
                  </div>
                </div>
                <Badge variant={deposit.status === 'pending' ? 'secondary' : 'default'}>
                  {deposit.status}
                </Badge>
              </div>
            ))}

            {(recentTrades.length === 0 && recentDeposits.length === 0) && (
              <p className="text-muted-foreground text-center py-4">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}