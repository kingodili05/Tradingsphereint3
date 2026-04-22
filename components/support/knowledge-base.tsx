'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Book, HelpCircle, Shield, CreditCard } from 'lucide-react';
import { useState } from 'react';

const articles = [
  {
    title: 'How to start trading',
    category: 'Getting Started',
    icon: Book,
    description: 'Complete guide for new traders',
  },
  {
    title: 'Understanding trading fees',
    category: 'Billing',
    icon: CreditCard,
    description: 'Learn about our fee structure',
  },
  {
    title: 'Security best practices',
    category: 'Security',
    icon: Shield,
    description: 'Keep your account safe',
  },
  {
    title: 'How to verify your account',
    category: 'Account',
    icon: HelpCircle,
    description: 'Step-by-step verification guide',
  },
  {
    title: 'Deposit and withdrawal methods',
    category: 'Payments',
    icon: CreditCard,
    description: 'Available payment options',
  },
  {
    title: 'Trading platform tutorial',
    category: 'Trading',
    icon: Book,
    description: 'Learn to use our trading tools',
  },
];

export function KnowledgeBase() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Knowledge Base</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map((article, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start space-x-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <article.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">{article.title}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{article.description}</p>
                  <Badge variant="secondary" className="text-xs">
                    {article.category}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}