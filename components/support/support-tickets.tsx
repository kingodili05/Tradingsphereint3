'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, HelpCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase-client';
import { useQuery } from '@tanstack/react-query';
import { Message } from '@/lib/database.types';

export function SupportTickets() {
  const { user } = useAuth();

  // Fetch real support tickets from user messages with admin/support type
  const { data: tickets, isLoading } = useQuery({
    queryKey: ['user-support-tickets', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return [];
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.id)
        .eq('message_type', 'admin')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform messages into ticket format
      return (data || []).map(message => ({
        id: `#${message.id.slice(-5).toUpperCase()}`,
        subject: message.title.replace('Support Ticket: ', ''),
        status: message.is_read ? 'resolved' : 'open',
        priority: message.is_important ? 'high' : 'medium',
        created: new Date(message.created_at).toISOString().split('T')[0],
        updated: new Date(message.created_at).toISOString().split('T')[0],
        messageId: message.id,
      }));
    },
    enabled: !!user && !!supabase,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse border rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : !tickets || tickets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Support Tickets</h3>
            <p className="text-sm">You haven't submitted any support tickets yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{ticket.id}</div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        ticket.status === 'resolved' ? 'default' :
                        ticket.status === 'in-progress' ? 'secondary' : 'outline'
                      }
                    >
                      {ticket.status}
                    </Badge>
                    <Badge
                      variant={
                        ticket.priority === 'high' ? 'destructive' :
                        ticket.priority === 'medium' ? 'secondary' : 'outline'
                      }
                    >
                      {ticket.priority}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <div className="font-medium text-sm">{ticket.subject}</div>
                  <div className="text-xs text-muted-foreground">
                    Created: {ticket.created} • Updated: {ticket.updated}
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}