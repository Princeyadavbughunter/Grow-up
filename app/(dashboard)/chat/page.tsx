'use client'
import React, { useState, useEffect, useRef } from 'react';
import { BiSearch } from 'react-icons/bi';
import { Send, Check, X, MessageSquare, Clock } from 'lucide-react';
import { useAuth, useAuthenticatedApi } from '@/context/AuthContext';

interface Participant {
  id: string;
  name: string;
  image: string;
}

interface Chatroom {
  id: string;
  name: string;
  participants: Participant[];
  chatting_with_current_user: Participant;
  created_at: string;
  is_accepted: boolean;
}

interface Message {
  message_id: string;
  message: string;
  user_id: string;
  timestamp: string;
}

interface ChatroomDetails {
  id: string;
  name: string;
  participants: Participant[];
}

const ChatInterface: React.FC = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [messageInput, setMessageInput] = useState<string>('');
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [pendingChatrooms, setPendingChatrooms] = useState<Chatroom[]>([]);
  const [selectedChatroom, setSelectedChatroom] = useState<Chatroom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [tab, setTab] = useState<'active' | 'pending'>('active');
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [wsError, setWsError] = useState<string | null>(null);
  
  const websocketRef = useRef<WebSocket | null>(null);
  const wsReconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { userId, authToken } = useAuth();
  const { api } = useAuthenticatedApi();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (authToken) {
      fetchChatrooms();
      fetchPendingChatrooms();
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

  const fetchChatrooms = async (): Promise<void> => {
    try {
      const response = await api.get('/individualchats/chatroom/');
      setChatrooms(response.data.results);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chatrooms:', error);
      setLoading(false);
    }
  };

  const fetchPendingChatrooms = async (): Promise<void> => {
    try {
      const response = await api.get('/individualchats/chatrooms-pending/');
      setPendingChatrooms(response.data.results);
    } catch (error) {
      console.error('Error fetching pending chatrooms:', error);
    }
  };

  const fetchChatroomDetails = async (roomId: string): Promise<ChatroomDetails | null> => {
    try {
      const response = await api.get('/individualchats/chatrooms-details/');
      return response.data.find((room: ChatroomDetails) => room.id === roomId) || null;
    } catch (error) {
      console.error('Error fetching chatroom details:', error);
      return null;
    }
  };

  const connectWebSocket = (roomId: string): void => {
    console.log("Attempting to connect WebSocket for room:", roomId);
    
    if (wsReconnectTimeoutRef.current) {
      console.log("Clearing existing reconnect timeout");
      clearTimeout(wsReconnectTimeoutRef.current);
      wsReconnectTimeoutRef.current = null;
    }

    if (websocketRef.current) {
      console.log("Closing existing WebSocket connection");
      websocketRef.current.close();
      websocketRef.current = null;
    }

    setWsConnected(false);
    setWsError(null);

    try {
      const wsUrl = `wss://backend.growupbuddy.in/ws/chats/${roomId}/?token=${authToken}`;
      console.log("Connecting to WebSocket URL:", wsUrl);
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connection established successfully');
        setWsConnected(true);
        setWsError(null);
      };

      ws.onmessage = (event) => {
        console.log("WebSocket message received:", event.data);
        try {
          const message = JSON.parse(event.data);
          setMessages(prevMessages => [...(prevMessages || []), message]);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setWsError('Failed to connect to chat server');
        setWsConnected(false);
      };

      ws.onclose = (event) => {
        console.log(`WebSocket closed with code: ${event.code}, reason: ${event.reason}`);
        setWsConnected(false);
        
        if (selectedChatroom) {
          wsReconnectTimeoutRef.current = setTimeout(() => {
            if (selectedChatroom?.id) {
              console.log('Attempting to reconnect WebSocket...');
              connectWebSocket(selectedChatroom.id);
            }
          }, 5000);
        }
      };

      websocketRef.current = ws;
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      setWsError('Failed to create chat connection');
      setWsConnected(false);
    }
  };

  const sendMessage = (): void => {
    console.log("Send message function called");
    console.log("Selected chatroom:", selectedChatroom);
    console.log("Message input:", messageInput);
    console.log("WebSocket state:", websocketRef.current?.readyState);
    
    if (!selectedChatroom?.id || !messageInput.trim()) {
      console.log("Validation failed - chatroom or message empty");
      return;
    }

    if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
      console.log("WebSocket not connected, attempting reconnection");
      console.error('Chat connection is not open');
      
      if (selectedChatroom?.id) {
        connectWebSocket(selectedChatroom.id);
        setWsError('Reconnecting to chat server...');
        
        const tempMessage = messageInput;
        setTimeout(() => {
          if (websocketRef.current?.readyState === WebSocket.OPEN) {
            console.log("Sending message after reconnection");
            websocketRef.current.send(JSON.stringify({
              room_id: selectedChatroom.id,
              message: tempMessage,
              user_id: userId,
              message_type: "chat"
            }));
            
            const tempMessageObj: Message = {
              message_id: `temp-${Date.now()}`,
              message: tempMessage,
              user_id: userId || '',
              timestamp: new Date().toISOString(),
            };
            
            setMessages(prevMessages => [...prevMessages, tempMessageObj]);
            setWsError(null);
          } else {
            console.log("Failed to reconnect WebSocket");
          }
        }, 2000);
      }
      
      setMessageInput('');
      return;
    }

    try {
      console.log("Attempting to send message via WebSocket");
      websocketRef.current.send(JSON.stringify({
        room_id: selectedChatroom.id,
        message: messageInput,
        user_id: userId,
        message_type: "chat"
      }));
      console.log("Message sent successfully");
      
      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
      setWsError('Failed to send message');
    }
  };

  const fetchMessages = async (roomId: string): Promise<void> => {
    try {
      const response = await api.get(`/individualchats/chatrooms-messages/?room_id=${roomId}`);
      setMessages(response.data.results || []);
      connectWebSocket(roomId);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleChatroomSelect = async (chatroom: Chatroom): Promise<void> => {
    setSelectedChatroom(chatroom);
    fetchMessages(chatroom.id);
    const details = await fetchChatroomDetails(chatroom.id);
    if (details) {
      setSelectedChatroom(prev => prev ? {...prev, ...details} : null);
    }
  };

  const handleChatroomAction = async (roomId: string, accept: boolean): Promise<void> => {
    try {
      await api.patch(`/individualchats/chatroom/?room_id=${roomId}&is_accepted=${accept ? 'True' : 'False'}`);
      
      // Refresh lists
      fetchChatrooms();
      fetchPendingChatrooms();
      
      // If accepted, select the chatroom
      if (accept) {
        const acceptedRoom = pendingChatrooms.find(room => room.id === roomId);
        if (acceptedRoom) {
          handleChatroomSelect(acceptedRoom);
        }
      }
    } catch (error) {
      console.error('Error handling chatroom request:', error);
    }
  };

  const filteredChatrooms = chatrooms.filter(chatroom => 
    chatroom.name.toLowerCase().includes(searchInput.toLowerCase()) ||
    chatroom.chatting_with_current_user.name.toLowerCase().includes(searchInput.toLowerCase())
  );
  
  const filteredPendingChatrooms = pendingChatrooms.filter(chatroom => 
    chatroom.name.toLowerCase().includes(searchInput.toLowerCase()) ||
    chatroom.chatting_with_current_user.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="flex h-full">
      <div className="w-1/4 border-r bg-white">
        <div className="p-4 border-b">
          <div className="relative mb-4">
            <BiSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search chats..."
              className="w-full rounded-lg bg-gray-100 py-2 pl-10 pr-4"
            />
          </div>
          
          <div className="flex border-b mb-2">
            <button
              onClick={() => setTab('active')}
              className={`flex-1 py-2 text-center ${tab === 'active' ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
            >
              Active Chats
            </button>
            <button
              onClick={() => setTab('pending')}
              className={`flex-1 py-2 text-center ${tab === 'pending' ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
            >
              Pending ({pendingChatrooms.length})
            </button>
          </div>
        </div>

        <div className="overflow-y-auto h-full">
          {tab === 'active' ? (
            <>
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading chats...</div>
              ) : filteredChatrooms.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No chats found</div>
              ) : (
                filteredChatrooms.map((chatroom) => (
                  <div 
                    key={chatroom.id} 
                    className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${selectedChatroom?.id === chatroom.id ? 'bg-gray-100' : ''}`}
                    onClick={() => handleChatroomSelect(chatroom)}
                  >
                    <img
                      src={chatroom.chatting_with_current_user.image || '/default-avatar.png'}
                      alt={chatroom.chatting_with_current_user.name}
                      className="h-12 w-12 rounded-full mr-3"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{chatroom.chatting_with_current_user.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{chatroom.name}</p>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(chatroom.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </>
          ) : (
            <>
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading requests...</div>
              ) : filteredPendingChatrooms.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No pending requests</div>
              ) : (
                filteredPendingChatrooms.map((chatroom) => (
                  <div key={chatroom.id} className="flex items-center p-4 border-b">
                    <img
                      src={chatroom.chatting_with_current_user.image || '/default-avatar.png'}
                      alt={chatroom.chatting_with_current_user.name}
                      className="h-12 w-12 rounded-full mr-3"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{chatroom.chatting_with_current_user.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{chatroom.name}</p>
                      <div className="text-xs text-gray-400 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(chatroom.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleChatroomAction(chatroom.id, true)}
                        className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleChatroomAction(chatroom.id, false)}
                        className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {!selectedChatroom ? (
          <div className="flex-1 flex items-center justify-center flex-col text-gray-500">
            <MessageSquare className="h-16 w-16 mb-4 text-gray-300" />
            <p className="text-xl">Select a chat to start messaging</p>
          </div>
        ) : (
          <>
            <div className="p-4 border-b bg-white flex items-center">
              <img
                src={selectedChatroom.chatting_with_current_user.image || '/default-avatar.png'}
                alt={selectedChatroom.chatting_with_current_user.name}
                className="h-10 w-10 rounded-full mr-3"
              />
              <div>
                <h2 className="font-medium">{selectedChatroom.chatting_with_current_user.name}</h2>
                <p className="text-sm text-gray-500 flex items-center">
                  {wsConnected ? 
                    <span className="text-green-500 flex items-center"><span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>Online</span> : 
                    <span className="text-gray-500 flex items-center"><span className="h-2 w-2 bg-gray-300 rounded-full mr-1"></span>Offline</span>
                  }
                </p>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {wsError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <p>{wsError}</p>
                </div>
              )}
              
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isCurrentUser = message.user_id === userId;
                  return (
                    <div 
                      key={message.message_id} 
                      className={`mb-4 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[70%] rounded-lg p-3 ${
                          isCurrentUser ? 'bg-blue-500 text-white' : 'bg-white border'
                        }`}
                      >
                        <p>{message.message}</p>
                        <div className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                          {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t bg-white">
              <div className="flex">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-l-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      sendMessage();
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Send button clicked");
                    sendMessage();
                  }}
                  type="button"
                  className="bg-blue-500 text-white rounded-r-lg px-4 py-2 hover:bg-blue-600"
                  disabled={!wsConnected}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;