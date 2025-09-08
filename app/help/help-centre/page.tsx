'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Book, HelpCircle, Shield, CreditCard, Settings, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const helpCategories = [
  {
    icon: Book,
    title: 'Getting Started',
    description: 'Learn the basics of trading and platform usage',
    articles: 25,
    color: 'text-blue-500',
  },
  {
    icon: CreditCard,
    title: 'Deposits & Withdrawals',
    description: 'Information about funding your account',
    articles: 18,
    color: 'text-green-500',
  },
  {
    icon: Settings,
    title: 'Platform & Tools',
    description: 'How to use our trading platforms and tools',
    articles: 32,
    color: 'text-purple-500',
  },
  {
    icon: Shield,
    title: 'Account Security',
    description: 'Keep your account safe and secure',
    articles: 15,
    color: 'text-red-500',
  },
  {
    icon: HelpCircle,
    title: 'Trading Questions',
    description: 'Common trading questions and answers',
    articles: 28,
    color: 'text-orange-500',
  },
  {
    icon: MessageSquare,
    title: 'Account Management',
    description: 'Managing your trading account and settings',
    articles: 20,
    color: 'text-cyan-500',
  },
];

const popularArticles = [
  {
    title: 'How to open a trading account',
    category: 'Getting Started',
    views: '15.2K',
    helpful: 98,
  },
  {
    title: 'How to make your first deposit',
    category: 'Deposits & Withdrawals',
    views: '12.8K',
    helpful: 96,
  },
  {
    title: 'Understanding spreads and commissions',
    category: 'Trading Questions',
    views: '11.5K',
    helpful: 94,
  },
  {
    title: 'Setting up two-factor authentication',
    category: 'Account Security',
    views: '9.7K',
    helpful: 99,
  },
  {
    title: 'How to use MetaTrader 4',
    category: 'Platform & Tools',
    views: '18.3K',
    helpful: 97,
  },
  {
    title: 'Withdrawal processing times',
    category: 'Deposits & Withdrawals',
    views: '8.9K',
    helpful: 95,
  },
];

const quickLinks = [
  { title: 'Account Verification', href: '/help/account-verification' },
  { title: 'Trading Hours', href: '/help/trading-hours' },
  { title: 'Platform Downloads', href: '/platforms' },
  { title: 'Contact Support', href: '/support' },
  { title: 'Live Chat', href: '/support/chat' },
  { title: 'Submit Ticket', href: '/support' },
];

export default function HelpCentrePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = popularArticles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Help Centre
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to your questions, learn about our platform, and get the support you need 
            to succeed in your trading journey.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for help articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-4 text-lg"
              />
            </div>
          </div>
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {helpCategories.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <category.icon className={`h-5 w-5 ${category.color}`} />
                  </div>
                  <div>
                    <CardTitle>{category.title}</CardTitle>
                    <Badge variant="secondary">{category.articles} articles</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {category.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Popular Articles */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Popular Articles</CardTitle>
                <CardDescription>
                  Most viewed help articles and guides
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredArticles.map((article, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{article.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <Badge variant="outline">{article.category}</Badge>
                            <span>{article.views} views</span>
                            <span>{article.helpful}% found helpful</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Read →
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickLinks.map((link, index) => (
                  <Link key={index} href={link.href}>
                    <Button variant="ghost" className="w-full justify-start">
                      {link.title}
                    </Button>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Need More Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <div className="space-y-2">
                  <Link href="/support">
                    <Button className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Support
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Live Chat
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trading Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/education/overview">
                  <Button variant="ghost" className="w-full justify-start">
                    Trading Education
                  </Button>
                </Link>
                <Link href="/help/economic-calendar">
                  <Button variant="ghost" className="w-full justify-start">
                    Economic Calendar
                  </Button>
                </Link>
                <Link href="/markets">
                  <Button variant="ghost" className="w-full justify-start">
                    Market Analysis
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}