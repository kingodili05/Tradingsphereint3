'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Message } from '@/lib/database.types';
import { useMessages } from '@/hooks/use-messages';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase-client';
import { Mail, MailOpen, AlertTriangle, Info, Star, Send, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface MessagesPanelProps {
  messages: Message[];
  loading: boolean;
}

export function MessagesPanel({ messages, loading }: MessagesPanelProps) {
  const { markAsRead } = useMessages();
  const { user } = useAuth();
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const getMessageIcon = (type: string, isRead: boolean) => {
    if (!isRead) return Mail;
    
    switch (type) {
      case 'alert': return AlertTriangle;
      case 'promotion': return Star;
      case 'admin': return Info;
      default: return MailOpen;
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'alert': return 'bg-red-500';
      case 'promotion': return 'bg-purple-500';
      case 'admin': return 'bg-blue-500';
      case 'system': return 'bg-gray-500';
      default: return 'bg-green-500';
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    await markAsRead(messageId);
  };

  const handleSendReply = async (originalMessage: Message) => {
    if (!user || !replyText.trim()) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          user_id: originalMessage.sender_id || 'admin', // Send to the original sender (admin)
          sender_id: user.id,
          title: `Re: ${originalMessage.title}`,
          content: replyText,
          message_type: 'admin',
          is_important: false,
        });

      if (error) throw error;
      
      toast.success('Reply sent successfully');
      setReplyText('');
      setReplyingTo(null);
    } catch (error: any) {
      toast.error('Failed to send reply: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  // Group messages into conversations by title thread
  const groupedMessages = messages.reduce((acc, message) => {
    const baseTitle = message.title.replace(/^Re:\s*/, '');
    if (!acc[baseTitle]) {
      acc[baseTitle] = [];
    }
    acc[baseTitle].push(message);
    return acc;
  }, {} as Record<string, Message[]>);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse border rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Messages</span>
          <Badge variant="secondary">{messages.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No messages found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedMessages).map(([threadTitle, threadMessages]) => {
              const sortedMessages = threadMessages.sort((a, b) => 
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
              );
              const hasUnread = threadMessages.some(m => !m.is_read);
              const latestMessage = sortedMessages[sortedMessages.length - 1];
              
              return (
                <div 
                  key={threadTitle} 
                  className={`border rounded-lg p-4 space-y-4 ${hasUnread ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className={`h-5 w-5 ${hasUnread ? 'text-blue-600' : 'text-muted-foreground'}`} />
                      <h4 className={`font-medium ${hasUnread ? 'font-semibold' : ''}`}>
                        {threadTitle}
                      </h4>
                    </div>
                    <Badge className={getMessageTypeColor(latestMessage.message_type)}>
                      {threadMessages.length} message{threadMessages.length > 1 ? 's' : ''}
                    </Badge>
                  </div>

                  {/* Conversation Thread */}
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {sortedMessages.map((message) => {
                      const isFromUser = message.sender_id === user?.id;
                      
                      return (
                        <div key={message.id} className={`flex ${isFromUser ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-3 rounded-lg ${
                            isFromUser 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                          }`}>
                            <div className="text-xs opacity-75 mb-1">
                              {isFromUser ? 'You' : 'Admin'} • {new Date(message.created_at).toLocaleString()}
                            </div>
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Reply Input */}
                  {replyingTo === threadTitle ? (
                    <div className="space-y-3 pt-3 border-t">
                      <div className="flex space-x-2">
                        <Input
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your reply..."
                          onKeyPress={(e) => e.key === 'Enter' && handleSendReply(latestMessage)}
                        />
                        <Button 
                          size="sm" 
                          onClick={() => handleSendReply(latestMessage)}
                          disabled={sending || !replyText.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setReplyingTo(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center pt-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setReplyingTo(threadTitle)}
                      >
                        Reply
                      </Button>
                      {hasUnread && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            threadMessages
                              .filter(m => !m.is_read)
                              .forEach(m => handleMarkAsRead(m.id));
                          }}
                        >
                          Mark All Read
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}