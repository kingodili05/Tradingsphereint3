'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { TrendingUp, Menu, X, ChevronDown } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Don't show navbar on dashboard or admin pages
  const isDashboardPage = pathname?.startsWith('/dashboard') || 
                          pathname?.startsWith('/admin') || 
                          pathname?.includes('/trade-real-account') ||
                          pathname?.includes('/deposit') ||
                          pathname?.includes('/withdraw') ||
                          pathname?.includes('/editprofile') ||
                          pathname?.includes('/markets') ||
                          pathname?.includes('/finance') ||
                          pathname?.includes('/signals') ||
                          pathname?.includes('/support') ||
                          pathname?.includes('/company') ||
                          pathname?.includes('/education') ||
                          pathname?.includes('/help') ||
                          pathname?.includes('/user-finance') ||
                          pathname?.includes('/user-signals') ||
                          pathname?.includes('/user-support') ||
                          pathname?.includes('/user-trading') ||
                          pathname?.includes('/user-portfolio') ||
                          pathname?.includes('/user-profile') ||
                          pathname?.includes('/user-mailbox') ||
                          pathname?.includes('/user-verification') ||
                          pathname?.includes('/user-deposit') ||
                          pathname?.includes('/user-withdraw') ||
                          pathname?.includes('/user-messages') ||
                          pathname?.includes('/user-editprofile') ||
                          pathname?.includes('/user-change-password') ||
                          pathname?.includes('/user-packages') ||
                          pathname?.includes('/change-password');

  if (isDashboardPage) {
    return null;
  }

  const quickstartItems = [
    { name: 'Forex Trading', href: '/quickstart/forex-trading' },
    { name: 'What You Can Trade', href: '/quickstart/what-you-can-trade' },
    { name: 'Simple Pricing', href: '/quickstart/simple-pricing' },
  ];

  const tradingItems = [
    { name: 'Accounts Overview', href: '/trading/accounts-overview' },
    { name: 'Trading Conditions', href: '/trading/conditions' },
    { name: 'Raw Spread', href: '/trading/raw-spread' },
    { name: 'Standard', href: '/trading/standard' },
    { name: 'cTrader Raw Spread', href: '/trading/ctrader-raw-spread' },
    { name: 'Live Spreads', href: '/trading/spreads' },
  ];

  const platformsItems = [
    { name: 'MetaTrader 4', href: '/platforms/metatrader-4' },
    { name: 'MetaTrader 5', href: '/platforms/metatrader-5' },
    { name: 'cTrader', href: '/platforms/ctrader' },
    { name: 'cTrader Web', href: '/platforms/ctrader-web' },
    { name: 'WebTrader', href: '/webtrader' },
    { name: 'VPS', href: '/platforms/vps' },
    { name: 'MT4 Advanced Tools', href: '/platforms/mt4-advanced-tools' },
    { name: 'Myfxbook AutoTrade', href: '/platforms/myfxbook-autotrade' },
  ];

  const moreItems = [
    { name: 'Range of Markets', href: '/markets/range-of-markets' },
    { name: 'About Us', href: '/company/about' },
    { name: 'Contact', href: '/company/contact' },
    { name: 'Regulation', href: '/company/regulation' },
    { name: 'Insurance', href: '/company/insurance' },
    { name: 'Education', href: '/education/overview' },
    { name: 'Help Centre', href: '/help/help-centre' },
    { name: 'TeamViewer', href: '/help/teamviewer' },
    { name: 'Economic Calendar', href: '/help/economic-calendar' },
  ];

  return (
    <>
      {/* Top Utility Bar */}
      <div className="bg-gray-800 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10">
            <div className="flex items-center space-x-6">
              <Link href="/webtrader" className="hover:text-gray-300 transition-colors">
                WebTrader
              </Link>
              <Link href="/start-trading" className="hover:text-gray-300 transition-colors">
                Start Trading
              </Link>
              <Link href="/auth/signup" className="hover:text-gray-300 transition-colors">
                Open an Account
              </Link>
              <Link href="/contact" className="hover:text-gray-300 transition-colors">
                Contact Us
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">GB</span>
              <span className="text-gray-300">EN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-gray-900 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <span className="font-bold text-xl text-white">TradingSphereIntl</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {/* Quickstart Dropdown */}
                <div className="relative group">
                  <button className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                    Quickstart
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      {quickstartItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Trading Dropdown */}
                <div className="relative group">
                  <button className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                    Trading
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      {tradingItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Platforms Dropdown */}
                <div className="relative group">
                  <button className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                    platforms
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      {platformsItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* More Dropdown */}
                <div className="relative group">
                  <button className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                    More
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      {moreItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-gray-300 hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-green-500 hover:bg-green-600 text-black">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-300 hover:text-white"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-700">
                <div className="space-y-1">
                  <div className="text-gray-400 text-xs uppercase tracking-wider px-3 py-2">Quickstart</div>
                  {quickstartItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                
                <div className="space-y-1">
                  <div className="text-gray-400 text-xs uppercase tracking-wider px-3 py-2">Trading</div>
                  {tradingItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                <div className="space-y-1">
                  <div className="text-gray-400 text-xs uppercase tracking-wider px-3 py-2">Platforms</div>
                  {platformsItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                <div className="space-y-1">
                  <div className="text-gray-400 text-xs uppercase tracking-wider px-3 py-2">More</div>
                  {moreItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-700 space-y-2">
                  <Link href="/auth/login">
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-black">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}