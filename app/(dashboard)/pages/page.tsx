// @ts-nocheck
'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BiSearch } from 'react-icons/bi';
import { FaUser } from 'react-icons/fa';
import { RiBroadcastFill } from 'react-icons/ri';
import { HiMenuAlt3 } from 'react-icons/hi';
import { X, Send, Plus, Bell } from 'lucide-react';
import ProfileView from './_component/profile';
import { useAuth, useAuthenticatedApi } from '@/context/AuthContext';

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
  is_admin?: boolean;
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
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState<'buddies' | 'discover'>('buddies');
  const [pages, setPages] = useState<Page[]>([]);
  const [followedPages, setFollowedPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);
  const [wsError, setWsError] = useState<string | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const websocketRef = useRef<WebSocket | null>(null);
  const wsReconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { userId, authToken } = useAuth();
  const { api } = useAuthenticatedApi();

  const recommendedPages = React.useMemo(() => {
    return [...pages].sort(() => 0.5 - Math.random()).slice(0, 4);
  }, [pages]);

  const linkifyText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline break-all">
            {part}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchPages = useCallback(async () => {
    if (!authToken) return;
    try {
      const [pagesResponse, followedPagesResponse] = await Promise.all([
        api.get('/post/app/page/'),
        api.get('/post/app/pages-follow/')
      ]);
      setPages(pagesResponse.data || []);
      setFollowedPages(followedPagesResponse.data?.pages || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  }, [authToken, api]);

  useEffect(() => {
    if (authToken) {
      fetchPages();
    }
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
        websocketRef.current = null;
      }
      if (wsReconnectTimeoutRef.current) {
        clearTimeout(wsReconnectTimeoutRef.current);
        wsReconnectTimeoutRef.current = null;
      }
    };
  }, [authToken, fetchPages]);

  const connectWebSocket = useCallback((roomId: string) => {
    if (!authToken) return;
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
      const wsUrl = `wss://backend.growupbuddy.com/ws/chat/${roomId}/?token=${authToken}`;
      const ws = new WebSocket(wsUrl);
      ws.onopen = () => {
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
        setWsError('Failed to connect to broadcast server');
        setWsConnected(false);
      };
      ws.onclose = (event) => {
        setWsConnected(false);
        if (selectedPage?.chatroom_id && event.code !== 1000) {
          wsReconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket(roomId);
          }, 5000);
        }
      };
      websocketRef.current = ws;
    } catch (error) {
      setWsError('Failed to create broadcast connection');
      setWsConnected(false);
    }
  }, [authToken, selectedPage?.chatroom_id]);

  const createBroadcastRoom = async (pageId: string, pageName: string) => {
    try {
      const response = await api.post('/chats/app/page-chatroom/', {
        name: pageName,
        participants: [{ id: pageId }],
      });
      return response.data;
    } catch (error) {
      console.error('Error creating broadcast room:', error);
      return null;
    }
  };

  const sendBroadcast = async () => {
    if (!selectedPage?.chatroom_id || !messageInput.trim() || !selectedPage?.is_admin || sendingMessage) return;
    setSendingMessage(true);
    if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
      if (selectedPage?.chatroom_id) connectWebSocket(selectedPage.chatroom_id);
      setSendingMessage(false);
      return;
    }
    try {
      const messageToSend = messageInput.trim();
      setMessageInput('');
      websocketRef.current.send(JSON.stringify({
        room_id: selectedPage.chatroom_id,
        message: messageToSend,
        user_id: userId,
        message_type: "broadcast"
      }));
    } catch (error) {
      console.error('Error sending broadcast:', error);
      setMessageInput(messageInput);
    } finally {
      setSendingMessage(false);
    }
  };

  const fetchBroadcastMessages = async (roomId: string) => {
    try {
      const response = await api.get(`/chats/app/club-chatrooms-messages/?room_id=${roomId}`);
      setMessages((response.data?.results || []).reverse());
      connectWebSocket(roomId);
    } catch (error) {
      console.error('Error fetching broadcast messages:', error);
      setMessages([]);
    }
  };

  const handlePageSelect = async (page: Page) => {
    setSelectedPage(page);
    setMessages([]);
    setShowSidebar(false);
    if (page.chatroom_id) {
      fetchBroadcastMessages(page.chatroom_id);
    } else {
      const newChatRoom = await createBroadcastRoom(page.id, page.name);
      if (newChatRoom) {
        const updatedPage = { ...page, chatroom_id: newChatRoom.id };
        setSelectedPage(updatedPage);
        fetchBroadcastMessages(newChatRoom.id);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendBroadcast();
    }
  };

  const filteredFollowedPages = followedPages.filter(page => page.name.toLowerCase().includes(searchInput.toLowerCase()));
  const filteredPages = pages.filter(page => page.name.toLowerCase().includes(searchInput.toLowerCase()));

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div></div>;
  }

  return (
    <div className="flex flex-col bg-white" style={{ position: 'fixed', top: '5rem', left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>

      {/* 1. Recommended Section - Top Strip */}
      <div className="px-4 md:px-12 lg:px-28 pt-8 pb-4 flex-shrink-0 bg-white border-b border-gray-50">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recommended</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {recommendedPages.map((page) => (
            <div key={page.id} className="flex items-center gap-3 p-4 rounded-3xl border border-gray-200 bg-white hover:shadow-md cursor-pointer transition-all min-w-[180px] md:min-w-0" onClick={() => handlePageSelect(page)}>
              <div className="h-12 w-12 rounded-2xl bg-white border border-gray-100 p-1 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                {page.profile_picture ? <img src={page.profile_picture} alt={page.name} className="h-full w-full object-cover rounded-xl" /> : <FaUser className="h-6 w-6 text-gray-300" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 truncate leading-tight">{page.name}</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">({page.category || 'Startup'})</p>
                <p className="text-[10px] text-gray-400 mt-1">{page.followers_count >= 1000 ? `${(page.followers_count / 1000).toFixed(1)}k` : page.followers_count} Buddy</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Content Row: Sidebar and Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Desktop Sidebar / Mobile Toggle Menu */}
        <div className={`
          ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          fixed md:relative md:translate-x-0 z-40 md:z-auto
          flex flex-col border-r border-gray-100 bg-[#F8FAFB] flex-shrink-0 transition-transform duration-300
          md:pl-12 lg:pl-28 pt-8 h-full
        `} style={{ width: '450px', maxWidth: '85vw', height: '100%', top: showSidebar ? 0 : 'auto', bottom: 0, left: 0 }}>
             {/* Mobile Close Button */}
             <button onClick={() => setShowSidebar(false)} className="md:hidden absolute right-4 top-4 z-50 p-2 text-gray-500">
                <X className="h-6 w-6" />
             </button>
          <div className="px-6 flex-shrink-0">
            {/* Tabs */}
            <div className="flex gap-8 mb-6 border-b border-gray-100">
              <button onClick={() => setActiveTab('buddies')} className={`pb-2 text-sm font-semibold transition-all duration-200 relative ${activeTab === 'buddies' ? 'text-[#7052FF]' : 'text-gray-500 hover:text-gray-700'}`}>
                My Buddies
                {activeTab === 'buddies' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7052FF]" />}
              </button>
              <button onClick={() => setActiveTab('discover')} className={`pb-2 text-sm font-semibold transition-all duration-200 relative ${activeTab === 'discover' ? 'text-[#7052FF]' : 'text-gray-500 hover:text-gray-700'}`}>
                Discover
                {activeTab === 'discover' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7052FF]" />}
              </button>
            </div>

            <div className="relative mb-6">
              <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search pages..." className="w-full rounded-xl bg-white border border-gray-100 py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-[#7052FF] transition-colors text-sm shadow-sm" />
            </div>
            <h2 className="text-sm font-bold text-gray-900 mb-4">{activeTab === 'buddies' ? 'My Buddies' : 'Discover'}</h2>
          </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pt-0 pb-24 min-h-0 bg-[#F8FAFB]">
            <div className="space-y-4">
              {(activeTab === 'buddies' ? filteredFollowedPages : filteredPages).map((page) => (
                <div key={page.id} className={`flex items-center gap-3 rounded-2xl p-4 hover:bg-white cursor-pointer transition-all duration-150 ${selectedPage?.id === page.id ? 'bg-white shadow-md ring-1 ring-gray-100' : 'bg-transparent'}`} onClick={() => handlePageSelect(page)}>
                  <div className="h-12 w-12 rounded-2xl bg-white border border-gray-100 p-1 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                    {page.profile_picture ? <img src={page.profile_picture} alt={page.name} className="h-full w-full object-cover rounded-xl" /> : <FaUser className="h-6 w-6 text-gray-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate text-gray-900 text-sm">{page.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">({page.category || 'Startup'})</p>
                    <p className="text-xs text-gray-400 mt-0.5">{page.followers_count >= 1000 ? `${(page.followers_count / 1000).toFixed(2)}k` : page.followers_count} Buddy</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white pr-4 md:pr-12 lg:pr-28 pt-8">
          {/* Mobile Sidebar Toggle */}
          {!selectedPage && (
             <button onClick={() => setShowSidebar(true)} className="md:hidden fixed bottom-6 right-6 z-50 p-4 bg-[#7052FF] text-white rounded-full shadow-lg">
                <HiMenuAlt3 className="h-6 w-6" />
             </button>
          )}
          {showProfile && selectedPage ? (
            <div className="flex-1 overflow-hidden bg-white h-full relative">
              <ProfileView onBack={() => setShowProfile(false)} pageId={selectedPage.id} />
            </div>
          ) : selectedPage ? (
            <div className="flex flex-1 flex-col overflow-hidden bg-white h-full relative">
              <div className="flex flex-col h-full">
                {/* Chat Header */}
                <div className="flex items-center justify-between border-b border-gray-50 bg-white flex-shrink-0 px-4 md:px-8 py-6" style={{ minHeight: '100px' }}>
                  <div className="flex items-center gap-4 flex-1">
                    {/* Back to sidebar on mobile */}
                    <button onClick={() => setShowSidebar(true)} className="md:hidden p-2 text-gray-400">
                        <HiMenuAlt3 className="h-6 w-6" />
                    </button>
                    <div className="flex flex-col items-start md:ml-64">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-white border border-gray-100 p-0.5 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm ring-2 ring-gray-50">
                          {selectedPage.profile_picture ? (
                            <img
                              src={selectedPage.profile_picture}
                              alt={selectedPage.name}
                              className="h-full w-full object-cover rounded-full"
                            />
                          ) : (
                            <FaUser className="h-5 w-5 text-gray-300" />
                          )}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 truncate">{selectedPage.name}</h2>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <Bell className="h-5 w-5" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Broadcast channel - {selectedPage.followers_count >= 1000 ? `${(selectedPage.followers_count / 1000).toFixed(2)}k` : selectedPage.followers_count} Buddies
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:gap-6 absolute right-4 md:right-8">
                    {!(selectedPage.is_admin || selectedPage.is_owner_of_page) && (
                      <button className="text-[#7052FF] font-semibold text-xs md:text-sm hover:underline" onClick={async () => {
                        try {
                          const isFollowing = followedPages.some(p => p.id === selectedPage.id);
                          await api.post('/post/app/pages-follow/', { page_id: selectedPage.id });
                          if (isFollowing) setFollowedPages(prev => prev.filter(p => p.id !== selectedPage.id));
                          else setFollowedPages(prev => [...prev, selectedPage]);
                          fetchPages();
                        } catch (error) { console.error('Error toggling follow:', error); }
                      }}>{followedPages.some(p => p.id === selectedPage.id) ? 'Unfollow' : 'Follow'}</button>
                    )}
                    <button className="text-gray-500 font-semibold text-xs md:text-sm hover:text-gray-700" onClick={() => setShowProfile(true)}>View profile</button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto scrollbar-hide bg-white px-8 py-8 h-full">
                  <div className="space-y-8 pb-32">
                    {wsError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm"><p>{wsError}</p></div>}
                    {messages.map((message) => (
                      <div
                        key={message.message_id}
                        className="flex flex-col items-end w-full"
                      >
                        <div className="flex items-end gap-3 max-w-[80%]">
                          <div className="flex flex-col">
                            <div
                              style={{
                                width: '100%',
                                maxWidth: '522px',
                                minHeight: '45px',
                                borderRadius: '16px',
                                padding: '12px 24px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                gap: '8px'
                              }}
                              className="bg-[#EFEFEF] text-gray-800 text-sm leading-relaxed shadow-sm"
                            >
                              {linkifyText(message.message)}
                            </div>
                          </div>
                          <div className="text-[10px] font-semibold text-gray-400 pb-1 whitespace-nowrap">
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()}. Today
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Message Input Area (Centered Pill) */}
                <div className="absolute bottom-20 left-0 right-0 px-8 flex justify-center pointer-events-none">
                  <div className="w-full max-w-3xl pointer-events-auto">
                    {(selectedPage.is_admin || selectedPage.is_owner_of_page) ? (
                      <div className="flex items-center gap-4 bg-[#F5F5F5] rounded-full px-6 py-4 shadow-sm ring-1 ring-gray-100">
                        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors"><Plus className="h-5 w-5" /></button>
                        <textarea value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder="Type your text here" className="flex-1 resize-none bg-transparent outline-none text-sm py-1.5" rows={1} disabled={!wsConnected || sendingMessage} onKeyDown={handleKeyDown} />
                        <button className={`p-1 transition-colors ${wsConnected && !sendingMessage && messageInput.trim() ? 'text-[#7052FF]' : 'text-gray-400 cursor-not-allowed'}`} onClick={sendBroadcast} disabled={!wsConnected || sendingMessage || !messageInput.trim()}><Send className="h-6 w-6 transform rotate-45" /></button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 bg-[#F5F5F5] rounded-full px-6 py-4 shadow-sm ring-1 ring-gray-100 opacity-80">
                        <RiBroadcastFill className="h-5 w-5 text-[#7052FF]" /><span className="text-sm text-gray-500 font-medium">This is a broadcast channel. Only page owners can send messages.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400"><p>Select a page to start chatting</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;