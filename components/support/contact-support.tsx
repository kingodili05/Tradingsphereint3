'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase-client';

export function ContactSupport() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [ticketData, setTicketData] = useState({
    subject: '',
    category: '',
    priority: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !supabase) {
      toast.error('Please log in to submit a support ticket');
      return;
    }

    setLoading(true);

    try {
      // Create a support message
      const { error } = await supabase
        .from('messages')
        .insert({
          user_id: user.id,
          sender_id: user.id,
          title: `Support Ticket: ${ticketData.subject}`,
          content: `Category: ${ticketData.category}\nPriority: ${ticketData.priority}\n\nDescription:\n${ticketData.description}`,
          message_type: 'admin',
          is_important: ticketData.priority === 'urgent' || ticketData.priority === 'high',
        });

      if (error) throw error;
      
      toast.success('Support ticket submitted successfully!');
    } catch (error: any) {
      toast.error('Failed to submit ticket: ' + error.message);
    }

    setTicketData({
      subject: '',
      category: '',
      priority: '',
      description: '',
    });
    
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Support Ticket</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={ticketData.subject}
              onChange={(e) => setTicketData({ ...ticketData, subject: e.target.value })}
              placeholder="Brief description of your issue"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={ticketData.category} onValueChange={(value) => setTicketData({ ...ticketData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trading">Trading Issues</SelectItem>
                  <SelectItem value="account">Account Problems</SelectItem>
                  <SelectItem value="payment">Payment & Billing</SelectItem>
                  <SelectItem value="technical">Technical Support</SelectItem>
                  <SelectItem value="general">General Inquiry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={ticketData.priority} onValueChange={(value) => setTicketData({ ...ticketData, priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={ticketData.description}
              onChange={(e) => setTicketData({ ...ticketData, description: e.target.value })}
              placeholder="Please provide detailed information about your issue..."
              rows={6}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            {loading ? 'Submitting...' : 'Submit Ticket'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}