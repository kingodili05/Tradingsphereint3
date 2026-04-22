'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Monitor, Download, Shield, Users, Clock, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';

const teamviewerFeatures = [
  {
    icon: Monitor,
    title: 'Remote Screen Sharing',
    description: 'Share your screen with our support team for direct assistance',
  },
  {
    icon: Shield,
    title: 'Secure Connection',
    description: 'End-to-end encrypted connection ensures your data remains private',
  },
  {
    icon: Users,
    title: 'Expert Support',
    description: 'Get help from our experienced trading platform specialists',
  },
  {
    icon: Clock,
    title: 'Quick Resolution',
    description: 'Resolve technical issues faster with direct screen access',
  },
];

const supportSteps = [
  {
    step: '1',
    title: 'Download TeamViewer',
    description: 'Download and install TeamViewer QuickSupport on your device',
  },
  {
    step: '2',
    title: 'Get Your ID',
    description: 'Note down your TeamViewer ID and temporary password',
  },
  {
    step: '3',
    title: 'Contact Support',
    description: 'Call our support team and provide your TeamViewer details',
  },
  {
    step: '4',
    title: 'Get Assistance',
    description: 'Our expert will connect and help resolve your issue',
  },
];

export default function TeamViewerPage() {
  const [sessionData, setSessionData] = useState({
    teamviewerId: '',
    password: '',
    issue: '',
  });

  const handleSubmitSession = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Session request submitted! Our support team will connect shortly.');
    setSessionData({
      teamviewerId: '',
      password: '',
      issue: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
            TeamViewer Remote Support
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get instant technical support through secure screen sharing. Our experts can help you 
            resolve platform issues, set up trading tools, and optimize your trading environment.
          </p>
        </div>

        {/* TeamViewer Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {teamviewerFeatures.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Download Section */}
          <Card>
            <CardHeader>
              <CardTitle>Download TeamViewer</CardTitle>
              <CardDescription>
                Download the appropriate version for your operating system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Monitor className="h-6 w-6 text-blue-600" />
                    <div>
                      <div className="font-semibold">TeamViewer for Windows</div>
                      <div className="text-sm text-gray-600">Windows 7, 8, 10, 11</div>
                    </div>
                  </div>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Monitor className="h-6 w-6 text-blue-600" />
                    <div>
                      <div className="font-semibold">TeamViewer for Mac</div>
                      <div className="text-sm text-gray-600">macOS 10.14 or later</div>
                    </div>
                  </div>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Monitor className="h-6 w-6 text-blue-600" />
                    <div>
                      <div className="font-semibold">TeamViewer QuickSupport</div>
                      <div className="text-sm text-gray-600">No installation required</div>
                    </div>
                  </div>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Security Note</h4>
                    <p className="text-sm text-blue-800">
                      TeamViewer uses end-to-end encryption and is trusted by millions worldwide. 
                      Your privacy and security are guaranteed.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Request */}
          <Card>
            <CardHeader>
              <CardTitle>Request Support Session</CardTitle>
              <CardDescription>
                Already have TeamViewer? Submit your session details for immediate support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitSession} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="teamviewerId">TeamViewer ID</Label>
                  <Input
                    id="teamviewerId"
                    placeholder="Your TeamViewer ID (e.g., 123 456 789)"
                    value={sessionData.teamviewerId}
                    onChange={(e) => setSessionData({ ...sessionData, teamviewerId: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Temporary Password</Label>
                  <Input
                    id="password"
                    placeholder="Temporary password from TeamViewer"
                    value={sessionData.password}
                    onChange={(e) => setSessionData({ ...sessionData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issue">Describe Your Issue</Label>
                  <Textarea
                    id="issue"
                    placeholder="Please describe the technical issue you're experiencing..."
                    value={sessionData.issue}
                    onChange={(e) => setSessionData({ ...sessionData, issue: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Request Support Session
                </Button>
              </form>

              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <h4 className="font-semibold mb-2">Alternative Support Options</h4>
                <div className="space-y-2">
                  <Link href="/support">
                    <Button variant="outline" className="w-full justify-start">
                      Submit Support Ticket
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start">
                    Live Chat Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Phone Support: +1-913-282-3212
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-12">How TeamViewer Support Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {supportSteps.map((step, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                    {step.step}
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Support Hours */}
        <div className="mt-16 bg-gray-100 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Support Availability</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900">Live Support</h3>
              <p className="text-gray-600">Monday - Friday: 24/7</p>
              <p className="text-gray-600">Weekend: 24/7</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Response Time</h3>
              <p className="text-gray-600">Average: &lt; 5 minutes</p>
              <p className="text-gray-600">Peak hours: &lt; 2 minutes</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Languages</h3>
              <p className="text-gray-600">English, Spanish, French</p>
              <p className="text-gray-600">German, Italian, Portuguese</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}