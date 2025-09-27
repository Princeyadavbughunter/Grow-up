// @ts-nocheck
'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BiSearch, BiArrowBack } from 'react-icons/bi';
import { FaUser } from 'react-icons/fa';
import { RiBroadcastFill } from 'react-icons/ri';
import { HiMenuAlt3 } from 'react-icons/hi';
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
    <div className="flex overflow-x-hidden flex-col h-[calc(100vh-5rem)] bg-gray-50">

      <div className='p-2 border-b'>
        <h1 className="text-lg mb-2 md:text-xl font-bold">
          Recommended Pages
        </h1>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {pages.map((page) => (
            <div
              key={page.id}
              className="flex items-center gap-3 border p-3 md:p-4 rounded-xl cursor-pointer hover:shadow-md transition-shadow bg-white min-w-max"
              onClick={() => handlePageSelect(page)}
            >
              {page.profile_picture ? (
                <img
                  src={page.profile_picture}
                  alt={page.name}
                  className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <FaUser className="h-5 w-5 md:h-6 md:w-6 text-gray-500" />
                </div>
              )}
              <div>
                <span className="text-sm font-medium block truncate max-w-[120px]">{page.name}</span>
                <div className="text-xs text-gray-500 font-medium flex items-center">
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

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {showSidebar && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setShowSidebar(false)}
            />
            <div className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 md:hidden">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">My Buddies</h2>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <BiArrowBack className="h-5 w-5" />
                  </button>
                </div>
                <div className="relative">
                  <BiSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search pages..."
                    className="w-full rounded-lg bg-gray-100 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="p-4 overflow-y-auto h-full">
                <div className="space-y-3">
                  {filteredFollowedPages.length > 0 ? (
                    filteredFollowedPages.map((page) => (
                      <div
                        key={page.id}
                        className={`flex items-center gap-3 rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors ${selectedPage?.id === page.id ? 'bg-blue-50 border border-blue-200' : ''
                          }`}
                        onClick={() => handlePageSelect(page)}
                      >
                        {page.profile_picture ? (
                          <img
                            src={page.profile_picture}
                            alt={page.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <FaUser className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{page.name}</h3>
                          <p className="text-sm text-gray-500 flex items-center">
                            {page.followers_count} followers
                            {page.is_admin && (
                              <span className="ml-2 text-blue-500 flex items-center">
                                Admin
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No pages found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Desktop Sidebar */}
        <div className="hidden md:block border-r bg-white w-1/3 lg:w-1/4 overflow-y-auto">
          <div className="p-4">
            <div className="mb-4">
              <div className="relative">
                <BiSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search pages..."
                  className="w-full rounded-lg bg-gray-100 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="mb-4 text-lg font-semibold">My Buddies ({filteredFollowedPages.length})</h2>
              {filteredFollowedPages.length > 0 ? (
                filteredFollowedPages.map((page) => (
                  <div
                    key={page.id}
                    className={`flex items-center gap-3 rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors ${selectedPage?.id === page.id ? 'bg-blue-50 border border-blue-200' : ''
                      }`}
                    onClick={() => handlePageSelect(page)}
                  >
                    {page.profile_picture ? (
                      <img
                        src={page.profile_picture}
                        alt={page.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaUser className="h-5 w-5 text-gray-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{page.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center">
                        {page.followers_count} followers
                        {page.is_admin && (
                          <span className="ml-2 text-blue-500 flex items-center">
                            <RiBroadcastFill className="mr-1" /> Admin
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No pages found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {showProfile && selectedPage ? (
          <ProfileView
            onBack={() => setShowProfile(false)}
            pageId={selectedPage.id}
          />
        ) : selectedPage ? (
          <div className="flex flex-1 mb-10 flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b bg-white p-3 md:p-4 shadow-sm">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {selectedPage.profile_picture ? (
                  <img
                    src={selectedPage.profile_picture}
                    alt={selectedPage.name}
                    className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <FaUser className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold flex items-center text-sm md:text-base">
                    <span className="truncate">{selectedPage.name}</span>
                    <RiBroadcastFill className="ml-2 text-blue-500 flex-shrink-0" />
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500 flex items-center">
                    Broadcast Channel
                    {wsConnected ?
                      <span className="text-green-500 ml-2">● Connected</span> :
                      <span className="text-red-500 ml-2">● Disconnected</span>
                    }
                  </p>
                </div>
              </div>
              <button
                className="rounded-lg bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200 transition-colors flex-shrink-0"
                onClick={() => setShowProfile(true)}
              >
                View page
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-3 md:p-4 overflow-y-auto bg-gray-50">
              {wsError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                  <p>{wsError}</p>
                </div>
              )}

              {selectedPage && !selectedPage.is_admin && messages.length === 0 && !wsError && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center px-4">
                  <RiBroadcastFill className="h-12 w-12 mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No broadcasts yet</p>
                  <p className="text-sm">Stay tuned for updates from {selectedPage.name}!</p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.message_id}
                  className="mb-4 flex items-start gap-2 md:gap-3"
                >
                  {selectedPage?.profile_picture ? (
                    <img
                      src={selectedPage.profile_picture}
                      alt="Page"
                      className="h-6 w-6 md:h-8 md:w-8 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <FaUser className="h-3 w-3 md:h-4 md:w-4 text-gray-500" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 mb-1 text-sm md:text-base">
                      {selectedPage?.name || 'Unknown Page'}
                    </div>
                    <div className="p-3 rounded-lg bg-white shadow-sm border text-sm md:text-base">
                      {message.message}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatTimeAgo(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Area - Only for Admins */}
            {selectedPage && selectedPage.is_admin && (
              <div className="border-t bg-white p-3 md:p-4">
                <div className="flex items-end gap-2 rounded-lg bg-gray-50 p-2">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={wsConnected ? "Broadcast a message to followers..." : "Connecting to broadcast channel..."}
                    className="flex-1 resize-none bg-transparent outline-none min-h-[40px] max-h-32 text-sm md:text-base"
                    rows={1}
                    disabled={!wsConnected || sendingMessage}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    className={`rounded-lg p-2 text-white flex items-center transition-colors text-sm ${wsConnected && !sendingMessage && messageInput.trim()
                        ? 'bg-blue-500 hover:bg-blue-600'
                        : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    onClick={sendBroadcast}
                    disabled={!wsConnected || sendingMessage || !messageInput.trim()}
                  >
                    <Send className="h-4 w-4 mr-1" />
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
              <div className="border-t bg-white p-3 md:p-4 text-center text-gray-500">
                <div className="flex items-center justify-center text-sm">
                  <RiBroadcastFill className="h-5 w-5 mr-2 text-blue-500" />
                  <span>This is a broadcast channel. Only page owners can send messages.</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
            <div className="text-center text-gray-500">
              <RiBroadcastFill className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Select a page to view broadcasts</h3>
              <p className="text-sm">Choose a page from the sidebar to start viewing broadcasts</p>
              <button
                onClick={() => setShowSidebar(true)}
                className="mt-4 md:hidden bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Browse Pages
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;