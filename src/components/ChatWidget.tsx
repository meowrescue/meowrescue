
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Send, X, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from '@/types/supabase';

const ChatWidget: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [chatSession, setChatSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Fetch or create chat session
  useEffect(() => {
    if (isOpen && user) {
      const fetchOrCreateSession = async () => {
        setIsLoading(true);
        
        try {
          // Check for existing active session
          const { data: existingSessions, error: fetchError } = await supabase
            .from('chat_sessions')
            .select('id')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(1);
          
          if (fetchError) throw fetchError;
          
          if (existingSessions && existingSessions.length > 0) {
            setChatSession(existingSessions[0].id);
          } else {
            // Create new session
            const { data: newSession, error: createError } = await supabase
              .from('chat_sessions')
              .insert({
                user_id: user.id,
                status: 'active',
                last_message_at: new Date().toISOString(),
              })
              .select('id')
              .single();
            
            if (createError) throw createError;
            
            if (newSession) {
              setChatSession(newSession.id);
            }
          }
        } catch (error: any) {
          toast({
            title: "Chat Error",
            description: error.message || "Failed to start chat session",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchOrCreateSession();
    }
  }, [isOpen, user, toast]);
  
  // Fetch messages when chat session is available
  useEffect(() => {
    if (!chatSession) return;
    
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('chat_session_id', chatSession)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        setMessages(data as ChatMessage[]);
        setTimeout(scrollToBottom, 100);
      } catch (error: any) {
        console.error("Error fetching messages:", error);
      }
    };
    
    fetchMessages();
    
    // Subscribe to new messages
    const subscription = supabase
      .channel(`chat:${chatSession}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `chat_session_id=eq.${chatSession}`,
      }, (payload) => {
        setMessages(current => [...current, payload.new as ChatMessage]);
        setTimeout(scrollToBottom, 100);
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [chatSession]);
  
  // Send message
  const sendMessage = async () => {
    if (!chatSession || !newMessage.trim()) return;
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          chat_session_id: chatSession,
          content: newMessage,
          is_admin: false,
          user_id: user?.id,
        });
      
      if (error) throw error;
      
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
  
  return (
    <>
      {/* Chat button */}
      {!isOpen && (
        <Button 
          className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle size={24} />
        </Button>
      )}
      
      {/* Chat window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 sm:w-96 h-96 shadow-xl flex flex-col z-50">
          <CardHeader className="pb-2 border-b flex flex-row items-center justify-between">
            <CardTitle className="text-md font-semibold">
              Chat with Us
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </Button>
          </CardHeader>
          
          <CardContent className="flex-1 p-2 overflow-hidden">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-meow-primary"></div>
              </div>
            ) : messages.length > 0 ? (
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
            )}
          </CardContent>
          
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
                className="self-end h-10 w-10 p-0"
                disabled={!newMessage.trim()}
              >
                <Send size={16} />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default ChatWidget;
