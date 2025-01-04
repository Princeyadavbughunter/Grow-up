'use client'
import React, { useState } from 'react';
import { User, MessageSquare, Archive, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Message {
  id: number;
  text: string;
  timestamp: string;
  sender: string;
  isRead: boolean;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Summary: Hi, I am Aryan - Founder at...",
      timestamp: "1:05 am",
      sender: "Aryan Trivedi",
      isRead: false
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'You',
      isRead: true
    };
    
    setMessages([...messages, newMessage]);
    setInputMessage('');
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-80 border-r bg-white">
        <Tabs defaultValue="message" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="message">Message</TabsTrigger>
            <TabsTrigger value="archive">Archive</TabsTrigger>
            <TabsTrigger value="work">Work</TabsTrigger>
            <TabsTrigger value="request">Request</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="overflow-y-auto h-[calc(100vh-48px)]">
          {messages.map((msg, index) => (
            <div key={msg.id} className="p-4 hover:bg-gray-50 cursor-pointer border-b">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <img src="/api/placeholder/40/40" alt="avatar" className="rounded-full" />
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{msg.sender}</h3>
                    <span className="text-xs text-gray-500">{msg.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{msg.text}</p>
                </div>
                {!msg.isRead && (
                  <Badge variant="default" className="bg-purple-500">1</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b bg-white flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <img src="/api/placeholder/40/40" alt="avatar" className="rounded-full" />
            </Avatar>
            <h2 className="font-semibold">Aryan Trivedi</h2>
          </div>
          <div className="space-x-2">
            <Button variant="secondary" className="bg-purple-600 text-white hover:bg-purple-700">
              Accept Request
            </Button>
            <Button variant="outline">Deny</Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-lg p-3 ${
                msg.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}>
                <p>{msg.text}</p>
                <span className="text-xs mt-1 block opacity-70">{msg.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <form onSubmit={sendMessage} className="p-4 border-t bg-gray-50">
          <div className="flex items-center space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your text here"
              className="flex-1"
            />
            <Button type="submit" size="icon" className="bg-blue-500 hover:bg-blue-600">
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}