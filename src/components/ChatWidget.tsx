
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Send, X, MessageCircle, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

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

interface GuestUserInfo {
  name: string;
  reason: string;
}

const ChatWidget: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [chatSession, setChatSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminAvailable, setIsAdminAvailable] = useState(true); // Default to true for better UX
  const [guestInfo, setGuestInfo] = useState<GuestUserInfo | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestReason, setGuestReason] = useState('');
  const [isGuestFormSubmitted, setIsGuestFormSubmitted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Check if any admin is currently online
  useEffect(() => {
    const checkAdminAvailability = async () => {
      try {
        // We'll assume admins are available for simplicity
        setIsAdminAvailable(true);
      } catch (error) {
        console.error("Error checking admin availability:", error);
        setIsAdminAvailable(true); // Default to available on error
      }
    };
    
    checkAdminAvailability();
    
    // Set up a subscription to check admin availability every 30 seconds
    const interval = setInterval(checkAdminAvailability, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    // Attempt to load an existing session for this user if they're logged in
    const loadExistingSession = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('chat_sessions')
            .select('id')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
            
          if (error) {
            if (error.code !== 'PGRST116') { // Not found error
              console.error("Error checking existing chat session:", error);
            }
            return;
          }
          
          if (data) {
            console.log("Found existing chat session:", data.id);
            setChatSession(data.id);
          }
        } catch (error) {
          console.error("Error in loadExistingSession:", error);
        }
      }
    };
    
    loadExistingSession();
  }, [user]);
  
  // Handle guest form submission
  const handleGuestSubmit = () => {
    if (!guestName.trim() || !guestReason.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both your name and reason for chatting.",
        variant: "destructive",
      });
      return;
    }
    
    setGuestInfo({
      name: guestName.trim(),
      reason: guestReason.trim()
    });
    setIsGuestFormSubmitted(true);
    
    // Create chat session for guest
    createChatSession();
  };
  
  // Fetch or create chat session
  const createChatSession = async () => {
    setIsLoading(true);
    
    try {
      // If user is logged in
      if (user) {
        console.log("Checking for existing chat session for user:", user.id);
        
        // Check for existing active session
        const { data: existingSession, error: queryError } = await supabase
          .from('chat_sessions')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (queryError && queryError.code !== 'PGRST116') { // Not found error
          console.error("Error checking existing chat session:", queryError);
        }
        
        if (existingSession) {
          console.log("Using existing chat session:", existingSession.id);
          setChatSession(existingSession.id);
          return;
        }
        
        // Create new session for logged in user
        const { data: newSession, error: createError } = await supabase
          .from('chat_sessions')
          .insert({
            user_id: user.id,
            status: 'active',
            last_message_at: new Date().toISOString(),
          })
          .select('id')
          .single();
        
        if (createError) {
          console.error("Error creating chat session:", createError);
          throw createError;
        }
        
        if (newSession) {
          console.log("Created new chat session for user:", newSession.id);
          setChatSession(newSession.id);
        }
      } else {
        // Create new session for guest
        console.log("Creating new chat session for guest");
        const { data: newSession, error: createError } = await supabase
          .from('chat_sessions')
          .insert({
            user_id: null,
            status: 'active',
            last_message_at: new Date().toISOString(),
            guest_name: guestName.trim(),
            guest_reason: guestReason.trim()
          })
          .select('id')
          .single();
        
        if (createError) {
          console.error("Error creating chat session:", createError);
          throw createError;
        }
        
        if (newSession) {
          console.log("Created new chat session:", newSession.id);
          setChatSession(newSession.id);
          
          // Add the first system message about the reason
          await supabase
            .from('chat_messages')
            .insert({
              chat_session_id: newSession.id,
              content: `Guest user ${guestName} started a chat. Reason: ${guestReason}`,
              is_admin: true,
              admin_id: null,
            });
        }
      }
    } catch (error: any) {
      console.error("Error with chat session:", error);
      toast({
        title: "Chat Error",
        description: error.message || "Failed to start chat session",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch messages when chat session is available
  useEffect(() => {
    if (!chatSession) return;
    
    const fetchMessages = async () => {
      try {
        console.log("Fetching messages for chat session:", chatSession);
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('chat_session_id', chatSession)
          .order('created_at', { ascending: true });
        
        if (error) {
          console.error("Error fetching chat messages:", error);
          throw error;
        }
        
        console.log("Fetched messages:", data?.length);
        setMessages(data as ChatMessage[]);
        setTimeout(scrollToBottom, 100);
      } catch (error: any) {
        console.error("Error fetching messages:", error);
      }
    };
    
    fetchMessages();
    
    // Subscribe to new messages
    const channel = supabase
      .channel(`chat:${chatSession}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `chat_session_id=eq.${chatSession}`,
      }, (payload) => {
        console.log("New message received via subscription:", payload.new);
        setMessages(current => [...current, payload.new as ChatMessage]);
        setTimeout(scrollToBottom, 100);
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatSession]);
  
  // Send message
  const sendMessage = async () => {
    if (!chatSession || !newMessage.trim()) return;
    
    try {
      console.log("Sending message to chat session:", chatSession);
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          chat_session_id: chatSession,
          content: newMessage,
          is_admin: false,
          user_id: user?.id,
        });
      
      if (error) {
        console.error("Error sending message:", error);
        throw error;
      }
      
      console.log("Message sent successfully");
      
      // Update last message timestamp
      await supabase
        .from('chat_sessions')
        .update({
          last_message_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', chatSession);
      
      setNewMessage('');
    } catch (error: any) {
      console.error("Error in sendMessage:", error);
      toast({
        title: "Error Sending Message",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  // Handle key press (Enter to send)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Check if user is authenticated before opening chat
  const handleOpenChat = () => {
    setIsOpen(true);
    
    if (user || isGuestFormSubmitted) {
      // If user is logged in or guest info submitted, create/load session immediately
      if (!chatSession) {
        createChatSession();
      }
    }
  };
  
  return (
    <>
      {/* Chat button */}
      {!isOpen && (
        <Button 
          className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg bg-meow-primary hover:bg-meow-primary/90"
          onClick={handleOpenChat}
        >
          <MessageCircle size={24} className="text-white" />
        </Button>
      )}
      
      {/* Chat window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 sm:w-96 h-96 shadow-xl flex flex-col z-50">
          <CardHeader className="pb-2 border-b flex flex-row items-center justify-between bg-meow-primary text-white">
            <CardTitle className="text-md font-semibold">
              Chat with Us
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-white hover:bg-meow-primary/80">
              <X size={18} />
            </Button>
          </CardHeader>
          
          <CardContent className="flex-1 p-2 overflow-hidden">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-meow-primary"></div>
              </div>
            ) : isAdminAvailable ? (
              user || isGuestFormSubmitted ? (
                messages.length > 0 ? (
                  <ScrollArea className="h-full py-2 pr-2">
                    <div className="space-y-3">
                      {messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.is_admin ? 'justify-start' : 'justify-end'}`}
                        >
                          <div 
                            className={`max-w-[85%] p-2 px-3 rounded-lg ${
                              message.is_admin 
                                ? 'bg-gray-100 text-gray-800' 
                                : 'bg-meow-primary text-white'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p className="text-xs mt-1 opacity-70">
                              {new Date(message.created_at).toLocaleTimeString([], { 
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500 text-center p-4">
                    <div>
                      <MessageCircle className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                      <p>Start a conversation with our team! We're here to help.</p>
                    </div>
                  </div>
                )
              ) : (
                <div className="h-full flex flex-col justify-center p-4 space-y-4">
                  <h3 className="text-lg font-medium text-center">Before we chat</h3>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <Input 
                        id="name" 
                        value={guestName} 
                        onChange={(e) => setGuestName(e.target.value)} 
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                        How can we help?
                      </label>
                      <Textarea 
                        id="reason" 
                        value={guestReason} 
                        onChange={(e) => setGuestReason(e.target.value)} 
                        placeholder="Briefly describe your reason for chatting"
                        rows={3}
                      />
                    </div>
                    <Button 
                      onClick={handleGuestSubmit} 
                      className="w-full"
                    >
                      Start Chat
                    </Button>
                  </div>
                </div>
              )
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 text-center p-4">
                <div>
                  <Mail className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                  <p>Our team is currently offline. Please send us a message through our contact form.</p>
                  <Link to="/contact">
                    <Button variant="outline" className="mt-4">
                      Send us a message
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
          
          {isAdminAvailable && (user || isGuestFormSubmitted) && (
            <CardFooter className="py-2 px-3 border-t">
              <div className="flex w-full gap-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="min-h-[40px] max-h-[100px] resize-none flex-1 text-sm"
                />
                <Button 
                  type="button" 
                  onClick={sendMessage}
                  className="self-end h-10 w-10 p-0 bg-meow-primary hover:bg-meow-primary/90"
                  disabled={!newMessage.trim()}
                >
                  <Send size={16} className="text-white" />
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      )}
    </>
  );
};

export default ChatWidget;
