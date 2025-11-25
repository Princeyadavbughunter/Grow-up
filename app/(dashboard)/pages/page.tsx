// @ts-nocheck
'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BiSearch } from 'react-icons/bi';
import { FaUser } from 'react-icons/fa';
import { RiBroadcastFill } from 'react-icons/ri';
import { HiMenuAlt3 } from 'react-icons/hi';
import { X } from 'lucide-react';
import ProfileView from './_component/profile';
import { useAuth, useAuthenticatedApi } from '@/context/AuthContext';
import { Send } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';

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

  // Function to convert URLs in text to clickable links
  const linkifyText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline break-all"
          >
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
  }, [authToken]);

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

        if (selectedPage?.chatroom_id && event.code !== 1000) {
          wsReconnectTimeoutRef.current = setTimeout(() => {
            console.log('Attempting to reconnect WebSocket...');
            connectWebSocket(roomId);
          }, 5000);
        }
      };

      websocketRef.current = ws;
    } catch (error) {
      console.error('Error creating WebSocket:', error);
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
      console.error('Broadcast connection is not open');

      if (selectedPage?.chatroom_id) {
        connectWebSocket(selectedPage.chatroom_id);
        setWsError('Reconnecting to broadcast server...');
      }

      setSendingMessage(false);
      return;
    }

    try {
      const messageToSend = messageInput.trim();
      setMessageInput(''); // Clear input immediately for better UX

      websocketRef.current.send(JSON.stringify({
        room_id: selectedPage.chatroom_id,
        message: messageToSend,
        user_id: userId,
        message_type: "broadcast"
      }));

    } catch (error) {
      console.error('Error sending broadcast:', error);
      setWsError('Failed to send broadcast');
      setMessageInput(messageInput); // Restore message on error
    } finally {
      setSendingMessage(false);
    }
  };

  const fetchBroadcastMessages = async (roomId: string) => {

    try {
      const response = await api.get(`/chats/app/club-chatrooms-messages/?room_id=${roomId}`);
      setMessages(response.data?.results || []);
      connectWebSocket(roomId);
    } catch (error) {
      console.error('Error fetching broadcast messages:', error);
      setMessages([]);
    }
  };

  const handlePageSelect = async (page: Page) => {
    setSelectedPage(page);
    setMessages([]);
    setShowSidebar(false); // Close sidebar on mobile after selection

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

  const filteredFollowedPages = followedPages.filter(page =>
    page.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50" style={{ position: 'fixed', top: '5rem', left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setShowSidebar(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 md:hidden shadow-xl flex flex-col">
            <div className="p-4 border-b flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Pages</h2>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              
              {/* Tabs */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setActiveTab('buddies')}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'buddies'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  My Buddies
                </button>
                <button
                  onClick={() => setActiveTab('discover')}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'discover'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Discover
                </button>
              </div>
              
              {activeTab === 'buddies' && (
                <div className="relative">
                  <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search pages..."
                    className="w-full rounded-lg bg-gray-100 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                  />
                </div>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-4 pb-24  min-h-0">
              {activeTab === 'buddies' ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                    {filteredFollowedPages.length} {filteredFollowedPages.length === 1 ? 'Page' : 'Pages'}
                  </p>
                  {filteredFollowedPages.length > 0 ? (
                    filteredFollowedPages.map((page) => (
                      <div
                        key={page.id}
                        className={`flex items-center gap-3 rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-all duration-150 ${
                          selectedPage?.id === page.id
                            ? 'bg-blue-50 border border-blue-300 shadow-sm'
                            : 'border border-transparent'
                        }`}
                        onClick={() => handlePageSelect(page)}
                      >
                        {page.profile_picture ? (
                          <img
                            src={page.profile_picture}
                            alt={page.name}
                            className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <FaUser className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate text-gray-900">{page.name}</h3>
                          <p className="text-sm text-gray-500 flex items-center">
                            {page.followers_count} followers
                            {page.is_admin && (
                              <span className="ml-2 text-blue-500 flex items-center text-xs">
                                Admin
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <FaUser className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No pages found</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                    Recommended for you
                  </p>
                  {pages.map((page) => (
                    <div
                      key={page.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all duration-200 bg-white"
                      onClick={() => handlePageSelect(page)}
                    >
                      {page.profile_picture ? (
                        <img
                          src={page.profile_picture}
                          alt={page.name}
                          className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <FaUser className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 mb-1">{page.name}</h3>
                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">{page.description || 'No description available'}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{page.followers_count} followers</span>
                          {page.is_owner_of_page && (
                            <span className="text-blue-500 flex items-center">
                              <RiBroadcastFill className="mr-1" /> Your Page
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col border-r border-gray-200 bg-white flex-shrink-0 overflow-hidden" style={{ width: '320px', height: '100%' }}>
        <div className="p-4 border-b flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Pages</h2>
          
          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('buddies')}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'buddies'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              My Buddies
            </button>
            <button
              onClick={() => setActiveTab('discover')}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'discover'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Discover
            </button>
          </div>
          
          {activeTab === 'buddies' && (
            <div className="relative">
              <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search pages..."
                className="w-full rounded-lg bg-gray-100 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-sm"
              />
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-4 pb-24 min-h-0">
          {activeTab === 'buddies' ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                {filteredFollowedPages.length} {filteredFollowedPages.length === 1 ? 'Page' : 'Pages'}
              </p>
              {filteredFollowedPages.length > 0 ? (
                filteredFollowedPages.map((page) => (
                  <div
                    key={page.id}
                    className={`flex items-center gap-3 rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-all duration-150 ${
                      selectedPage?.id === page.id
                        ? 'bg-blue-50 border border-blue-300 shadow-sm'
                        : 'border border-transparent'
                    }`}
                    onClick={() => handlePageSelect(page)}
                  >
                    {page.profile_picture ? (
                      <img
                        src={page.profile_picture}
                        alt={page.name}
                        className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <FaUser className="h-5 w-5 text-gray-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate text-gray-900 text-sm">{page.name}</h3>
                      <p className="text-xs text-gray-500 flex items-center">
                        {page.followers_count} followers
                        {page.is_admin && (
                          <span className="ml-2 text-blue-500 flex items-center">
                            <RiBroadcastFill className="mr-1 h-3 w-3" /> Admin
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FaUser className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No pages found</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                Recommended for you
              </p>
              {pages.map((page) => (
                <div
                  key={page.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md cursor-pointer transition-all duration-200 bg-white"
                  onClick={() => handlePageSelect(page)}
                >
                  {page.profile_picture ? (
                    <img
                      src={page.profile_picture}
                      alt={page.name}
                      className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <FaUser className="h-6 w-6 text-gray-500" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 mb-1 text-sm">{page.name}</h3>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">{page.description || 'Join this page to receive updates and broadcasts'}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{page.followers_count} followers</span>
                      {page.is_owner_of_page && (
                        <span className="text-blue-500 flex items-center">
                          <RiBroadcastFill className="mr-1 h-3 w-3" /> Your Page
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {showProfile && selectedPage ? (
        <div className="flex-1 overflow-y-auto bg-white h-full">
          <ProfileView
            onBack={() => setShowProfile(false)}
            pageId={selectedPage.id}
          />
        </div>
      ) : selectedPage ? (
        <div className="flex flex-1 flex-col overflow-hidden bg-white h-full">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-white flex-shrink-0 p-3 md:p-4" style={{ minHeight: '70px' }}>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button
                onClick={() => setShowSidebar(true)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <HiMenuAlt3 className="h-5 w-5 text-gray-600" />
              </button>
              {selectedPage.profile_picture ? (
                <img
                  src={selectedPage.profile_picture}
                  alt={selectedPage.name}
                  className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <FaUser className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold flex items-center text-sm md:text-base text-gray-900">
                  <span className="truncate">{selectedPage.name}</span>
                  <RiBroadcastFill className="ml-1 md:ml-2 text-blue-500 flex-shrink-0 h-3 w-3 md:h-4 md:w-4" />
                </h2>
                <p className="text-xs md:text-sm text-gray-500 flex items-center">
                  <span className="hidden md:inline">Broadcast Channel</span>
                  {wsConnected ? (
                    <span className="text-green-500 ml-0 md:ml-2 flex items-center text-xs">
                      <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full mr-1"></span>
                      Connected
                    </span>
                  ) : (
                    <span className="text-red-500 ml-0 md:ml-2 flex items-center text-xs">
                      <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full mr-1"></span>
                      Disconnected
                    </span>
                  )}
                </p>
              </div>
            </div>
            <button
              className="rounded-lg bg-gray-100 px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm hover:bg-gray-200 transition-colors flex-shrink-0 font-medium text-gray-700"
              onClick={() => setShowProfile(true)}
            >
              <span className="hidden md:inline">View Page</span>
              <span className="md:hidden">View</span>
            </button>
          </div>

          {/* Messages Area */}
          <div className="overflow-y-auto scrollbar-hide bg-gray-50" style={{ flex: '1 1 0', minHeight: 0, maxHeight: 'calc(100% - 200px)' }}>
            <div className="p-3 md:p-4 space-y-3 md:space-y-4">
              {wsError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  <p>{wsError}</p>
                </div>
              )}

              {selectedPage && !selectedPage.is_admin && messages.length === 0 && !wsError && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center px-4 py-12">
                  <RiBroadcastFill className="h-16 w-16 mb-4 text-gray-300" />
                  <p className="text-lg font-medium text-gray-700">No broadcasts yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Stay tuned for updates from {selectedPage.name}!
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.message_id}
                  className="flex items-start gap-3"
                >
                  {selectedPage?.profile_picture ? (
                    <img
                      src={selectedPage.profile_picture}
                      alt="Page"
                      className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <FaUser className="h-4 w-4 text-gray-500" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 mb-1 text-sm">
                      {selectedPage?.name || 'Unknown Page'}
                    </div>
                    <div className="p-3 rounded-lg bg-white shadow-sm border border-gray-200 text-sm break-words">
                      {linkifyText(message.message)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1.5">
                      {formatTimeAgo(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input Area - Only for Admins */}
          {selectedPage && selectedPage.is_admin && (
            <div className="border-t border-gray-200 bg-white flex-shrink-0 p-3 md:p-4" style={{ minHeight: '200px' }}>
              <div className="flex items-end gap-2 rounded-lg bg-gray-50 p-3 border border-gray-200">
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={wsConnected ? "Broadcast a message to followers..." : "Connecting to broadcast channel..."}
                  className="flex-1 resize-none bg-transparent outline-none text-sm md:text-base"
                  style={{ minHeight: '44px', maxHeight: '80px' }}
                  rows={1}
                  disabled={!wsConnected || sendingMessage}
                  onKeyDown={handleKeyDown}
                />
                <button
                  className={`rounded-lg px-4 py-2.5 text-white flex items-center transition-colors text-sm font-medium flex-shrink-0 ${
                    wsConnected && !sendingMessage && messageInput.trim()
                      ? 'bg-blue-500 hover:bg-blue-600 shadow-sm'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  onClick={sendBroadcast}
                  disabled={!wsConnected || sendingMessage || !messageInput.trim()}
                >
                  <Send className="h-4 w-4 mr-1.5" />
                  <span className="hidden sm:inline">{sendingMessage ? 'Sending...' : 'Send'}</span>
                </button>
              </div>
              {!wsConnected && (
                <div className="text-xs text-center mt-2 text-red-500">
                  Connection to broadcast server lost. Attempting to reconnect...
                </div>
              )}
            </div>
          )}

          {/* Non-Admin Message */}
          {selectedPage && !selectedPage.is_admin && (
            <div className="border-t border-gray-200 bg-white text-center text-gray-500 flex-shrink-0 p-3 md:p-4" style={{ minHeight: '140px' }}>
              <div className="flex items-center justify-center text-sm">
                <RiBroadcastFill className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" />
                <span>This is a broadcast channel. Only page owners can send messages.</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50 p-4 h-full">
          <div className="text-center text-gray-500 max-w-md">
            <RiBroadcastFill className="h-20 w-20 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-medium mb-2 text-gray-700">Select a page to view broadcasts</h3>
            <p className="text-sm text-gray-500 mb-6">
              Choose a page from the sidebar to start viewing broadcasts
            </p>
            <button
              onClick={() => setShowSidebar(true)}
              className="md:hidden bg-blue-500 text-white px-6 py-2.5 rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
            >
              Browse Pages
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;