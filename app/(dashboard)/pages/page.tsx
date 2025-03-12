'use client'
import React, { useState, useEffect, useRef } from 'react';
import { HiOutlineUserCircle } from 'react-icons/hi';
import { IoSendSharp } from 'react-icons/io5';
import { BiSearch } from 'react-icons/bi';
import { RiBroadcastFill } from 'react-icons/ri';
import ProfileView from './_component/profile';
import { useAuth, useAuthenticatedApi } from '@/context/AuthContext';
import { Send } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  image: string;
}

interface Chatroom {
  id: string;
  name: string;
  type: string;
  participants: Participant[];
  chatting_with_current_user: Participant;
  created_at: string;
}

interface Page {
  id: string;
  chatroom_id: string | null;
  is_owner_of_page: boolean;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  profile_picture: string;
  cover_photo: string;
  followers_count: number;
  is_active: boolean;
  creator: string;
}

interface Message {
  message_id: string;
  message: string;
  username: string;
  user_id: string;
  timestamp: string;
  image_url: string | null;
  audio_url: string | null;
}

const ChatInterface = () => {
  const [searchInput, setSearchInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);
  const [wsError, setWsError] = useState<string | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const wsReconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { userId, authToken } = useAuth();
  const { api } = useAuthenticatedApi();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await api.get('/post/app/page/');
        setPages(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pages:', error);
        setLoading(false);
      }
    };

    if (authToken) {
      fetchPages();
    }

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
      if (wsReconnectTimeoutRef.current) {
        clearTimeout(wsReconnectTimeoutRef.current);
      }
    };
  }, [authToken]);

  const connectWebSocket = (roomId: string) => {
    if (wsReconnectTimeoutRef.current) {
      clearTimeout(wsReconnectTimeoutRef.current);
      wsReconnectTimeoutRef.current = null;
    }

    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }

    setWsConnected(false);
    setWsError(null);

    try {
      const wsUrl = `ws://sxmx7gdk-3000.inc1.devtunnels.ms/ws/chat/${roomId}/?token=${authToken}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connection established');
        setWsConnected(true);
        setWsError(null);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setMessages(prevMessages => [...prevMessages, message]);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setWsError('Failed to connect to broadcast server');
        setWsConnected(false);
      };

      ws.onclose = (event) => {
        console.log(`WebSocket closed with code: ${event.code}, reason: ${event.reason}`);
        setWsConnected(false);
        
        if (selectedPage) {
          wsReconnectTimeoutRef.current = setTimeout(() => {
            if (selectedPage?.chatroom_id) {
              console.log('Attempting to reconnect WebSocket...');
              connectWebSocket(selectedPage.chatroom_id);
            }
          }, 5000);
        }
      };

      websocketRef.current = ws;
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      setWsError('Failed to create broadcast connection');
      setWsConnected(false);
    }
  };

  const createBroadcastRoom = async (pageId: string, pageName: string) => {
    try {
      const response = await api.post('/chats/app/page-chatroom/', {
        name: pageName,
        participants: [{ id: pageId }],
        type: "broadcast"
      });
      
      const pagesResponse = await api.get('/post/app/page/');
      setPages(pagesResponse.data);
      
      return response.data;
    } catch (error) {
      console.error('Error creating broadcast room:', error);
    }
  };

  const sendBroadcast = () => {
    if (!selectedPage?.chatroom_id || !messageInput.trim() || !selectedPage?.is_owner_of_page) return;

    if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
      console.error('Broadcast connection is not open');
      
      if (selectedPage?.chatroom_id) {
        connectWebSocket(selectedPage.chatroom_id);
        
        setWsError('Reconnecting to broadcast server...');
        
        const tempMessage = messageInput;
        setTimeout(() => {
          if (websocketRef.current?.readyState === WebSocket.OPEN) {
            websocketRef.current.send(JSON.stringify({
              room_id: selectedPage.chatroom_id,
              message: tempMessage,
              user_id: userId,
              message_type: "broadcast"
            }));
            
            const tempMessageObj: Message = {
              message_id: `temp-${Date.now()}`,
              message: tempMessage,
              username: '',
              user_id: userId || '',
              timestamp: new Date().toISOString(),
              image_url: null,
              audio_url: null
            };
            
            setMessages(prevMessages => [...prevMessages, tempMessageObj]);
            setWsError(null);
          }
        }, 2000); 
      }
      
      setMessageInput('');
      return;
    }

    try {
      websocketRef.current.send(JSON.stringify({
        room_id: selectedPage.chatroom_id,
        message: messageInput,
        user_id: userId,
        message_type: "broadcast"
      }));
      
      setMessageInput('');
    } catch (error) {
      console.error('Error sending broadcast:', error);
      setWsError('Failed to send broadcast');
    }
  };

  const fetchBroadcastMessages = async (roomId: string) => {
    try {
      const response = await api.get(`/chats/app/club-chatrooms-messages/?room_id=${roomId}`);
      setMessages(response.data.results);
      connectWebSocket(roomId);
    } catch (error) {
      console.error('Error fetching broadcast messages:', error);
    }
  };

  const handlePageSelect = async (page: Page) => {
    setSelectedPage(page);
    
    if (page.chatroom_id) {
      fetchBroadcastMessages(page.chatroom_id);
    } else {
      const newChatRoom = await createBroadcastRoom(page.id, page.name);
      if (newChatRoom) {
        const updatedPage = {...page, chatroom_id: newChatRoom.id};
        setSelectedPage(updatedPage);
        fetchBroadcastMessages(newChatRoom.id);
      }
    }
  };

  const filteredPages = pages.filter(page => 
    page.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col justify-between">
      <nav className="border-b bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-8">
            <h1 className="text-xl font-bold">Page Broadcasts</h1>
            <div className="flex gap-8 overflow-x-auto">
              {pages.map((page) => (
                <div 
                  key={page.id} 
                  className="flex items-center gap-2 border p-6 rounded-xl cursor-pointer"
                  onClick={() => handlePageSelect(page)}
                >
                  <img
                    src={page.profile_picture || 'https://randomuser.me/portraits/thumb/men/1.jpg'}
                    alt={page.name}
                    className="h-14 w-14 rounded-full"
                  />
                  <div>
                    <span className="text-sm font-medium">{page.name}</span>
                    <div className="text-xs text-gray-400 font-medium">
                      {page.followers_count} followers
                      {page.is_owner_of_page && (
                        <span className="ml-2 text-blue-500 flex items-center">
                          <RiBroadcastFill className="mr-1" /> Creator
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1">
        <div className="border-r bg-white p-4">
          <div className="mb-4">
            <div className="relative">
              <BiSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search pages..."
                className="w-full rounded-lg bg-gray-100 py-2 pl-10 pr-4"
              />
            </div>
          </div>

          <div className="space-y-3 w-[300px]">
            <h2 className="mb-4 text-lg font-semibold">Broadcast Channels</h2>
            {filteredPages.map((page) => (
              <div 
                key={page.id} 
                className={`flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50 cursor-pointer ${selectedPage?.id === page.id ? 'bg-gray-100' : ''}`}
                onClick={() => handlePageSelect(page)}
              >
                <img
                  src={page.profile_picture || 'https://randomuser.me/portraits/thumb/women/1.jpg'}
                  alt={page.name}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <h3 className="font-medium">{page.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center">
                    {page.followers_count} followers
                    {page.is_owner_of_page && (
                      <span className="ml-2 text-blue-500 flex items-center">
                        <RiBroadcastFill className="mr-1" /> Creator
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showProfile && selectedPage ? (
          <ProfileView 
            onBack={() => setShowProfile(false)} 
            pageId={selectedPage.id}
          />
        ) : (
          <div className="flex flex-1 flex-col">
            {selectedPage && (
              <div className="flex items-center justify-between border-b bg-white p-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={selectedPage.profile_picture || 'https://randomuser.me/portraits/thumb/men/1.jpg'} 
                    alt={selectedPage.name} 
                    className="h-8 w-8 rounded-full"
                  />
                  <div>
                    <h2 className="font-semibold flex items-center">
                      {selectedPage.name} 
                      <RiBroadcastFill className="ml-2 text-blue-500" />
                    </h2>
                    <p className="text-sm text-gray-500">
                      Broadcast Channel 
                      {wsConnected ? 
                        <span className="text-green-500 ml-2">● Connected</span> : 
                        <span className="text-red-500 ml-2">● Disconnected</span>
                      }
                    </p>
                  </div>
                </div>
                <button
                  className="rounded-lg bg-gray-100 px-4 py-2"
                  onClick={() => setShowProfile(true)}
                >
                  View page
                </button>
              </div>
            )}

            <div className=" h-40 overflow-y-auto p-4">
              {wsError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <p>{wsError}</p>
                </div>
              )}
              
              {selectedPage && !selectedPage.is_owner_of_page && messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <RiBroadcastFill className="h-12 w-12 mb-4 text-gray-300" />
                  <p>No broadcasts from this page yet.</p>
                  <p>Stay tuned for updates!</p>
                </div>
              )}
              
              {messages.map((message) => (
                <div 
                  key={message.message_id} 
                  className="mb-4 flex items-start gap-3 justify-start"
                >
                  <img 
                    src={selectedPage?.profile_picture || 'https://randomuser.me/portraits/thumb/men/1.jpg'} 
                    alt="Page" 
                    className="h-8 w-8 rounded-full"
                  />
                  
                  <div className="text-left">
                    <div className="font-medium flex items-center">
                      {selectedPage?.name || 'Unknown Page'}
                    </div>
                    <div className="p-2 rounded-lg bg-gray-100">
                      {message.message}
                    </div>
                    <div className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {selectedPage && selectedPage.is_owner_of_page && (
              <div className="border-t bg-white p-4">
                <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={wsConnected ? "Broadcast a message to followers..." : "Connecting to broadcast channel..."}
                    className="flex-1 resize-none bg-transparent outline-none"
                    rows={1}
                    disabled={!wsConnected}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendBroadcast();
                      }
                    }}
                  />
                  <button 
                    className={`rounded-lg p-2 text-white flex items-center ${wsConnected ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400'}`}
                    onClick={sendBroadcast}
                    disabled={!wsConnected}
                  >
                    <Send className="h-5 w-5 mr-1" />
                    <span>Send</span>
                  </button>
                </div>
                {!wsConnected && (
                  <div className="text-xs text-center mt-2 text-red-500">
                    Connection to broadcast server lost. Attempting to reconnect...
                  </div>
                )}
              </div>
            )}
            
            {selectedPage && !selectedPage.is_owner_of_page && (
              <div className="border-t bg-white p-4 text-center text-gray-500">
                <div className="flex items-center justify-center">
                  <RiBroadcastFill className="h-5 w-5 mr-2 text-blue-500" />
                  <span>This is a broadcast channel. Only page owners can send messages.</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;