
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send, X, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [guestName, setGuestName] = useState('');
  const [guestReason, setGuestReason] = useState('');
  const [step, setStep] = useState<'info' | 'chat'>('info');
  const [session, setSession] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If the user is logged in, we can skip the info step
    if (user) {
      setStep('chat');
    }
  }, [user]);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedSessionId = localStorage.getItem('chatSessionId');
    
    if (savedSessionId) {
      fetchSession(savedSessionId);
      fetchMessages(savedSessionId);
    }
  }, []);

  useEffect(() => {
    // Set up real-time subscription for new messages
    if (session?.id) {
      const channel = supabase
        .channel('chat-updates')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `chat_session_id=eq.${session.id}`
          },
          (payload) => {
            // Add the new message to our state
            setMessages(current => [...current, payload.new]);
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session?.id]);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  const fetchSession = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setSession(data);
        setGuestName(data.guest_name || '');
        setGuestReason(data.guest_reason || '');
        setStep('chat');
      }
    } catch (error) {
      console.error('Error fetching chat session:', error);
      // Clear invalid session
      localStorage.removeItem('chatSessionId');
    }
  };

  const fetchMessages = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_session_id', sessionId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      if (data) {
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleStartChat = async () => {
    if (!guestName) {
      toast({
        title: "Name Required",
        description: "Please enter your name to start chatting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create a new chat session
      const { data: sessionData, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert([
          { 
            guest_name: guestName,
            guest_reason: guestReason,
            user_id: user?.id,
            status: 'active'
          }
        ])
        .select()
        .single();
      
      if (sessionError) throw sessionError;
      
      // Store the session
      setSession(sessionData);
      localStorage.setItem('chatSessionId', sessionData.id);
      
      // Add system message
      const { error: messageError } = await supabase
        .from('chat_messages')
        .insert([
          {
            chat_session_id: sessionData.id,
            content: `Welcome to our chat! Someone from our team will assist you shortly.`,
            is_admin: true,
            user_id: user?.id
          }
        ]);
      
      if (messageError) throw messageError;
      
      // Transition to chat screen
      setStep('chat');
      fetchMessages(sessionData.id);
    } catch (error) {
      console.error('Error starting chat:', error);
      toast({
        title: "Error",
        description: "Failed to start chat. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !session?.id) return;
    
    setIsSubmitting(true);
    
    try {
      // Send the message
      const { error } = await supabase
        .from('chat_messages')
        .insert([
          {
            chat_session_id: session.id,
            content: message.trim(),
            is_admin: false,
            user_id: user?.id
          }
        ]);
      
      if (error) throw error;
      
      // Clear the input
      setMessage('');
      
      // Refresh messages
      fetchMessages(session.id);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen ? (
        <div 
          ref={chatBoxRef}
          className="bg-white rounded-xl shadow-2xl w-80 md:w-96 overflow-hidden flex flex-col transition-all duration-300 ease-in-out"
          style={{ height: '500px', maxHeight: '80vh' }}
        >
          {/* Header */}
          <div className="bg-meow-primary text-white p-4 flex items-center justify-between">
            <div className="flex items-center">
              {step === 'chat' && session && (
                <button 
                  onClick={() => setStep('info')} 
                  className="mr-2 p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                  <ArrowLeft size={18} />
                </button>
              )}
              <MessageSquare className="mr-2" size={20} />
              <h3 className="font-semibold">Chat with Us</h3>
            </div>
            <button 
              onClick={handleCloseChat}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          
          {/* Content */}
          {step === 'info' ? (
            <div className="flex-1 p-4 overflow-y-auto">
              <p className="text-gray-600 mb-4">
                Please provide your information to start chatting with our team.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name*</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-meow-primary"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">How can we help you?</label>
                  <textarea
                    value={guestReason}
                    onChange={(e) => setGuestReason(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-meow-primary"
                    placeholder="Tell us about your inquiry..."
                  />
                </div>
                <Button 
                  onClick={handleStartChat} 
                  disabled={isSubmitting || !guestName.trim()}
                  className="w-full"
                >
                  {isSubmitting ? 'Starting Chat...' : 'Start Chat'}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 p-4 overflow-y-auto">
                {messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.is_admin ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.is_admin
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-meow-primary text-white'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {formatDistanceToNow(new Date(msg.created_at), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-center">
                    <p className="text-gray-500">
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                )}
              </div>
              <div className="p-4 border-t">
                <div className="flex items-end gap-2">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="resize-none"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={isSubmitting || !message.trim()}
                  >
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-meow-primary hover:bg-meow-primary/90 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-105"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
