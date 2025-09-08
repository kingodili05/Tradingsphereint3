'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase-client';
import { HistoricalPrice } from '@/lib/database.types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface PriceChartProps {
  symbol: string;
}

const timeframes = ['1h', '4h', '1d', '1w'];

export function PriceChart({ symbol }: PriceChartProps) {
  const [priceData, setPriceData] = useState<HistoricalPrice[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPriceData();
  }, [symbol, selectedTimeframe]);

  const fetchPriceData = async () => {
    if (!supabase) return;

    setLoading(true);

    const { data, error } = await supabase
      .from('historical_prices')
      .select('*')
      .eq('symbol', symbol)
      .eq('timeframe', selectedTimeframe)
      .order('timestamp', { ascending: true })
      .limit(100);

    if (data && !error) {
      setPriceData(data);
    }

    setLoading(false);
  };

  const formatChartData = () => {
    return priceData.map(price => ({
      time: new Date(price.timestamp).toLocaleDateString(),
      price: price.close_price,
      open: price.open_price,
      high: price.high_price,
      low: price.low_price,
      close: price.close_price,
      volume: price.volume,
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{symbol} Price Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = formatChartData();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>{symbol} Price Chart</span>
          </CardTitle>
          <div className="flex space-x-1">
            {timeframes.map((timeframe) => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe)}
              >
                {timeframe}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-96 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No price data available for {symbol}</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Price']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}