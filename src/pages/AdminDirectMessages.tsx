
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import getSupabaseClient from '@/integrations/getSupabaseClient()/client';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, User, Send, Search, Plus,
  Users, Clock, CheckCheck, ArrowRightLeft
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SEO from '@/components/SEO';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User as UserType } from '@/types/users';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string | null;
  role: string;
}

interface DirectMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
  sender: UserProfile;
  recipient: UserProfile;
}

interface Conversation {
  userId: string;
  userName: string;
  userRole: string;
  userAvatar: string | null;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

const AdminDirectMessages = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [newMessageRecipient, setNewMessageRecipient] = useState('');
  
  // Fetch user profiles (for sending messages)
  const { data: profiles } = useQuery({
    queryKey: ['user-profiles'],
    queryFn: async () => {
      const { data, error } = await getSupabaseClient()
        .from('profiles')
        .select('id, first_name, last_name, email, avatar_url, role')
        .eq('is_active', true)
        .not('id', 'eq', user?.id || '');
      
      if (error) throw error;
      return data as UserProfile[];
    },
    enabled: !!user?.id,
  });

  // Fetch messages
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ['direct-messages', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await getSupabaseClient()
        .from('direct_messages')
        .select(`
          id, 
          sender_id, 
          recipient_id, 
          content, 
          created_at, 
          read_at,
          sender:profiles!direct_messages_sender_id_fkey(id, first_name, last_name, email, avatar_url, role),
          recipient:profiles!direct_messages_recipient_id_fkey(id, first_name, last_name, email, avatar_url, role)
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform data to ensure sender and recipient are objects not arrays
      const transformedData = data.map(msg => ({
        ...msg,
        sender: Array.isArray(msg.sender) ? msg.sender[0] : msg.sender,
        recipient: Array.isArray(msg.recipient) ? msg.recipient[0] : msg.recipient
      }));
      
      return transformedData as DirectMessage[];
    },
    enabled: !!user?.id,
  });

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (selectedConversation && user?.id) {
      const markAsRead = async () => {
        const { error } = await getSupabaseClient()
          .from('direct_messages')
          .update({ read_at: new Date().toISOString() })
          .eq('sender_id', selectedConversation)
          .eq('recipient_id', user.id)
          .is('read_at', null);
        
        if (!error) {
          queryClient.invalidateQueries({ queryKey: ['direct-messages', user.id] });
        }
      };
      
      markAsRead();
    }
  }, [selectedConversation, user?.id, queryClient]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ recipientId, content }: { recipientId: string; content: string }) => {
      const { data, error } = await getSupabaseClient()
        .from('direct_messages')
        .insert([{
          sender_id: user?.id,
          recipient_id: recipientId,
          content,
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setMessageContent('');
      queryClient.invalidateQueries({ queryKey: ['direct-messages', user?.id] });
      
      if (newMessageOpen) {
        setNewMessageOpen(false);
        setSelectedConversation(newMessageRecipient);
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message',
        variant: 'destructive',
      });
    }
  });

  // Organize messages into conversations
  const conversations = React.useMemo(() => {
    if (!messages || !user) return [];
    
    const conversationsMap = new Map<string, Conversation>();
    
    messages.forEach(message => {
      const isIncoming = message.recipient_id === user.id;
      const otherUserId = isIncoming ? message.sender_id : message.recipient_id;
      
      // Skip if the message is to self
      if (message.sender_id === message.recipient_id) return;
      
      const otherUser = isIncoming ? message.sender : message.recipient;
      
      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          userId: otherUserId,
          userName: `${otherUser.first_name} ${otherUser.last_name}`,
          userRole: otherUser.role,
          userAvatar: otherUser.avatar_url,
          lastMessage: message.content,
          lastMessageTime: message.created_at,
          unreadCount: 0,
        });
      }
      
      // Update last message if this is more recent
      const convo = conversationsMap.get(otherUserId)!;
      if (new Date(message.created_at) > new Date(convo.lastMessageTime)) {
        convo.lastMessage = message.content;
        convo.lastMessageTime = message.created_at;
      }
      
      // Count unread incoming messages
      if (isIncoming && !message.read_at) {
        convo.unreadCount += 1;
      }
    });
    
    return Array.from(conversationsMap.values())
      .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
  }, [messages, user]);

  // Filter conversations by search query
  const filteredConversations = conversations.filter(convo => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return convo.userName.toLowerCase().includes(query);
  });

  // Get active conversation messages
  const conversationMessages = React.useMemo(() => {
    if (!messages || !selectedConversation) return [];
    
    return messages
      .filter(message => 
        (message.sender_id === selectedConversation && message.recipient_id === user?.id) ||
        (message.sender_id === user?.id && message.recipient_id === selectedConversation)
      )
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }, [messages, selectedConversation, user?.id]);

  // Get selected conversation info
  const selectedConversationInfo = React.useMemo(() => {
    return conversations.find(convo => convo.userId === selectedConversation);
  }, [conversations, selectedConversation]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageContent.trim()) return;
    
    if (selectedConversation) {
      sendMessageMutation.mutate({
        recipientId: selectedConversation,
        content: messageContent.trim(),
      });
    }
  };

  const handleNewMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessageRecipient || !messageContent.trim()) return;
    
    sendMessageMutation.mutate({
      recipientId: newMessageRecipient,
      content: messageContent.trim(),
    });
  };

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    const parts = name.split(' ').filter(Boolean);
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0][0].toUpperCase();
  };

  return (
    <AdminLayout title="Direct Messages">
      <SEO title="Direct Messages | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-meow-primary">Direct Messages</h1>
          
          <div className="flex gap-4">
            <Button onClick={() => setNewMessageOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Message
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Conversations list */}
          <div className="md:col-span-1">
            <Card className="h-[calc(100vh-240px)]">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Conversations</CardTitle>
                  <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-hidden">
                <div className="overflow-y-auto h-[calc(100vh-340px)]">
                  {filteredConversations.length > 0 ? (
                    <ul className="divide-y">
                      {filteredConversations.map(convo => (
                        <li key={convo.userId}>
                          <button
                            className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                              selectedConversation === convo.userId ? 'bg-gray-50' : ''
                            }`}
                            onClick={() => setSelectedConversation(convo.userId)}
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={convo.userAvatar || ''} alt={convo.userName} />
                                <AvatarFallback>{getUserInitials(convo.userName)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                  <p className="text-sm font-medium truncate">{convo.userName}</p>
                                  <p className="text-xs text-gray-500">
                                    {formatDistanceToNow(new Date(convo.lastMessageTime), { addSuffix: true })}
                                  </p>
                                </div>
                                <div className="flex justify-between items-center">
                                  <p className="text-xs text-gray-500 truncate max-w-[180px]">
                                    {convo.lastMessage}
                                  </p>
                                  {convo.unreadCount > 0 && (
                                    <span className="inline-flex items-center justify-center h-5 w-5 text-xs font-medium text-white bg-meow-primary rounded-full">
                                      {convo.unreadCount}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-6">
                      <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-center mb-4">
                        {searchQuery
                          ? 'No conversations found with that name'
                          : 'No conversations yet'}
                      </p>
                      {!searchQuery && (
                        <Button onClick={() => setNewMessageOpen(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Start a Conversation
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Message Thread */}
          <div className="md:col-span-2">
            <Card className="h-[calc(100vh-240px)] flex flex-col">
              {selectedConversation ? (
                <>
                  <CardHeader className="py-3 px-4 border-b">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage 
                          src={selectedConversationInfo?.userAvatar || ''} 
                          alt={selectedConversationInfo?.userName || 'User'} 
                        />
                        <AvatarFallback>
                          {getUserInitials(selectedConversationInfo?.userName || 'User')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedConversationInfo?.userName}</p>
                        <p className="text-xs text-gray-500 capitalize">{selectedConversationInfo?.userRole}</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                      {conversationMessages.map(message => {
                        const isOutgoing = message.sender_id === user?.id;
                        
                        return (
                          <div 
                            key={message.id} 
                            className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className="flex items-end gap-2 max-w-[80%]">
                              {!isOutgoing && (
                                <Avatar className="h-8 w-8">
                                  <AvatarImage 
                                    src={message.sender.avatar_url || ''} 
                                    alt={`${message.sender.first_name} ${message.sender.last_name}`} 
                                  />
                                  <AvatarFallback>
                                    {getUserInitials(`${message.sender.first_name} ${message.sender.last_name}`)}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              
                              <div>
                                <div 
                                  className={`p-3 rounded-lg ${
                                    isOutgoing 
                                      ? 'bg-meow-primary text-white rounded-br-none' 
                                      : 'bg-gray-100 rounded-bl-none'
                                  }`}
                                >
                                  <p className="text-sm">{message.content}</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                                  {isOutgoing && message.read_at && (
                                    <span className="ml-1 inline-flex items-center">
                                      <CheckCheck className="h-3 w-3 text-meow-primary" />
                                    </span>
                                  )}
                                </p>
                              </div>
                              
                              {isOutgoing && (
                                <Avatar className="h-8 w-8">
                                  <AvatarImage 
                                    src={user?.avatar_url || ''} 
                                    alt={`${user?.first_name} ${user?.last_name}`} 
                                  />
                                  <AvatarFallback>
                                    {getUserInitials(`${user?.first_name} ${user?.last_name}`)}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      
                      {conversationMessages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full">
                          <ArrowRightLeft className="h-12 w-12 text-gray-300 mb-4" />
                          <p className="text-gray-500">No messages yet. Start the conversation!</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  <div className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        type="submit" 
                        disabled={!messageContent.trim() || sendMessageMutation.isPending}
                      >
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Your Messages</h3>
                  <p className="text-gray-500 mb-6">Select a conversation or start a new one</p>
                  <Button onClick={() => setNewMessageOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Message
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
      
      {/* New Message Dialog */}
      <Dialog open={newMessageOpen} onOpenChange={setNewMessageOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              New Message
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleNewMessage}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="recipient">To:</Label>
                <Select
                  value={newMessageRecipient}
                  onValueChange={setNewMessageRecipient}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles?.map(profile => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.first_name} {profile.last_name} ({profile.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="message">Message:</Label>
                <Textarea
                  id="message"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Type your message here"
                  rows={4}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setNewMessageOpen(false);
                  setMessageContent('');
                  setNewMessageRecipient('');
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={!newMessageRecipient || !messageContent.trim() || sendMessageMutation.isPending}
              >
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminDirectMessages;
