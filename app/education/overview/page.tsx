'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Video, FileText, Users, TrendingUp, BarChart3, Globe, Award } from 'lucide-react';
import Link from 'next/link';

const educationCategories = [
  {
    icon: BookOpen,
    title: 'Trading Basics',
    description: 'Learn the fundamentals of trading and financial markets',
    courses: 12,
    level: 'Beginner',
    color: 'text-blue-500',
  },
  {
    icon: TrendingUp,
    title: 'Technical Analysis',
    description: 'Master chart patterns, indicators, and trading strategies',
    courses: 18,
    level: 'Intermediate',
    color: 'text-green-500',
  },
  {
    icon: BarChart3,
    title: 'Fundamental Analysis',
    description: 'Understand economic factors that drive market movements',
    courses: 15,
    level: 'Intermediate',
    color: 'text-purple-500',
  },
  {
    icon: Globe,
    title: 'Market Specific',
    description: 'Specialized courses for Forex, Crypto, Stocks, and Commodities',
    courses: 24,
    level: 'All Levels',
    color: 'text-orange-500',
  },
];

const learningFormats = [
  {
    icon: Video,
    title: 'Video Tutorials',
    description: 'Step-by-step video lessons with practical examples',
    count: '150+ videos',
  },
  {
    icon: FileText,
    title: 'Written Guides',
    description: 'Comprehensive written materials and trading guides',
    count: '80+ articles',
  },
  {
    icon: Users,
    title: 'Live Webinars',
    description: 'Interactive sessions with professional traders',
    count: 'Weekly sessions',
  },
  {
    icon: Award,
    title: 'Certification',
    description: 'Earn certificates upon course completion',
    count: '12 certificates',
  },
];

const featuredCourses = [
  {
    title: 'Complete Forex Trading Course',
    description: 'Master forex trading from basics to advanced strategies',
    duration: '8 hours',
    level: 'Beginner to Advanced',
    rating: 4.8,
    students: 15420,
  },
  {
    title: 'Cryptocurrency Trading Masterclass',
    description: 'Learn to trade Bitcoin, Ethereum, and altcoins professionally',
    duration: '6 hours',
    level: 'Intermediate',
    rating: 4.9,
    students: 12350,
  },
  {
    title: 'Technical Analysis Fundamentals',
    description: 'Essential technical analysis skills for all markets',
    duration: '10 hours',
    level: 'Beginner',
    rating: 4.7,
    students: 18920,
  },
  {
    title: 'Risk Management Strategies',
    description: 'Protect your capital with professional risk management',
    duration: '4 hours',
    level: 'All Levels',
    rating: 4.9,
    students: 9870,
  },
];

export default function EducationOverviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold">
            Trading Education
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Master the art of trading with our comprehensive educational resources. 
            From beginner basics to advanced strategies, we provide everything you need to succeed.
          </p>
        </div>

        {/* Education Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {educationCategories.map((category, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:border-green-500 transition-colors">
              <CardHeader>
                <category.icon className={`h-8 w-8 ${category.color} mb-2`} />
                <CardTitle className="text-white">{category.title}</CardTitle>
                <CardDescription className="text-gray-300">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Courses</span>
                    <span className="text-white">{category.courses}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Level</span>
                    <span className="text-green-400">{category.level}</span>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-green-500 hover:bg-green-600 text-black">
                  Start Learning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Learning Formats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {learningFormats.map((format, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 text-center">
              <CardHeader>
                <format.icon className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <CardTitle className="text-white">{format.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 mb-4">
                  {format.description}
                </CardDescription>
                <div className="text-green-400 font-semibold">{format.count}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Courses */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredCourses.map((course, index) => (
              <Card key={index} className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">{course.title}</CardTitle>
                  <CardDescription className="text-gray-300">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Duration</div>
                      <div className="text-white">{course.duration}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Level</div>
                      <div className="text-white">{course.level}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Rating</div>
                      <div className="text-yellow-400">★ {course.rating}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Students</div>
                      <div className="text-white">{course.students.toLocaleString()}</div>
                    </div>
                  </div>
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-black">
                    Start Course
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Learning Path */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Your Learning Path</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">1</div>
              <h3 className="font-semibold text-white mb-2">Trading Basics</h3>
              <p className="text-gray-300 text-sm">Learn fundamental concepts and market basics</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">2</div>
              <h3 className="font-semibold text-white mb-2">Technical Analysis</h3>
              <p className="text-gray-300 text-sm">Master chart reading and technical indicators</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">3</div>
              <h3 className="font-semibold text-white mb-2">Risk Management</h3>
              <p className="text-gray-300 text-sm">Learn to protect and manage your capital</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">4</div>
              <h3 className="font-semibold text-white mb-2">Advanced Strategies</h3>
              <p className="text-gray-300 text-sm">Develop sophisticated trading strategies</p>
            </div>
          </div>
        </div>

        {/* Educational Resources */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-white mb-2">Trading Glossary</h3>
              <p className="text-gray-300 text-sm mb-4">Comprehensive dictionary of trading terms</p>
              <Button variant="outline" className="border-gray-500 text-white hover:bg-gray-600">
                Browse Glossary
              </Button>
            </div>
            <div className="text-center p-4">
              <BarChart3 className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-white mb-2">Market Analysis</h3>
              <p className="text-gray-300 text-sm mb-4">Daily market insights and analysis</p>
              <Button variant="outline" className="border-gray-500 text-white hover:bg-gray-600">
                Read Analysis
              </Button>
            </div>
            <div className="text-center p-4">
              <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold text-white mb-2">Trading Community</h3>
              <p className="text-gray-300 text-sm mb-4">Connect with other traders and experts</p>
              <Button variant="outline" className="border-gray-500 text-white hover:bg-gray-600">
                Join Community
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your Trading Education</h2>
          <p className="text-gray-300 mb-6">
            Begin your journey to becoming a successful trader with our comprehensive education program
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
                Access Free Education
              </Button>
            </Link>
            <Link href="/education/advantages-of-forex">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                Start with Forex Basics
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}