'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/hooks/use-auth';
import { 
  Play, 
  Square, 
  Timer, 
  Users, 
  DollarSign, 
  Target,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

interface ExecutionAudit {
  id: string;
  signal_id: string;
  execution_type: string;
  participants_count: number;
  total_volume: number;
  outcome: string;
  profit_multiplier: number;
  executed_at: string;
  execution_details: any;
}

export function TradeExecutionDashboard() {
  const { isAdmin } = useAuth();
  const [executions, setExecutions] = useState<ExecutionAudit[]>([]);
  const [stats, setStats] = useState({
    totalExecutions: 0,
    totalParticipants: 0,
    totalVolume: 0,
    winRate: 0,
    avgProfit: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchExecutionHistory();
      fetchExecutionStats();
    }
  }, [isAdmin]);

  const fetchExecutionHistory = async () => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('trade_executions')
        .select(`
          *,
          admin_trade_signals!inner (
            signal_name,
            commodity,
            trade_direction
          )
        `)
        .order('executed_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setExecutions(data || []);
    } catch (error) {
      console.error('Error fetching execution history:', error);
    }
  };

  const fetchExecutionStats = async () => {
    if (!supabase) return;

    try {
      // Get aggregate stats
      const { data: statsData } = await supabase
        .from('trade_executions')
        .select('participants_count, total_volume, outcome, profit_multiplier');

      if (statsData) {
        const totalExecutions = statsData.length;
        const totalParticipants = statsData.reduce((sum, ex) => sum + ex.participants_count, 0);
        const totalVolume = statsData.reduce((sum, ex) => sum + ex.total_volume, 0);
        const winningTrades = statsData.filter(ex => ex.outcome === 'profit').length;
        const winRate = totalExecutions > 0 ? (winningTrades / totalExecutions) * 100 : 0;
        const avgProfit = totalVolume > 0 ? 
          statsData.reduce((sum, ex) => sum + (ex.total_volume * ex.profit_multiplier), 0) / totalVolume : 0;

        setStats({
          totalExecutions,
          totalParticipants,
          totalVolume,
          winRate,
          avgProfit
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'profit': return 'text-green-600';
      case 'loss': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'profit': return <TrendingUp className="h-4 w-4" />;
      case 'loss': return <TrendingDown className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Execution Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Executions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExecutions}</div>
            <div className="text-xs text-muted-foreground">All time</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalParticipants}</div>
            <div className="text-xs text-muted-foreground">Users involved</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalVolume.toFixed(0)}</div>
            <div className="text-xs text-muted-foreground">USD traded</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.winRate.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Success rate</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Avg P&L Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.avgProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.avgProfit >= 0 ? '+' : ''}{(stats.avgProfit * 100).toFixed(2)}%
            </div>
            <div className="text-xs text-muted-foreground">Average return</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Executions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Trade Executions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse border rounded-lg p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : executions.length === 0 ? (
            <div className="text-center py-8">
              <Timer className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Executions Yet</h3>
              <p className="text-muted-foreground">Trade executions will appear here after signals are run</p>
            </div>
          ) : (
            <div className="space-y-4">
              {executions.map((execution) => (
                <div key={execution.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${execution.outcome === 'profit' ? 'bg-green-100' : 'bg-red-100'}`}>
                        {getOutcomeIcon(execution.outcome)}
                      </div>
                      <div>
                        <div className="font-medium">
                          {execution.execution_details?.signal_name || 'Trade Signal'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {execution.execution_details?.commodity} • {execution.execution_details?.direction?.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge variant={execution.execution_type === 'manual' ? 'default' : 'secondary'}>
                        {execution.execution_type.toUpperCase()}
                      </Badge>
                      <div className={`text-sm font-semibold ${getOutcomeColor(execution.outcome)}`}>
                        {execution.outcome.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Participants</div>
                      <div className="font-medium">{execution.participants_count}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Volume</div>
                      <div className="font-medium">${execution.total_volume.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">P&L Rate</div>
                      <div className={`font-medium ${execution.profit_multiplier >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {execution.profit_multiplier >= 0 ? '+' : ''}{(execution.profit_multiplier * 100).toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Total P&L</div>
                      <div className={`font-medium ${execution.profit_multiplier >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${(execution.total_volume * execution.profit_multiplier).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Executed: {new Date(execution.executed_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}