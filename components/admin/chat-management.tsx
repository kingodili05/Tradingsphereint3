'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, User, Clock, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'admin';
  timestamp: Date;
  senderName?: string;
}

interface ChatConversation {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: 'active' | 'waiting' | 'closed';
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
}

// Mock chat conversations
const mockConversations: ChatConversation[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    status: 'waiting',
    lastMessage: 'I need help with my withdrawal',
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
    unreadCount: 2,
    messages: [
      {
        id: '1',
        text: 'Hello! Welcome to TradingSphereIntl. How can I help you today?',
        sender: 'admin',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        senderName: 'Support Agent',
      },
      {
        id: '2',
        text: 'Hi, I need help with my withdrawal. It\'s been pending for 2 days.',
        sender: 'user',
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
      },
      {
        id: '3',
        text: 'I need help with my withdrawal',
        sender: 'user',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
      },
    ],
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Sarah Smith',
    userEmail: 'sarah@example.com',
    status: 'active',
    lastMessage: 'Thank you for your help!',
    lastMessageTime: new Date(Date.now() - 15 * 60 * 1000),
    unreadCount: 0,
    messages: [
      {
        id: '1',
        text: 'Hello! Welcome to TradingSphereIntl. How can I help you today?',
        sender: 'admin',
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        senderName: 'Support Agent',
      },
      {
        id: '2',
        text: 'I\'m having trouble accessing my account',
        sender: 'user',
        timestamp: new Date(Date.now() - 18 * 60 * 1000),
      },
      {
        id: '3',
        text: 'I can help you with that. Can you please provide your account email?',
        sender: 'admin',
        timestamp: new Date(Date.now() - 16 * 60 * 1000),
        senderName: 'Support Agent',
      },
      {
        id: '4',
        text: 'Thank you for your help!',
        sender: 'user',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
      },
    ],
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Mike Johnson',
    userEmail: 'mike@example.com',
    status: 'closed',
    lastMessage: 'Issue resolved, thanks!',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 0,
    messages: [
      {
        id: '1',
        text: 'Hello! Welcome to TradingSphereIntl. How can I help you today?',
        sender: 'admin',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        senderName: 'Support Agent',
      },
      {
        id: '2',
        text: 'I need help with platform setup',
        sender: 'user',
        timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
      },
      {
        id: '3',
        text: 'Issue resolved, thanks!',
        sender: 'user',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    ],
  },
];

export function ChatManagement() {
  const [conversations, setConversations] = useState<ChatConversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const adminMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'admin',
      timestamp: new Date(),
      senderName: 'Admin',
    };

    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation.id
          ? {
              ...conv,
              messages: [...conv.messages, adminMessage],
              lastMessage: newMessage,
              lastMessageTime: new Date(),
              status: 'active' as const,
            }
          : conv
      )
    );

    setSelectedConversation(prev =>
      prev ? { ...prev, messages: [...prev.messages, adminMessage] } : null
    );

    setNewMessage('');
  };

  const handleConversationSelect = (conversation: ChatConversation) => {
    setSelectedConversation(conversation);
    // Mark as read
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  const handleStatusChange = (conversationId: string, status: 'active' | 'waiting' | 'closed') => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId ? { ...conv, status } : conv
      )
    );
  };

  const filteredConversations = conversations.filter(conv =>
    conv.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-red-500';
      case 'active': return 'bg-green-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Conversations List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Live Chat Conversations</span>
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            <div className="space-y-2 p-4">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleConversationSelect(conversation)}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-colors",
                    selectedConversation?.id === conversation.id
                      ? "bg-blue-50 border-blue-200"
                      : "hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder-avatar.png" />
                        <AvatarFallback>{conversation.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{conversation.userName}</div>
                        <div className="text-xs text-gray-500">{conversation.userEmail}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(conversation.status)}>
                        {conversation.status}
                      </Badge>
                      {conversation.unreadCount > 0 && (
                        <Badge className="bg-red-500 text-white">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 truncate mb-1">
                    {conversation.lastMessage}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {conversation.lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="lg:col-span-2">
        {selectedConversation ? (
          <>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="/placeholder-avatar.png" />
                  <AvatarFallback>{selectedConversation.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{selectedConversation.userName}</CardTitle>
                  <div className="text-sm text-gray-500">{selectedConversation.userEmail}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedConversation.status}
                  onChange={(e) => handleStatusChange(selectedConversation.id, e.target.value as any)}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="waiting">Waiting</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col h-[400px] p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.sender === 'admin' ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg p-3 text-sm",
                          message.sender === 'admin'
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-900"
                        )}
                      >
                        {message.sender === 'admin' && message.senderName && (
                          <div className="text-xs text-blue-100 mb-1 flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {message.senderName}
                          </div>
                        )}
                        <div>{message.text}</div>
                        <div className={cn(
                          "text-xs mt-1",
                          message.sender === 'admin' ? "text-blue-100" : "text-gray-500"
                        )}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your response..."
                    className="flex-1"
                  />
                  <Button type="submit" size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-[500px]">
            <div className="text-center text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No Conversation Selected</h3>
              <p>Select a conversation from the list to start chatting with clients</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}