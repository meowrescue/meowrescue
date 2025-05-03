import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import getSupabaseClient from '@/integrations/getSupabaseClient()/client';
import AdminLayout from '@/pages/Admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageSquare, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle, 
  Clock,
  XCircle,
  Send,
  Search
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import SEO from '@/components/SEO';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  received_at: string;
  status: string;
  response: string | null;
  responded_at: string | null;
}

const AdminMessages = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState<string>('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');

  // Fetch contact messages
  const { data: messages, isLoading } = useQuery({
    queryKey: ['contact-messages'],
    queryFn: async () => {
      const { data, error } = await getSupabaseClient()
        .from('contact_messages')
        .select('*')
        .order('received_at', { ascending: false });
      
      if (error) throw error;
      return data as ContactMessage[];
    }
  });

  // Send reply mutation
  const sendReplyMutation = useMutation({
    mutationFn: async ({ messageId, reply }: { messageId: string; reply: string }) => {
      const { data: authData } = await getSupabaseClient().auth.getSession();
      if (!authData.session) throw new Error('Not authenticated');
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL || ''}/functions/v1/send-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authData.session.access_token}`
          },
          body: JSON.stringify({ messageId, reply })
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send email');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Reply Sent",
        description: "Your reply has been sent successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      setReplyDialogOpen(false);
      setReplyText('');
      setSelectedMessage(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send reply",
        variant: "destructive"
      });
    }
  });

  // Filter messages based on selected tab and search query
  const filteredMessages = messages?.filter(message => {
    // Filter by tab
    if (selectedTab === 'new' && message.status !== 'New') return false;
    if (selectedTab === 'replied' && message.status !== 'Replied') return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        message.name.toLowerCase().includes(query) ||
        message.email.toLowerCase().includes(query) ||
        (message.subject && message.subject.toLowerCase().includes(query)) ||
        message.message.toLowerCase().includes(query) ||
        (message.response && message.response.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  const handleOpenReply = (message: ContactMessage) => {
    setSelectedMessage(message);
    setReplyText(message.response || '');
    setReplyDialogOpen(true);
  };

  const handleSendReply = () => {
    if (!selectedMessage || !replyText.trim()) return;
    
    sendReplyMutation.mutate({
      messageId: selectedMessage.id,
      reply: replyText.trim()
    });
  };

  // Get counts for tabs
  const newCount = messages?.filter(m => m.status === 'New').length || 0;
  const repliedCount = messages?.filter(m => m.status === 'Replied').length || 0;
  const totalCount = messages?.length || 0;

  return (
    <AdminLayout title="Contact Messages">
      <SEO title="Contact Form | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-meow-primary">Contact Form Messages</h1>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>
        
        <Tabs defaultValue="new" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">
              All
              <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-0.5 text-xs rounded-full">
                {totalCount}
              </span>
            </TabsTrigger>
            <TabsTrigger value="new">
              New
              <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 text-xs rounded-full">
                {newCount}
              </span>
            </TabsTrigger>
            <TabsTrigger value="replied">
              Replied
              <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 text-xs rounded-full">
                {repliedCount}
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedTab}>
            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-meow-primary"></div>
              </div>
            ) : filteredMessages && filteredMessages.length > 0 ? (
              <div className="space-y-6">
                {filteredMessages.map((message) => (
                  <Card key={message.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-grow">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold mb-1">
                                {message.subject || 'No Subject'}
                              </h3>
                              <div className="flex flex-wrap gap-x-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <User className="h-4 w-4 mr-1" />
                                  {message.name}
                                </div>
                                <div className="flex items-center">
                                  <Mail className="h-4 w-4 mr-1" />
                                  {message.email}
                                </div>
                                {message.phone && (
                                  <div className="flex items-center">
                                    <Phone className="h-4 w-4 mr-1" />
                                    {message.phone}
                                  </div>
                                )}
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {formatDistanceToNow(new Date(message.received_at), { addSuffix: true })}
                                </div>
                              </div>
                            </div>
                            <div>
                              {message.status === 'New' ? (
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  New
                                </span>
                              ) : (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Replied
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <p className="whitespace-pre-wrap">{message.message}</p>
                          </div>
                          
                          {message.response && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-500 mb-2">Your Response:</h4>
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="whitespace-pre-wrap">{message.response}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                  Sent {message.responded_at ? formatDistanceToNow(new Date(message.responded_at), { addSuffix: true }) : ''}
                                </p>
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-4">
                            <Button onClick={() => handleOpenReply(message)}>
                              <Send className="h-4 w-4 mr-2" />
                              {message.response ? 'Send Another Reply' : 'Reply'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-10 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No messages found in this category.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Reply Dialog */}
      {selectedMessage && (
        <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Reply to {selectedMessage.name}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="bg-gray-50 p-4 rounded-lg mb-2 text-sm">
                <p><strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})</p>
                <p><strong>Subject:</strong> {selectedMessage.subject || 'No Subject'}</p>
                <p className="mt-2"><strong>Message:</strong></p>
                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
              
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply here..."
                rows={8}
              />
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSendReply}
                disabled={!replyText.trim() || sendReplyMutation.isPending}
              >
                {sendReplyMutation.isPending ? 'Sending...' : 'Send Reply'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
};

export default AdminMessages;
