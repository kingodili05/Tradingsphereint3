'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, FileText, Globe, Award, Check, Download } from 'lucide-react';
import Link from 'next/link';

const regulatoryBodies = [
  {
    name: 'Financial Conduct Authority (FCA)',
    country: 'United Kingdom',
    license: 'FRN: 123456',
    description: 'Authorized and regulated by the UK\'s premier financial regulator',
    logo: '🇬🇧',
  },
  {
    name: 'Cyprus Securities and Exchange Commission (CySEC)',
    country: 'Cyprus',
    license: 'License No: 123/45',
    description: 'Licensed investment firm under MiFID II regulations',
    logo: '🇨🇾',
  },
  {
    name: 'Australian Securities and Investments Commission (ASIC)',
    country: 'Australia',
    license: 'AFSL: 123456',
    description: 'Australian Financial Services License holder',
    logo: '🇦🇺',
  },
  {
    name: 'Monetary Authority of Singapore (MAS)',
    country: 'Singapore',
    license: 'CMS License: 123456',
    description: 'Capital Markets Services License for dealing in securities',
    logo: '🇸🇬',
  },
];

const complianceFeatures = [
  'Segregated client funds in tier-1 banks',
  'Negative balance protection',
  'Comprehensive insurance coverage',
  'Regular third-party audits',
  'Anti-money laundering (AML) compliance',
  'Know Your Customer (KYC) procedures',
  'Data protection and privacy compliance',
  'Risk management and monitoring systems',
];

const protectionMeasures = [
  {
    icon: Shield,
    title: 'Client Fund Protection',
    description: 'All client funds are held in segregated accounts with top-tier banks, separate from company operational funds.',
  },
  {
    icon: FileText,
    title: 'Regulatory Compliance',
    description: 'We maintain strict compliance with all applicable regulations and undergo regular regulatory examinations.',
  },
  {
    icon: Globe,
    title: 'International Standards',
    description: 'Our operations meet international regulatory standards including MiFID II, GDPR, and local requirements.',
  },
  {
    icon: Award,
    title: 'Insurance Coverage',
    description: 'Comprehensive professional indemnity and cyber liability insurance to protect client interests.',
  },
];

export default function RegulationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold">
            Regulation & Compliance
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            TradingSphereIntl operates under strict regulatory oversight to ensure the highest 
            standards of client protection, fund security, and operational transparency.
          </p>
        </div>

        {/* Regulatory Bodies */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Regulatory Licenses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {regulatoryBodies.map((regulator, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{regulator.logo}</div>
                    <div>
                      <CardTitle className="text-white">{regulator.name}</CardTitle>
                      <CardDescription className="text-gray-300">{regulator.country}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-gray-700 rounded-lg p-3">
                    <div className="text-sm text-gray-400">License Number</div>
                    <div className="font-semibold text-green-400">{regulator.license}</div>
                  </div>
                  <p className="text-gray-300 text-sm">{regulator.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Protection Measures */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {protectionMeasures.map((measure, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 text-center">
              <CardHeader>
                <measure.icon className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <CardTitle className="text-white">{measure.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  {measure.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Compliance Features */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Compliance Framework</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-green-400">Our Commitment</h3>
              <p className="text-gray-300 leading-relaxed">
                TradingSphereIntl is committed to maintaining the highest standards of regulatory 
                compliance and client protection. We work closely with regulators to ensure our 
                operations meet and exceed industry standards.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Our compliance framework is designed to protect client interests while providing 
                transparent and fair trading conditions. We regularly review and update our 
                procedures to align with evolving regulatory requirements.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-green-400">Compliance Features</h3>
              <div className="space-y-3">
                {complianceFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory Documents */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Regulatory Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <FileText className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle className="text-white">Terms of Business</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 mb-4">
                  Complete terms and conditions for trading services
                </CardDescription>
                <Button variant="outline" className="w-full border-gray-500 text-white hover:bg-gray-600">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <FileText className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle className="text-white">Risk Disclosure</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 mb-4">
                  Important risk warnings and disclosures
                </CardDescription>
                <Button variant="outline" className="w-full border-gray-500 text-white hover:bg-gray-600">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <FileText className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle className="text-white">Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 mb-4">
                  How we collect, use, and protect your data
                </CardDescription>
                <Button variant="outline" className="w-full border-gray-500 text-white hover:bg-gray-600">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <FileText className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle className="text-white">Complaints Procedure</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 mb-4">
                  How to file complaints and our resolution process
                </CardDescription>
                <Button variant="outline" className="w-full border-gray-500 text-white hover:bg-gray-600">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <FileText className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle className="text-white">Order Execution Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 mb-4">
                  Our commitment to best execution practices
                </CardDescription>
                <Button variant="outline" className="w-full border-gray-500 text-white hover:bg-gray-600">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <FileText className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle className="text-white">Conflict of Interest Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 mb-4">
                  How we manage potential conflicts of interest
                </CardDescription>
                <Button variant="outline" className="w-full border-gray-500 text-white hover:bg-gray-600">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Questions About Regulation?</h2>
          <p className="text-gray-300 mb-6">
            Our compliance team is available to answer any questions about our regulatory status
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/company/contact">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
                Contact Compliance Team
              </Button>
            </Link>
            <Link href="/help/help-centre">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                Visit Help Centre
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}