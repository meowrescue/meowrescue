
import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import getSupabaseClient from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { User, MessageCircle, Send } from 'lucide-react';
import { User as UserType } from '@/types/users';

// Define types for chat session and messages
interface ChatSession {
  id: string;
  user_id: string | null;
  status: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
  guest_name?: string;
  guest_reason?: string;
  user_profile?: {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
  };
}

interface ChatMessage {
  id: string;
  chat_session_id: string;
  user_id?: string;
  admin_id?: string;
  is_admin: boolean;
  content: string;
  created_at: string;
  read_at?: string;
}

const AdminChat: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isManualScroll, setIsManualScroll] = useState(false);

  // Scroll to bottom of messages - improved version
  const scrollToBottom = () => {
    if (messagesEndRef.current && !isManualScroll) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Fetch active chat sessions
  const { data: chatSessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['chat-sessions'],
    queryFn: async () => {
      try {
        console.log("Fetching chat sessions");
        
        // First get chat sessions
        const { data: sessionsData, error: sessionsError } = await getSupabaseClient()
          .from('chat_sessions')
          .select('*')
          .eq('status', 'active')
          .order('last_message_at', { ascending: false });
        
        if (sessionsError) {
          console.error("Error fetching chat sessions:", sessionsError);
          throw sessionsError;
        }
        
        if (!sessionsData || sessionsData.length === 0) {
          return [] as ChatSession[];
        }
        
        // Then get user profiles separately for sessions with user_id
        const sessionsWithProfiles = await Promise.all(
          sessionsData.map(async (session) => {
            if (session.user_id) {
              try {
                const { data: profileData, error: profileError } = await getSupabaseClient()
                  .from('profiles')
                  .select('id, first_name, last_name, email')
                  .eq('id', session.user_id)
                  .single();
                  
                if (profileError) {
                  console.error("Error fetching user profile:", profileError);
                  return {
                    ...session,
                    user_profile: undefined
                  };
                }
                
                return {
                  ...session,
                  user_profile: profileData
                };
              } catch (err) {
                console.error("Error fetching profile for user:", session.user_id, err);
                return {
                  ...session,
                  user_profile: undefined
                };
              }
            }
            
            return session;
          })
        );
        
        console.log("Chat sessions fetched and combined with profiles:", sessionsWithProfiles);
        return sessionsWithProfiles as ChatSession[];
      } catch (err) {
        console.error("Error in chat sessions query:", err);
        toast({
          title: "Error Loading Chats",
          description: err instanceof Error ? err.message : "Failed to load chat sessions",
          variant: "destructive",
        });
        return [] as ChatSession[];
      }
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Fetch messages for selected chat
  const { data: chatMessages, isLoading: messagesLoading } = useQuery({
    queryKey: ['chat-messages', selectedChatId],
    queryFn: async () => {
      if (!selectedChatId) return [];
      
      try {
        console.log("Fetching messages for chat:", selectedChatId);
        const { data, error } = await getSupabaseClient()
          .from('chat_messages')
          .select('*')
          .eq('chat_session_id', selectedChatId)
          .order('created_at', { ascending: true });
        
        if (error) {
          console.error("Error fetching chat messages:", error);
          toast({
            title: "Error Loading Messages",
            description: error.message,
            variant: "destructive",
          });
          return [] as ChatMessage[];
        }
        
        console.log("Chat messages fetched:", data?.length);
        
        // Mark messages as read if not admin's messages
        const unreadMessages = (data as ChatMessage[]).filter(message => !message.is_admin && !message.read_at);
        if (unreadMessages.length > 0) {
          console.log("Marking messages as read:", unreadMessages.length);
          const unreadIds = unreadMessages.map(msg => msg.id);
          await getSupabaseClient()
            .from('chat_messages')
            .update({ read_at: new Date().toISOString() })
            .in('id', unreadIds);
        }
        
        if (data) {
          setTimeout(() => {
            if (!isManualScroll) {
              scrollToBottom();
            }
          }, 100);
          return data as ChatMessage[];
        }
        return [] as ChatMessage[];
      } catch (err) {
        console.error("Error in chat messages query:", err);
        return [] as ChatMessage[];
      }
    },
    enabled: !!selectedChatId,
    refetchInterval: selectedChatId ? 5000 : false, // Poll for new messages if chat is selected
  });

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    if (!isManualScroll) {
      scrollToBottom();
    }
  }, [chatMessages]);

  // Handle manual scrolling
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      
      // If we're not at the bottom, user is scrolling up
      if (scrollHeight - scrollTop - clientHeight > 20) {
        setIsManualScroll(true);
      } else {
        // If we're at the bottom, resume auto-scrolling
        setIsManualScroll(false);
      }
    }
  };

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      if (!selectedChatId || !content.trim()) return;
      
      try {
        console.log("Sending admin message to chat:", selectedChatId);
        const adminId = (await getSupabaseClient().auth.getUser()).data.user?.id;
        
        // Create message object
        const newMessageObj = {
          chat_session_id: selectedChatId,
          content: content.trim(),
          is_admin: true,
          admin_id: adminId,
        };
        
        // First update UI optimistically
        const tempMessage = {
          ...newMessageObj,
          id: 'temp-' + Date.now(),
          created_at: new Date().toISOString(),
        } as ChatMessage;
        
        queryClient.setQueryData(['chat-messages', selectedChatId], 
          (oldData: ChatMessage[] | undefined) => oldData ? [...oldData, tempMessage] : [tempMessage]);
        
        // Then insert into database
        const { error: messageError } = await getSupabaseClient()
          .from('chat_messages')
          .insert(newMessageObj);
        
        if (messageError) {
          console.error("Error inserting message:", messageError);
          throw messageError;
        }
        
        // Update last message timestamp
        const { error: sessionError } = await getSupabaseClient()
          .from('chat_sessions')
          .update({
            last_message_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', selectedChatId);
        
        if (sessionError) {
          console.error("Error updating chat session:", sessionError);
          throw sessionError;
        }
        
        console.log("Message sent successfully");
      } catch (err) {
        console.error("Error sending message:", err);
        throw err;
      }
    },
    onSuccess: () => {
      setNewMessage('');
      setIsManualScroll(false); // Reset to auto-scroll when sending a message
      queryClient.invalidateQueries({ queryKey: ['chat-messages', selectedChatId] });
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
      setTimeout(scrollToBottom, 100);
    },
    onError: (error: any) => {
      console.error("Error in send message mutation:", error);
      toast({
        title: "Error Sending Message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage.mutate(newMessage);
    }
  };

  // Handle Enter key in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Close chat session
  const closeChat = useMutation({
    mutationFn: async (chatId: string) => {
      try {
        console.log("Closing chat session:", chatId);
        const { error } = await getSupabaseClient()
          .from('chat_sessions')
          .update({
            status: 'closed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', chatId);
        
        if (error) {
          console.error("Error closing chat session:", error);
          throw error;
        }
        
        console.log("Chat session closed successfully");
      } catch (err) {
        console.error("Error in close chat mutation:", err);
        throw err;
      }
    },
    onSuccess: () => {
      setSelectedChatId(null);
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
      toast({
        title: "Chat Closed",
        description: "The chat session has been closed.",
      });
    },
    onError: (error: any) => {
      console.error("Error closing chat:", error);
      toast({
        title: "Error Closing Chat",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Get user display name for chat session
  const getChatDisplayName = (session: ChatSession) => {
    if (session.guest_name) {
      return `${session.guest_name} (Guest)`;
    }
    
    if (session.user_profile) {
      return `${session.user_profile.first_name || ''} ${session.user_profile.last_name || ''}`.trim() || 'Anonymous User';
    }
    
    return 'Anonymous User';
  };

  return (
    <AdminLayout title="Live Chat">
      <SEO title="Live Chat | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-meow-primary">Live Chat</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Chat Sessions List */}
          <div className="md:col-span-1">
            <Card className="h-[calc(100vh-12rem)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Active Chats</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-16rem)]">
                  {sessionsLoading ? (
                    <div className="flex justify-center py-6">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-meow-primary"></div>
                    </div>
                  ) : chatSessions && chatSessions.length > 0 ? (
                    <div className="space-y-1">
                      {chatSessions.map((session) => (
                        <div
                          key={session.id}
                          className={`p-3 hover:bg-gray-50 cursor-pointer ${
                            selectedChatId === session.id ? 'bg-meow-primary/10' : ''
                          }`}
                          onClick={() => {
                            setSelectedChatId(session.id);
                            setIsManualScroll(false);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="bg-gray-200 rounded-full p-2">
                              <User size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {getChatDisplayName(session)}
                              </p>
                              {session.guest_reason && (
                                <p className="text-xs text-gray-500 truncate">
                                  Reason: {session.guest_reason}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 truncate">
                                {new Date(session.last_message_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      <MessageCircle className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                      <p>No active chat sessions</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          
          {/* Chat Messages */}
          <div className="md:col-span-3">
            <Card className="h-[calc(100vh-12rem)] flex flex-col">
              <CardHeader className="pb-2 border-b flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  {selectedChatId && chatSessions ? (
                    <>
                      {getChatDisplayName(chatSessions.find(s => s.id === selectedChatId) as ChatSession)}
                    </>
                  ) : (
                    'Select a Chat'
                  )}
                </CardTitle>
                {selectedChatId && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => closeChat.mutate(selectedChatId)}
                  >
                    Close Chat
                  </Button>
                )}
              </CardHeader>
              
              <CardContent className="flex-1 p-0 flex flex-col">
                {selectedChatId ? (
                  <>
                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-hidden">
                      <ScrollArea 
                        className="h-full pr-4" 
                        ref={scrollAreaRef} 
                        onScrollCapture={handleScroll}
                      >
                        {messagesLoading ? (
                          <div className="flex justify-center py-6">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-meow-primary"></div>
                          </div>
                        ) : chatMessages && chatMessages.length > 0 ? (
                          <div className="space-y-4">
                            {chatMessages.map((message) => (
                              <div 
                                key={message.id} 
                                className={`flex ${message.is_admin ? 'justify-end' : 'justify-start'}`}
                              >
                                <div 
                                  className={`max-w-[80%] p-3 rounded-lg ${
                                    message.is_admin 
                                      ? 'bg-meow-primary text-white' 
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                  <p className="text-xs mt-1 opacity-70">
                                    {new Date(message.created_at).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                            <div ref={messagesEndRef} />
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-gray-500">
                            <p>No messages yet</p>
                          </div>
                        )}
                      </ScrollArea>
                    </div>
                    
                    {/* Message Input */}
                    <div className="p-3 border-t">
                      <div className="flex gap-2">
                        <Textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Type your message..."
                          className="min-h-[60px] resize-none flex-1"
                        />
                        <Button 
                          type="button" 
                          onClick={handleSendMessage}
                          className="self-end"
                          disabled={sendMessage.isPending || !newMessage.trim()}
                        >
                          <Send size={16} />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <MessageCircle className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                      <p>Select a chat from the sidebar to view messages</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminChat;
