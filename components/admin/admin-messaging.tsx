'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase-client';
import { Profile, Message } from '@/lib/database.types';
import { useAuth } from '@/hooks/use-auth';
import { Send, Users, User, MessageCircle, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminActions } from '@/hooks/use-admin-actions';

export function AdminMessaging() {
  const { user } = useAuth();
  const { sendMessage, loading: actionLoading } = useAdminActions();
  const [users, setUsers] = useState<Profile[]>([]);
  const [adminMessages, setAdminMessages] = useState<(Message & { profiles: Profile })[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [messageData, setMessageData] = useState({
    recipient_type: 'all',
    recipient_id: '',
    title: '',
    content: '',
    message_type: 'notification',
    is_important: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchAdminMessages();
  }, []);

  const fetchUsers = async () => {
    if (!supabase) return;

    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .order('full_name');

    if (data) {
      setUsers(data);
    }
  };

  const fetchAdminMessages = async () => {
    if (!supabase) return;

    const { data } = await supabase
      .from('messages')
      .select(`
        *,
        profiles!messages_sender_id_fkey (
          id,
          full_name,
          email
        )
      `)
      .not('sender_id', 'is', null)
      .order('created_at', { ascending: false });

    if (data) {
      setAdminMessages(data as any);
    }
  };

  const handleReplyToUser = async (recipientId: string, originalTitle: string) => {
    if (!user || !replyText.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          user_id: recipientId,
          sender_id: user.id,
          title: originalTitle.startsWith('Re:') ? originalTitle : `Re: ${originalTitle}`,
          content: replyText,
          message_type: 'admin',
          is_important: false,
        });

      if (error) throw error;
      
      toast.success('Reply sent successfully');
      setReplyText('');
      setSelectedConversation(null);
      await fetchAdminMessages();
    } catch (error: any) {
      toast.error('Failed to send reply: ' + error.message);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const result = await sendMessage(messageData, users, user.id);
    
    if (result.success) {
      // Reset form
      setMessageData({
        recipient_type: 'all',
        recipient_id: '',
        title: '',
        content: '',
        message_type: 'notification',
        is_important: false,
      });
    }
  };

  // Group messages by user conversation
  const groupedConversations = adminMessages.reduce((acc, message) => {
    const senderId = message.sender_id!;
    const baseTitle = message.title.replace(/^Re:\s*/, '');
    const conversationKey = `${senderId}_${baseTitle}`;
    
    if (!acc[conversationKey]) {
      acc[conversationKey] = {
        user: (message.profiles as any),
        title: baseTitle,
        messages: [],
        lastMessage: message,
      };
    }
    
    acc[conversationKey].messages.push(message);
    if (new Date(message.created_at) > new Date(acc[conversationKey].lastMessage.created_at)) {
      acc[conversationKey].lastMessage = message;
    }
    
    return acc;
  }, {} as Record<string, { user: Profile, title: string, messages: Message[], lastMessage: Message }>);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Send Message Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Send className="h-5 w-5" />
            <span>Send Message</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div className="space-y-2">
              <Label>Recipient</Label>
              <Select 
                value={messageData.recipient_type} 
                onValueChange={(value) => setMessageData({...messageData, recipient_type: value, recipient_id: ''})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="specific">Specific User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {messageData.recipient_type === 'specific' && (
              <div className="space-y-2">
                <Label>Select User</Label>
                <Select 
                  value={messageData.recipient_id} 
                  onValueChange={(value) => setMessageData({...messageData, recipient_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.full_name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Message Type</Label>
              <Select 
                value={messageData.message_type} 
                onValueChange={(value) => setMessageData({...messageData, message_type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="notification">Notification</SelectItem>
                  <SelectItem value="alert">Alert</SelectItem>
                  <SelectItem value="promotion">Promotion</SelectItem>
                  <SelectItem value="admin">Admin Message</SelectItem>
                  <SelectItem value="system">System Message</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="Message title"
                value={messageData.title}
                onChange={(e) => setMessageData({...messageData, title: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                placeholder="Message content"
                value={messageData.content}
                onChange={(e) => setMessageData({...messageData, content: e.target.value})}
                rows={6}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="important"
                checked={messageData.is_important}
                onChange={(e) => setMessageData({...messageData, is_important: e.target.checked})}
                className="rounded"
              />
              <Label htmlFor="important">Mark as important</Label>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={actionLoading}
            >
              {actionLoading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Message Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Templates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setMessageData({
              ...messageData,
              title: 'Welcome to TradingSphereIntl',
              content: 'Welcome to our trading platform! Your account has been successfully created and verified.',
              message_type: 'notification',
            })}
          >
            Welcome Message
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setMessageData({
              ...messageData,
              title: 'Account Verification Required',
              content: 'Please complete your account verification to unlock all trading features.',
              message_type: 'alert',
              is_important: true,
            })}
          >
            Verification Alert
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setMessageData({
              ...messageData,
              title: 'Special Trading Promotion',
              content: 'Limited time offer: Reduced spreads on all major currency pairs this week!',
              message_type: 'promotion',
            })}
          >
            Promotion Message
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setMessageData({
              ...messageData,
              title: 'System Maintenance Notice',
              content: 'Scheduled maintenance will occur this weekend. Trading will be temporarily unavailable.',
              message_type: 'system',
              is_important: true,
            })}
          >
            Maintenance Notice
          </Button>
        </CardContent>
      </Card>

      {/* Conversation Management */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>User Conversations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedConversations).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No user messages found</p>
            </div>
          ) : selectedConversation ? (
            <div className="space-y-4">
              {/* Conversation Header */}
              <div className="flex items-center justify-between pb-3 border-b">
                <div>
                  <h4 className="font-semibold">{groupedConversations[selectedConversation].title}</h4>
                  <p className="text-sm text-muted-foreground">
                    Conversation with {groupedConversations[selectedConversation].user.full_name}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedConversation(null)}
                >
                  Back to Conversations
                </Button>
              </div>

              {/* Message Thread */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {groupedConversations[selectedConversation].messages
                  .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                  .map((message) => {
                    const isFromUser = message.sender_id !== user?.id;
                    
                    return (
                      <div key={message.id} className={`flex ${isFromUser ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          isFromUser 
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100' 
                            : 'bg-blue-500 text-white'
                        }`}>
                          <div className="text-xs opacity-75 mb-1">
                            {isFromUser ? groupedConversations[selectedConversation].user.full_name : 'You'} • {new Date(message.created_at).toLocaleString()}
                          </div>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Reply Input */}
              <div className="flex space-x-2 pt-3 border-t">
                <Input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleReplyToUser(groupedConversations[selectedConversation].user.id, groupedConversations[selectedConversation].title);
                    }
                  }}
                />
                <Button 
                  size="sm" 
                  onClick={() => handleReplyToUser(groupedConversations[selectedConversation].user.id, groupedConversations[selectedConversation].title)}
                  disabled={sending || !replyText.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedConversations).map(([conversationId, conversation]) => (
                <div 
                  key={conversationId}
                  className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  onClick={() => setSelectedConversation(conversationId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {conversation.user.full_name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">{conversation.user.full_name}</h4>
                        <p className="text-sm text-muted-foreground">{conversation.title}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{conversation.messages.length}</Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(conversation.lastMessage.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}