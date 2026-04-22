'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, FileText, DollarSign, Users, Check, Download } from 'lucide-react';
import Link from 'next/link';

const insuranceCoverage = [
  {
    type: 'Professional Indemnity Insurance',
    coverage: '$50 Million',
    provider: 'Lloyd\'s of London',
    description: 'Covers professional negligence and errors in service delivery',
  },
  {
    type: 'Cyber Liability Insurance',
    coverage: '$25 Million',
    provider: 'AIG Insurance',
    description: 'Protection against cyber attacks, data breaches, and system failures',
  },
  {
    type: 'Directors & Officers Insurance',
    coverage: '$20 Million',
    provider: 'Zurich Insurance',
    description: 'Coverage for management decisions and corporate governance',
  },
  {
    type: 'Client Money Insurance',
    coverage: '$100 Million',
    provider: 'Allianz Global',
    description: 'Additional protection for segregated client funds',
  },
];

const protectionFeatures = [
  'Segregated client accounts in tier-1 banks',
  'Comprehensive insurance coverage up to $100M',
  'Negative balance protection for all clients',
  'Regular independent audits and monitoring',
  'Compliance with international banking standards',
  'Secure data encryption and storage',
  'Professional indemnity coverage',
  'Cyber security protection measures',
];

const insuranceAdvantages = [
  {
    icon: Shield,
    title: 'Maximum Protection',
    description: 'Multi-layered insurance coverage providing comprehensive protection for all client funds and data',
  },
  {
    icon: DollarSign,
    title: 'Financial Security',
    description: 'Substantial insurance coverage ensures client funds are protected even in extreme circumstances',
  },
  {
    icon: Users,
    title: 'Client Priority',
    description: 'Client interests are always prioritized with segregated accounts and independent trustee oversight',
  },
  {
    icon: FileText,
    title: 'Transparent Coverage',
    description: 'Full disclosure of insurance arrangements and coverage details available to all clients',
  },
];

export default function InsurancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold">
            Insurance & Protection
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your funds and data are protected by comprehensive insurance coverage and 
            strict regulatory safeguards. Trade with confidence knowing your investments are secure.
          </p>
        </div>

        {/* Insurance Advantages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {insuranceAdvantages.map((advantage, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 text-center">
              <CardHeader>
                <advantage.icon className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <CardTitle className="text-white">{advantage.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  {advantage.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Insurance Coverage Details */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Insurance Coverage Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {insuranceCoverage.map((insurance, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">{insurance.type}</CardTitle>
                  <CardDescription className="text-gray-300">
                    Provider: {insurance.provider}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">{insurance.coverage}</div>
                    <div className="text-sm text-gray-300">Coverage Amount</div>
                  </div>
                  <p className="text-gray-300 text-sm">{insurance.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Protection Features */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Client Protection Features</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-green-400">How We Protect You</h3>
              <p className="text-gray-300 leading-relaxed">
                Client protection is at the heart of everything we do. Our comprehensive insurance 
                and protection framework ensures that your funds, data, and trading activities 
                are safeguarded at all times.
              </p>
              <p className="text-gray-300 leading-relaxed">
                We maintain segregated client accounts with top-tier banks, ensuring that client 
                funds are completely separate from company operational funds. This provides an 
                additional layer of protection beyond our insurance coverage.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-green-400">Protection Features</h3>
              <div className="space-y-3">
                {protectionFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fund Security */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Fund Security Measures</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-black" />
              </div>
              <h3 className="font-semibold text-white mb-2">Segregated Accounts</h3>
              <p className="text-gray-300 text-sm">
                Client funds are held in segregated accounts with tier-1 banks, completely separate from company funds
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-black" />
              </div>
              <h3 className="font-semibold text-white mb-2">Insurance Protection</h3>
              <p className="text-gray-300 text-sm">
                Comprehensive insurance coverage up to $100 million provides additional security for client funds
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-black" />
              </div>
              <h3 className="font-semibold text-white mb-2">Regular Audits</h3>
              <p className="text-gray-300 text-sm">
                Independent third-party audits ensure compliance and proper fund management at all times
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Trade with Complete Confidence</h2>
          <p className="text-gray-300 mb-6">
            Our comprehensive protection framework ensures your funds and data are always secure
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
                Open Protected Account
              </Button>
            </Link>
            <Link href="/company/regulation">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                View Regulation Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}