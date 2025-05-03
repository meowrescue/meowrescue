
import React, { useState, useEffect } from 'react';
import { MessageSquareText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';
import getSupabaseClient from '@/integrations/getSupabaseClient()/client';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWidget, setShowWidget] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Only show the chat widget on public pages, not on admin pages
    const currentPath = location.pathname;
    const isAdminPage = currentPath.startsWith('/admin');
    setShowWidget(!isAdminPage);
  }, [location]);

  // Initialize or join a chat session
  useEffect(() => {
    if (!isOpen || chatSessionId) return;
    
    const initializeChat = async () => {
      try {
        // Check for existing chat session in local storage
        const storedSessionId = localStorage.getItem('chatSessionId');
        
        
        if (storedSessionId) {
          setChatSessionId(storedSessionId);
          // Fetch existing messages
          const { data, error } = await getSupabaseClient()
            .from('chat_messages')
            .select('*')
            .eq('chat_session_id', storedSessionId)
            .order('created_at', { ascending: true });
          if (error) throw error;
          setMessages(data || []);
        } else {
          // Create a new chat session
          const { data, error } = await getSupabaseClient()
            .from('chat_sessions')
            .insert([{ status: 'active' }])
            .select()
            .single();
          if (error) throw error;
          const newSessionId = data.id;
          setChatSessionId(newSessionId);
          localStorage.setItem('chatSessionId', newSessionId);
        }
      } catch (err) {
        console.error('Error initializing chat:', err);
      }
    };
    
    initializeChat();
  }, [isOpen, chatSessionId]);

  // Subscribe to real-time updates for chat messages
  useEffect(() => {
    if (!chatSessionId) return;
    
    
    const subscription = getSupabaseClient()
      .channel(`chat-session-${chatSessionId}-updates`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages', filter: `chat_session_id=eq.${chatSessionId}` }, (payload) => {
        console.log('Chat message update received:', payload);
        setMessages(prevMessages => [...prevMessages, payload.new]);
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [chatSessionId]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatSessionId) return;
    
    try {
      
      const { data, error } = await getSupabaseClient()
        .from('chat_messages')
        .insert([{
          chat_session_id: chatSessionId,
          content: newMessage,
          is_admin: false
        }]);
      if (error) throw error;
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {showWidget && (
        isOpen ? (
          <div className="w-[400px] h-[500px] bg-white rounded-lg shadow-lg overflow-hidden flex flex-col animate-in slide-in-from-bottom-5">
            <div className="bg-meow-primary p-3 flex justify-between items-center text-white">
              <h3 className="font-bold">Chat with Meow Rescue</h3>
              <Button variant="ghost" onClick={toggleChat} className="hover:bg-meow-primary/30 p-1 h-auto text-white">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center">No messages yet. Start the conversation!</p>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className={`p-2 rounded-lg ${msg.is_admin ? 'bg-meow-primary/20 self-start' : 'bg-gray-100 self-end'}`}>
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(msg.created_at).toLocaleTimeString()}</p>
                  </div>
                ))
              )}
            </div>
            <div className="p-3 border-t border-gray-200 flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button onClick={sendMessage} className="bg-meow-primary hover:bg-meow-primary/90">
                Send
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            onClick={toggleChat} 
            className="h-12 w-12 rounded-full bg-meow-primary hover:bg-meow-primary/90 flex items-center justify-center"
          >
            <MessageSquareText className="h-6 w-6 text-white" />
          </Button>
        )
      )}
    </div>
  );
};

export default ChatWidget;
