'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, Download, Globe } from 'lucide-react';
import Link from 'next/link';

export default function WebTraderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold">
            WebTrader Platform
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Trade directly from your browser with our advanced WebTrader platform. 
            No downloads required - access all markets instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black px-8 py-4">
                Launch WebTrader
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-4">
                Login to Trade
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <Monitor className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle className="text-white">Browser-Based</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                No downloads needed. Trade directly from any web browser on any device.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <Smartphone className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle className="text-white">Mobile Optimized</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Fully responsive design that works perfectly on mobile and tablet devices.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <Globe className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle className="text-white">Global Access</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Access your trading account from anywhere in the world, 24/7.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <Download className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle className="text-white">Instant Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Start trading immediately with no installation or configuration required.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Trading?</h2>
          <p className="text-gray-300 mb-6">
            Join thousands of traders using our WebTrader platform
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
              Open Trading Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}