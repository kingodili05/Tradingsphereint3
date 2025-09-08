'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BalanceValidationSystem } from './balance-validation-system';
import { useBalances } from '@/hooks/use-balances';
import { toast } from 'sonner';

export function TradingInterface() {
  const { getBalanceByCurrency } = useBalances();
  const [selectedAsset, setSelectedAsset] = useState('BTC/USD');
  const [orderData, setOrderData] = useState({
    type: 'market',
    side: 'buy',
    quantity: '',
    price: '',
    stopLoss: '',
    takeProfit: '',
  });

  const [isValidTrade, setIsValidTrade] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const calculateTradeCost = () => {
    const quantity = parseFloat(orderData.quantity || '0');
    const price = parseFloat(orderData.price || '43250'); // Mock current price
    return quantity * price;
  };
  const handlePlaceOrder = () => {
    if (!isValidTrade) {
      toast.error(validationError || 'Invalid trade parameters');
      return;
    }

    toast.success(`${orderData.side.toUpperCase()} order placed for ${orderData.quantity} ${selectedAsset}`);
    setOrderData({
      type: 'market',
      side: 'buy',
      quantity: '',
      price: '',
      stopLoss: '',
      takeProfit: '',
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Trade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Balance Validation */}
            <BalanceValidationSystem 
              tradeAmount={calculateTradeCost()}
              onValidationChange={(isValid, error) => {
                setIsValidTrade(isValid);
                setValidationError(error);
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Asset Pair</Label>
                <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BTC/USD">BTC/USD</SelectItem>
                    <SelectItem value="ETH/USD">ETH/USD</SelectItem>
                    <SelectItem value="EUR/USD">EUR/USD</SelectItem>
                    <SelectItem value="AAPL">AAPL</SelectItem>
                    <SelectItem value="GOLD">Gold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Order Type</Label>
                <Select value={orderData.type} onValueChange={(value) => setOrderData({...orderData, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="market">Market Order</SelectItem>
                    <SelectItem value="limit">Limit Order</SelectItem>
                    <SelectItem value="stop">Stop Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs value={orderData.side} onValueChange={(value) => setOrderData({...orderData, side: value})}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buy" className="text-green-600">Buy</TabsTrigger>
                <TabsTrigger value="sell" className="text-red-600">Sell</TabsTrigger>
              </TabsList>
              
              <TabsContent value="buy" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={orderData.quantity}
                      onChange={(e) => setOrderData({...orderData, quantity: e.target.value})}
                    />
                  </div>
                  
                  {orderData.type === 'limit' && (
                    <div className="space-y-2">
                      <Label>Price</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={orderData.price}
                        onChange={(e) => setOrderData({...orderData, price: e.target.value})}
                      />
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Stop Loss (Optional)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={orderData.stopLoss}
                      onChange={(e) => setOrderData({...orderData, stopLoss: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Take Profit (Optional)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={orderData.takeProfit}
                      onChange={(e) => setOrderData({...orderData, takeProfit: e.target.value})}
                    />
                  </div>
                </div>
                
                {calculateTradeCost() > 0 && (
                  <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      Estimated Total: ${calculateTradeCost().toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Available Balance: ${getBalanceByCurrency('USD').toFixed(2)}
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={handlePlaceOrder} 
                  disabled={!isValidTrade || getBalanceByCurrency('USD') === 0}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Place Buy Order
                </Button>
              </TabsContent>
              
              <TabsContent value="sell" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={orderData.quantity}
                      onChange={(e) => setOrderData({...orderData, quantity: e.target.value})}
                    />
                  </div>
                  
                  {orderData.type === 'limit' && (
                    <div className="space-y-2">
                      <Label>Price</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={orderData.price}
                        onChange={(e) => setOrderData({...orderData, price: e.target.value})}
                      />
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Stop Loss (Optional)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={orderData.stopLoss}
                      onChange={(e) => setOrderData({...orderData, stopLoss: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Take Profit (Optional)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={orderData.takeProfit}
                      onChange={(e) => setOrderData({...orderData, takeProfit: e.target.value})}
                    />
                  </div>
                </div>
                
                {calculateTradeCost() > 0 && (
                  <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      Estimated Total: ${calculateTradeCost().toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Available Balance: ${getBalanceByCurrency('USD').toFixed(2)}
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={handlePlaceOrder} 
                  disabled={!isValidTrade || getBalanceByCurrency('USD') === 0}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Place Sell Order
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Account Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Available Balance</span>
                <span className="font-semibold">${getBalanceByCurrency('USD').toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Locked Balance</span>
                <span className="font-semibold">${getBalanceByCurrency('USD').toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Balance</span>
                <span className="font-semibold">${(getBalanceByCurrency('USD')).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}