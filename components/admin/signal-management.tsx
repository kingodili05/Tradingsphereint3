'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSignals } from '@/hooks/use-signals';
import { Signal } from '@/lib/database.types';
import { Plus, TrendingUp, Clock, Target, AlertTriangle, Play, X } from 'lucide-react';
import { toast } from 'sonner';

export function SignalManagement() {
  const { loading: authLoading } = useAuth();
  const { user, isAdmin } = useAuth();
  const { signals, loading, createSignal, executeSignal, cancelSignal } = useSignals();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [signalData, setSignalData] = useState({
    name: '',
    description: '',
    profit_target: '',
    loss_limit: '',
    expiry_hours: '24',
  });

  const handleCreateSignal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signalData.name || !signalData.profit_target || !signalData.loss_limit) {
      toast.error('Please fill in all required fields');
      return;
    }

    const profitTarget = parseFloat(signalData.profit_target) / 100; // Convert percentage to decimal
    const lossLimit = parseFloat(signalData.loss_limit) / 100;
    const expiryHours = parseInt(signalData.expiry_hours);
    const expiryTime = new Date(Date.now() + expiryHours * 60 * 60 * 1000).toISOString();

    const result = await createSignal({
      name: signalData.name,
      description: signalData.description,
      profit_target: profitTarget,
      loss_limit: lossLimit,
      expiry: expiryTime,
    });

    if (result.success) {
      setSignalData({
        name: '',
        description: '',
        profit_target: '',
        loss_limit: '',
        expiry_hours: '24',
      });
      setShowCreateDialog(false);
    }
  };

  const handleExecuteSignal = async (signalId: string) => {
    if (window.confirm('Are you sure you want to execute this signal? This will settle all user positions.')) {
      await executeSignal(signalId);
    }
  };

  const handleCancelSignal = async (signalId: string) => {
    if (window.confirm('Are you sure you want to cancel this signal? All user funds will be returned.')) {
      await cancelSignal(signalId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500';
      case 'executed': return 'bg-blue-500';
      case 'expired': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatPercentage = (decimal: number) => {
    return `${(decimal * 100).toFixed(1)}%`;
  };

  if (authLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
            <p className="text-sm text-gray-500">Current user: {user?.email}</p>
            <p className="text-sm text-gray-500">Admin status: {isAdmin ? 'Yes' : 'No'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Signal Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse border rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Button */}
      <div className="flex justify-end">
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Signal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Signal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSignal} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Signal Name *</Label>
                <Input
                  id="name"
                  value={signalData.name}
                  onChange={(e) => setSignalData({...signalData, name: e.target.value})}
                  placeholder="e.g., EUR/USD Bullish Signal"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={signalData.description}
                  onChange={(e) => setSignalData({...signalData, description: e.target.value})}
                  placeholder="Signal description and analysis..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="profit_target">Profit Target (%) *</Label>
                  <Input
                    id="profit_target"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="100"
                    value={signalData.profit_target}
                    onChange={(e) => setSignalData({...signalData, profit_target: e.target.value})}
                    placeholder="10.0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loss_limit">Loss Limit (%) *</Label>
                  <Input
                    id="loss_limit"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="100"
                    value={signalData.loss_limit}
                    onChange={(e) => setSignalData({...signalData, loss_limit: e.target.value})}
                    placeholder="5.0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry_hours">Expiry (Hours) *</Label>
                <Input
                  id="expiry_hours"
                  type="number"
                  min="1"
                  max="168"
                  value={signalData.expiry_hours}
                  onChange={(e) => setSignalData({...signalData, expiry_hours: e.target.value})}
                  required
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="flex-1">
                  Create Signal
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Signals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {signals.map((signal) => (
          <Card key={signal.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{signal.name}</CardTitle>
                <Badge className={getStatusColor(signal.status)}>
                  {signal.status.toUpperCase()}
                </Badge>
              </div>
              {signal.description && (
                <p className="text-sm text-muted-foreground">{signal.description}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-green-500" />
                  <div>
                    <div className="text-muted-foreground">Profit Target</div>
                    <div className="font-semibold text-green-600">
                      +{formatPercentage(signal.profit_target)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <div>
                    <div className="text-muted-foreground">Loss Limit</div>
                    <div className="font-semibold text-red-600">
                      -{formatPercentage(signal.loss_limit)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="text-muted-foreground">Expires</div>
                  <div className="font-semibold">
                    {new Date(signal.expiry).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Created: {new Date(signal.created_at).toLocaleString()}
              </div>

              {signal.status === 'open' && (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleExecuteSignal(signal.id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Execute
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCancelSignal(signal.id)}
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {signals.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Signals Created</h3>
            <p className="text-muted-foreground mb-4">
              Create your first trading signal to get started
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Signal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}