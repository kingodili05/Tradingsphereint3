'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

const economicEvents = [
  {
    time: '08:30',
    currency: 'USD',
    event: 'Non-Farm Payrolls',
    impact: 'high',
    forecast: '185K',
    previous: '199K',
    actual: '187K',
    flag: '🇺🇸',
  },
  {
    time: '10:00',
    currency: 'EUR',
    event: 'ECB Interest Rate Decision',
    impact: 'high',
    forecast: '4.50%',
    previous: '4.50%',
    actual: '-',
    flag: '🇪🇺',
  },
  {
    time: '12:30',
    currency: 'GBP',
    event: 'GDP Growth Rate',
    impact: 'medium',
    forecast: '0.2%',
    previous: '0.1%',
    actual: '-',
    flag: '🇬🇧',
  },
  {
    time: '14:00',
    currency: 'CAD',
    event: 'Bank of Canada Rate Decision',
    impact: 'high',
    forecast: '5.00%',
    previous: '5.00%',
    actual: '-',
    flag: '🇨🇦',
  },
  {
    time: '15:30',
    currency: 'USD',
    event: 'Federal Reserve Chair Speech',
    impact: 'medium',
    forecast: '-',
    previous: '-',
    actual: '-',
    flag: '🇺🇸',
  },
  {
    time: '23:50',
    currency: 'JPY',
    event: 'Bank of Japan Rate Decision',
    impact: 'high',
    forecast: '-0.10%',
    previous: '-0.10%',
    actual: '-',
    flag: '🇯🇵',
  },
];

const upcomingEvents = [
  {
    date: 'Tomorrow',
    events: [
      { time: '08:30', currency: 'USD', event: 'CPI Inflation Rate', impact: 'high' },
      { time: '10:00', currency: 'EUR', event: 'Industrial Production', impact: 'medium' },
      { time: '14:00', currency: 'GBP', event: 'Retail Sales', impact: 'medium' },
    ],
  },
  {
    date: 'This Week',
    events: [
      { time: 'Wed 08:30', currency: 'USD', event: 'FOMC Meeting Minutes', impact: 'high' },
      { time: 'Thu 12:00', currency: 'EUR', event: 'ECB Press Conference', impact: 'high' },
      { time: 'Fri 08:30', currency: 'USD', event: 'Unemployment Rate', impact: 'medium' },
    ],
  },
];

export default function EconomicCalendarPage() {
  const [selectedCurrency, setSelectedCurrency] = useState('all');
  const [selectedImpact, setSelectedImpact] = useState('all');

  const filteredEvents = economicEvents.filter(event => {
    const currencyMatch = selectedCurrency === 'all' || event.currency === selectedCurrency;
    const impactMatch = selectedImpact === 'all' || event.impact === selectedImpact;
    return currencyMatch && impactMatch;
  });

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Economic Calendar
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay informed about important economic events that can impact financial markets. 
            Plan your trading strategy around key economic releases and central bank decisions.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Currencies</SelectItem>
              <SelectItem value="USD">USD - US Dollar</SelectItem>
              <SelectItem value="EUR">EUR - Euro</SelectItem>
              <SelectItem value="GBP">GBP - British Pound</SelectItem>
              <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
              <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
              <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedImpact} onValueChange={setSelectedImpact}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by impact" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Impact Levels</SelectItem>
              <SelectItem value="high">High Impact</SelectItem>
              <SelectItem value="medium">Medium Impact</SelectItem>
              <SelectItem value="low">Low Impact</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Events */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <CardTitle>Today's Economic Events</CardTitle>
                </div>
                <CardDescription>
                  Key economic releases and events for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredEvents.map((event, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="font-semibold">{event.time}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{event.flag}</span>
                            <span className="font-medium">{event.currency}</span>
                          </div>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${getImpactColor(event.impact)}`}></div>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">{event.event}</h3>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Forecast</div>
                          <div className="font-medium">{event.forecast}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Previous</div>
                          <div className="font-medium">{event.previous}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Actual</div>
                          <div className={`font-medium ${event.actual !== '-' ? 'text-green-600' : 'text-gray-400'}`}>
                            {event.actual}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Impact Legend */}
            <Card>
              <CardHeader>
                <CardTitle>Impact Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">High Impact - Major market movement expected</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm">Medium Impact - Moderate market effect</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Low Impact - Minimal market influence</span>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((day, index) => (
                    <div key={index}>
                      <h3 className="font-semibold text-gray-900 mb-2">{day.date}</h3>
                      <div className="space-y-2">
                        {day.events.map((event, eventIndex) => (
                          <div key={eventIndex} className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${getImpactColor(event.impact)}`}></div>
                              <span>{event.time}</span>
                              <span className="font-medium">{event.currency}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trading Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Trading Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">High Impact Events</h4>
                    <p className="text-xs text-gray-600">Be cautious during high-impact news releases as volatility increases significantly.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">Trading Opportunities</h4>
                    <p className="text-xs text-gray-600">Economic events often create trading opportunities for prepared traders.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}