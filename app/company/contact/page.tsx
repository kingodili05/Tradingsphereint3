'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, MapPin, Clock, MessageSquare, Headphones, Shield } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CompanyContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Contact StockSphereDaytrading
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with our team. We're here to help you with any questions about trading, 
            our platform, or how to get started with StockSphereDaytrading.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and our team will get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="account">Account Support</SelectItem>
                          <SelectItem value="trading">Trading Questions</SelectItem>
                          <SelectItem value="technical">Technical Issues</SelectItem>
                          <SelectItem value="partnership">Partnership Opportunities</SelectItem>
                          <SelectItem value="media">Media Inquiries</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please describe your inquiry in detail..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Phone Support</div>
                    <div className="text-sm text-muted-foreground">+1-913-282-3212</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Email Support</div>
                    <div className="text-sm text-muted-foreground">support@tradingsphereint.online</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Live Chat</div>
                    <div className="text-sm text-muted-foreground">Available 24/7 on our platform</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Headquarters</div>
                    <div className="text-sm text-muted-foreground">
                    786 Eddy St<br />
                      Providence, Rhode Island 02905<br />
                      United States
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Support Hours</div>
                    <div className="text-sm text-muted-foreground">24/7 Available</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Offices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-medium">London Office</div>
                  <div className="text-sm text-muted-foreground">
                    25 Old Broad Street<br />
                    London EC2N 1HQ<br />
                    United Kingdom
                  </div>
                </div>
                <div>
                  <div className="font-medium">Singapore Office</div>
                  <div className="text-sm text-muted-foreground">
                    1 Raffles Place<br />
                    Singapore 048616<br />
                    Singapore
                  </div>
                </div>
                <div>
                  <div className="font-medium">Sydney Office</div>
                  <div className="text-sm text-muted-foreground">
                    Level 25, 201 Elizabeth Street<br />
                    Sydney NSW 2000<br />
                    Australia
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/help/help-centre">
                  <Button variant="ghost" className="w-full justify-start">
                    <Headphones className="h-4 w-4 mr-2" />
                    Help Centre
                  </Button>
                </Link>
                <Link href="/support">
                  <Button variant="ghost" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Submit Support Ticket
                  </Button>
                </Link>
                <Link href="/education/overview">
                  <Button variant="ghost" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Trading Education
                  </Button>
                </Link>
                <Link href="/company/regulation">
                  <Button variant="ghost" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Regulation & Compliance
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