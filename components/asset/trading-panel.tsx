'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface TradingPanelProps {
  symbol: string;
}

export function TradingPanel({ symbol }: TradingPanelProps) {
  const [buyData, setBuyData] = useState({
    quantity: '',
    orderType: 'market',
    price: '',
  });

  const [sellData, setSellData] = useState({
    quantity: '',
    orderType: 'market',
    price: '',
  });

  const handleBuy = () => {
    toast.success(`Buy order placed for ${buyData.quantity} ${symbol}`);
  };

  const handleSell = () => {
    toast.success(`Sell order placed for ${sellData.quantity} ${symbol}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade {symbol}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy" className="text-green-600">Buy</TabsTrigger>
            <TabsTrigger value="sell" className="text-red-600">Sell</TabsTrigger>
          </TabsList>
          
          <TabsContent value="buy" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="buy-order-type">Order Type</Label>
              <Select value={buyData.orderType} onValueChange={(value) => setBuyData({...buyData, orderType: value})}>
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
            
            {buyData.orderType === 'limit' && (
              <div className="space-y-2">
                <Label htmlFor="buy-price">Price</Label>
                <Input
                  id="buy-price"
                  type="number"
                  placeholder="Enter price"
                  value={buyData.price}
                  onChange={(e) => setBuyData({...buyData, price: e.target.value})}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="buy-quantity">Quantity</Label>
              <Input
                id="buy-quantity"
                type="number"
                placeholder="Enter quantity"
                value={buyData.quantity}
                onChange={(e) => setBuyData({...buyData, quantity: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Estimated Total: $5,432.50
              </div>
              <div className="text-sm text-muted-foreground">
                Available Balance: $12,456.78
              </div>
            </div>
            
            <Button onClick={handleBuy} className="w-full bg-green-600 hover:bg-green-700">
              Buy {symbol}
            </Button>
          </TabsContent>
          
          <TabsContent value="sell" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sell-order-type">Order Type</Label>
              <Select value={sellData.orderType} onValueChange={(value) => setSellData({...sellData, orderType: value})}>
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
            
            {sellData.orderType === 'limit' && (
              <div className="space-y-2">
                <Label htmlFor="sell-price">Price</Label>
                <Input
                  id="sell-price"
                  type="number"
                  placeholder="Enter price"
                  value={sellData.price}
                  onChange={(e) => setSellData({...sellData, price: e.target.value})}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="sell-quantity">Quantity</Label>
              <Input
                id="sell-quantity"
                type="number"
                placeholder="Enter quantity"
                value={sellData.quantity}
                onChange={(e) => setSellData({...sellData, quantity: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Estimated Total: $3,250.75
              </div>
              <div className="text-sm text-muted-foreground">
                Available: 0.125 {symbol}
              </div>
            </div>
            
            <Button onClick={handleSell} className="w-full bg-red-600 hover:bg-red-700">
              Sell {symbol}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}