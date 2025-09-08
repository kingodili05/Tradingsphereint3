'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Shield, Clock, Award } from 'lucide-react';
import Link from 'next/link';

export default function StartTradingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold">
            Start Trading Today
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Begin your trading journey with TradingSphereIntl. Access global markets, 
            advanced tools, and professional support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Why Choose TradingSphereIntl?</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <TrendingUp className="h-6 w-6 text-green-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Advanced Trading Tools</h3>
                  <p className="text-blue-100">Professional charts, indicators, and analysis tools</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Shield className="h-6 w-6 text-green-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Regulated & Secure</h3>
                  <p className="text-blue-100">Fully regulated broker with client fund protection</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Clock className="h-6 w-6 text-green-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">24/7 Support</h3>
                  <p className="text-blue-100">Round-the-clock customer support in multiple languages</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Award className="h-6 w-6 text-green-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Award-Winning Platform</h3>
                  <p className="text-blue-100">Industry-recognized trading technology and execution</p>
                </div>
              </div>
            </div>
          </div>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Open Your Trading Account</CardTitle>
              <CardDescription className="text-blue-100">
                Get started in just 3 simple steps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">1</div>
                  <span>Complete registration form</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">2</div>
                  <span>Verify your identity</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">3</div>
                  <span>Fund your account and start trading</span>
                </div>
              </div>
              
              <Link href="/auth/signup">
                <Button className="w-full bg-green-500 hover:bg-green-600 text-black py-3">
                  Open Account Now
                </Button>
              </Link>
              
              <div className="text-center text-sm text-blue-100">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-green-400 hover:underline">
                  Login here
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Demo Account</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 mb-4">
                Practice trading with $10,000 virtual funds
              </CardDescription>
              <Button variant="outline" className="w-full border-green-500 text-green-500 hover:bg-green-500 hover:text-black">
                Try Demo
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Live Account</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 mb-4">
                Start trading with real money from $100
              </CardDescription>
              <Button className="w-full bg-green-500 hover:bg-green-600 text-black">
                Open Live Account
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Islamic Account</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 mb-4">
                Sharia-compliant trading accounts available
              </CardDescription>
              <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-black">
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}