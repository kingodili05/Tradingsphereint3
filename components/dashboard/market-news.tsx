'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Newspaper } from 'lucide-react';

// Note: In production, this would fetch from a real news API
const news: any[] = []; // Removed mock news data

export function MarketNews() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Market News</CardTitle>
        <CardDescription>
          Latest market updates and financial news
        </CardDescription>
      </CardHeader>
      <CardContent>
        {news.length > 0 ? (
          <div className="space-y-4">
            {news.map((article, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <h4 className="font-medium text-sm mb-1">{article.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{article.summary}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {article.time} • {article.source}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Newspaper className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Market News</h3>
            <p className="text-muted-foreground">
              Market news and updates will appear here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}