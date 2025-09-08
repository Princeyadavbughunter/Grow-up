// @ts-nocheck
'use client'
import React, { useState, useEffect, useRef } from 'react';
import { BiSearch } from 'react-icons/bi';
import { Send, Check, X, MessageSquare, Clock, ArrowLeft, MoreVertical, FileText } from 'lucide-react';
import { useAuth, useAuthenticatedApi } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
  username: string;
  timestamp: string;
  image_url: string | null;
  audio_url: string | null;
  is_sender: boolean;
}

interface MessagesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Message[];
}

interface ChatroomDetails {
  id: string;
  name: string;
  participants: Participant[];
}

interface Note {
  id: string;
  user_id: string;
  username: string;
  note: string;
  created_at: string;
  updated_at: string;
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
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [deletingMessage, setDeletingMessage] = useState<string | null>(null);
  const [noteDialogOpen, setNoteDialogOpen] = useState<boolean>(false);
  const [noteText, setNoteText] = useState<string>('');
  const [savingNote, setSavingNote] = useState<boolean>(false);
  const [chatroomNote, setChatroomNote] = useState<string>('');
  const [chatroomNotes, setChatroomNotes] = useState<Note[]>([]);
  
  const websocketRef = useRef<WebSocket | null>(null);
  const wsReconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { userId, authToken } = useAuth();
  const { api } = useAuthenticatedApi();



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
      
      // Fetch notes for all chatrooms
      await fetchAllChatroomNotes();
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
      const wsUrl = `wss://backend.growupbuddy.com/ws/chats/${roomId}/?token=${authToken}`;
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
      // Fetch messages and notes in parallel
      const [messagesResponse, notesResponse] = await Promise.all([
        api.get(`/individualchats/chatrooms-messages/?room_id=${roomId}`),
        api.get(`/individualchats/chatroom-notes/?chatroom_id=${roomId}`)
      ]);
      
      console.log('API response for messages:', messagesResponse.data);
      console.log('API response for notes:', notesResponse.data);
      console.log('Messages array:', messagesResponse.data.results);
      
      if (messagesResponse.data.results && messagesResponse.data.results.length > 0) {
        console.log('First message structure:', messagesResponse.data.results[0]);
      }
      
      setMessages(messagesResponse.data.results || []);
      
      // Handle notes array
      const notes = notesResponse.data || [];
      setChatroomNotes(notes);
      
      // Get the most recent note (last in array) or empty string
      const latestNote = notes.length > 0 ? notes[notes.length - 1].note : '';
      setChatroomNote(latestNote);
      
      connectWebSocket(roomId);
      
      console.log('Messages and notes fetched successfully for room:', roomId);
    } catch (error) {
      console.error('Error fetching messages and notes:', error);
      
      // Fallback: try to fetch messages only if the combined request fails
      try {
        const messagesResponse = await api.get(`/individualchats/chatrooms-messages/?room_id=${roomId}`);
        setMessages(messagesResponse.data.results || []);
        connectWebSocket(roomId);
        console.log('Messages fetched successfully (fallback)');
      } catch (fallbackError) {
        console.error('Error fetching messages (fallback):', fallbackError);
      }
    }
  };

  const handleChatroomSelect = async (chatroom: Chatroom): Promise<void> => {
    setSelectedChatroom(chatroom);
    setShowSidebar(false);
    fetchMessages(chatroom.id);
    const details = await fetchChatroomDetails(chatroom.id);
    if (details) {
      setSelectedChatroom(prev => prev ? {...prev, ...details} : null);
    }
  };

  const handleBackToSidebar = (): void => {
    setShowSidebar(true);
    setSelectedChatroom(null);
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
    !chatroom.is_accepted && (
      chatroom.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      chatroom.chatting_with_current_user.name.toLowerCase().includes(searchInput.toLowerCase())
    )
  );

  const deleteMessage = async (messageId: string): Promise<void> => {
    if (!selectedChatroom?.id) return;
    
    setDeletingMessage(messageId);
    try {
      await api.delete(`/individualchats/chatrooms-messages/?id=${messageId}`);
      
      // Remove the message from local state
      setMessages(prevMessages => prevMessages.filter(msg => msg.message_id !== messageId));
      
      console.log('Message deleted successfully');
    } catch (error) {
      console.error('Error deleting message:', error);
      setWsError('Failed to delete message');
    } finally {
      setDeletingMessage(null);
    }
  };

  const openNoteDialog = (): void => {
    setNoteText(chatroomNote);
    setNoteDialogOpen(true);
  };

  const saveNote = async (): Promise<void> => {
    if (!selectedChatroom?.id) return;
    
    setSavingNote(true);
    try {
      // Always create a new note (POST request)
      await api.post(`/individualchats/chatroom-notes/?chatroom_id=${selectedChatroom.id}`, {
        note: noteText
      });
      
      // Refresh notes after saving
      await fetchChatroomNote();
      
      setNoteDialogOpen(false);
      setNoteText('');
      console.log('Chatroom note saved successfully');
    } catch (error) {
      console.error('Error saving chatroom note:', error);
      setWsError('Failed to save note');
    } finally {
      setSavingNote(false);
    }
  };

  const fetchAllChatroomNotes = async (): Promise<void> => {
    try {
      // Fetch notes for all chatrooms
      const notesPromises = chatrooms.map(async (chatroom) => {
        try {
          const response = await api.get(`/individualchats/chatroom-notes/?chatroom_id=${chatroom.id}`);
          return {
            chatroomId: chatroom.id,
            notes: response.data || []
          };
        } catch (error) {
          console.error(`Error fetching note for chatroom ${chatroom.id}:`, error);
          return {
            chatroomId: chatroom.id,
            notes: []
          };
        }
      });
      
      const notesData = await Promise.all(notesPromises);
      console.log('All chatroom notes fetched:', notesData);
    } catch (error) {
      console.error('Error fetching all chatroom notes:', error);
    }
  };

  const fetchChatroomNote = async (): Promise<void> => {
    if (!selectedChatroom?.id) return;
    
    try {
      const response = await api.get(`/individualchats/chatroom-notes/?chatroom_id=${selectedChatroom.id}`);
      const notes = response.data || [];
      setChatroomNotes(notes);
      
      // Get the most recent note (last in array) or empty string
      const latestNote = notes.length > 0 ? notes[notes.length - 1].note : '';
      setChatroomNote(latestNote);
      
      console.log('Chatroom notes fetched for:', selectedChatroom.id, notes);
    } catch (error) {
      console.error('Error fetching chatroom notes:', error);
      setChatroomNote('');
      setChatroomNotes([]);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'block' : 'hidden'} w-full md:block md:w-1/4 border-r bg-white md:relative absolute inset-0 z-10 md:z-auto`}>
        <div className="p-2 mt-16 md:mt-0 md:p-4 border-b">
          <div className="relative mb-2 md:mb-4">
            <BiSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search chats..."
              className="w-full rounded-lg bg-gray-100 py-2 pl-10 pr-4 text-sm md:text-base"
            />
          </div>
          
          <div className="flex border-b mb-2">
            <button
              onClick={() => setTab('active')}
              className={`flex-1 py-2 text-center text-sm md:text-base ${tab === 'active' ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
            >
              Active Chats
            </button>
            <button
              onClick={() => setTab('pending')}
              className={`flex-1 py-2 text-center text-sm md:text-base ${tab === 'pending' ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
            >
              Pending ({pendingChatrooms.length})
            </button>
          </div>
        </div>

        <div className="overflow-y-auto h-full pb-16 md:pb-0">
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
                    className={`flex items-center p-3 md:p-4 hover:bg-gray-50 cursor-pointer active:bg-gray-100 ${selectedChatroom?.id === chatroom.id ? 'bg-gray-100' : ''}`}
                    onClick={() => handleChatroomSelect(chatroom)}
                  >
                    <img
                      src={chatroom.chatting_with_current_user.image || '/default-avatar.png'}
                      alt={chatroom.chatting_with_current_user.name}
                      className="h-10 w-10 md:h-12 md:w-12 rounded-full mr-3 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm md:text-base truncate">{chatroom.chatting_with_current_user.name}</h3>
                      <p className="text-xs md:text-sm text-gray-500 truncate">{chatroom.name}</p>
                    </div>
                    <div className="text-xs text-gray-400 flex-shrink-0">
                      {chatroom.created_at && chatroom.created_at.trim() !== '' ? 
                        (() => {
                          const date = new Date(chatroom.created_at);
                          return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString();
                        })() 
                        : null
                      }
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
                  <div key={chatroom.id} className="flex items-center p-3 md:p-4 border-b">
                    <img
                      src={chatroom.chatting_with_current_user.image || '/default-avatar.png'}
                      alt={chatroom.chatting_with_current_user.name}
                      className="h-10 w-10 md:h-12 md:w-12 rounded-full mr-3 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm md:text-base truncate">{chatroom.chatting_with_current_user.name}</h3>
                      <p className="text-xs md:text-sm text-gray-500 truncate">{chatroom.name}</p>
                      <div className="text-xs text-gray-400 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {chatroom.created_at && chatroom.created_at.trim() !== '' ? 
                          (() => {
                            const date = new Date(chatroom.created_at);
                            return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString();
                          })() 
                          : null
                        }
                      </div>
                    </div>
                    <div className="flex gap-1 md:gap-2 flex-shrink-0">
                      <button 
                        onClick={() => handleChatroomAction(chatroom.id, true)}
                        className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 active:bg-green-300"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleChatroomAction(chatroom.id, false)}
                        className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 active:bg-red-300"
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

      {/* Main Chat Area */}
      <div className={`${!showSidebar ? 'block' : 'hidden'} md:block relative flex-1 flex flex-col h-full`}>
        {!selectedChatroom ? (
          <div className="flex-1 flex items-center justify-center flex-col text-gray-500 p-4 h-full">
            <MessageSquare className="h-12 w-12 md:h-16 md:w-16 mb-4 text-gray-300" />
            <p className="text-lg md:text-xl text-center">Select a chat to start messaging</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-3 md:p-4 border-b bg-white flex items-center flex-shrink-0">
              <button 
                onClick={handleBackToSidebar}
                className="md:hidden mr-3 p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <img
                src={selectedChatroom.chatting_with_current_user.image || '/default-avatar.png'}
                alt={selectedChatroom.chatting_with_current_user.name}
                className="h-8 w-8 md:h-10 md:w-10 rounded-full mr-3 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h2 className="font-medium text-sm md:text-base truncate">{selectedChatroom.chatting_with_current_user.name}</h2>
                <p className="text-xs md:text-sm text-gray-500 flex items-center">
                  {wsConnected ? 
                    <span className="text-green-500 flex items-center"><span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>Online</span> : 
                    <span className="text-gray-500 flex items-center"><span className="h-2 w-2 bg-gray-300 rounded-full mr-1"></span>Offline</span>
                  }
                </p>
              </div>
              <div className="flex items-center gap-2">
                {chatroomNote && (
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-200">
                    <FileText className="h-3 w-3 text-yellow-600" />
                    <span className="text-xs text-yellow-700 truncate max-w-32">{chatroomNote}</span>
                    {chatroomNotes.length > 1 && (
                      <span className="text-xs text-yellow-600 ml-1">
                        ({chatroomNotes.length})
                      </span>
                    )}
                  </div>
                )}
                <button
                  onClick={openNoteDialog}
                  className="p-2 hover:bg-gray-100 rounded-full"
                  title="Chat Notes"
                >
                  <FileText className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className=" h-[calc(100vh-20rem)] p-3 md:p-4 overflow-y-auto bg-gray-50 flex flex-col">
              {wsError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 md:px-4 py-2 md:py-3 rounded mb-4 text-sm">
                  <p>{wsError}</p>
                </div>
              )}
              
              {messages.length === 0 ? (
                <div className="flex-1 flex  items-center justify-center text-gray-500">
                  <p className="text-sm md:text-base">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <div className="flex flex-col h-96 space-y-1 md:space-y-2">
                  {messages.map((message) => {
                    const isCurrentUser = message.is_sender;
                    return (
                      <div 
                        key={message.message_id} 
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} group`}
                      >
                        <div 
                          className={`max-w-[85%] md:max-w-[70%] rounded-lg mb-2 p-2 md:p-3 ${
                            isCurrentUser ? 'bg-blue-500 text-white' : 'bg-white border'
                          } relative group`}
                        >
                          <p className="text-sm md:text-base">{message.message}</p>
                          <div className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'} flex items-center justify-between`}>
                            <span>
                              {(() => {
                                console.log('Message timestamp:', message.timestamp, 'Type:', typeof message.timestamp);
                                if (!message.timestamp || message.timestamp.trim() === '') {
                                  return 'No time';
                                }
                                const date = new Date(message.timestamp);
                                console.log('Parsed date:', date, 'Is valid:', !isNaN(date.getTime()));
                                return isNaN(date.getTime()) ? 'Invalid time' : date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                              })()}
                            </span>
                            {isCurrentUser && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 hover:bg-black/10 rounded">
                                    <MoreVertical className="h-3 w-3" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => deleteMessage(message.message_id)}
                                    disabled={deletingMessage === message.message_id}
                                    className="text-red-600 cursor-pointer"
                                  >
                                    {deletingMessage === message.message_id ? 'Deleting...' : 'Delete'}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="absolute bottom-40 left-0 right-0 p-3 md:p-4 border-t bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-lg border p-2 md:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
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
                  className="bg-blue-500 text-white rounded-lg px-3 md:px-4 py-2 md:py-3 hover:bg-blue-600 active:bg-blue-700 flex-shrink-0"
                  disabled={!wsConnected}
                >
                  <Send className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

        {/* Note Dialog */}
        <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {chatroomNote ? 'Edit Chat Note' : 'Add Chat Note'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="note" className="text-sm font-medium">
                  Note
                </label>
                <Textarea
                  id="note"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Enter your note for this chat..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setNoteDialogOpen(false);
                  setNoteText('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={saveNote}
                disabled={savingNote || !noteText.trim()}
              >
                {savingNote ? 'Saving...' : 'Save Note'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
    </div>
  );
};

export default ChatInterface;