'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Shield, Clock, Award, Users, Globe } from 'lucide-react';
import Link from 'next/link';

export default function WhyStockSphereDaytradingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold">
            Why Choose StockSphereDaytrading?
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover what makes StockSphereDaytrading the preferred choice for traders worldwide. 
            Our platform combines cutting-edge technology with unmatched reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle className="text-white">Advanced Technology</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                State-of-the-art trading infrastructure with lightning-fast execution and real-time data feeds.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <Shield className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle className="text-white">Regulated & Secure</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Fully regulated by top-tier financial authorities with client fund protection and insurance.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <Clock className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle className="text-white">24/7 Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Round-the-clock customer support in multiple languages with dedicated account managers.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <Award className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle className="text-white">Award-Winning Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Industry-recognized trading technology with multiple awards for innovation and excellence.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <Users className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle className="text-white">Trusted by Millions</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Over 500,000 active traders trust our platform for their daily trading activities.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <Globe className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle className="text-white">Global Reach</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Access to global markets with competitive spreads and deep liquidity pools.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience the Difference?</h2>
          <p className="text-gray-300 mb-6">
            Join thousands of successful traders who have chosen StockSphereDaytrading
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
                Open Trading Account
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}