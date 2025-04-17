import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Mail, X, Check, Send, ArrowLeft, Trash2 } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  received_at: string;
  responded_at: string | null;
  response: string | null;
  status: string;
}

const AdminMessages: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [responseText, setResponseText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('new');
  
  // Fetch contact messages
  const { data: messages, isLoading, isError } = useQuery({
    queryKey: ['contact-messages'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('contact_messages')
          .select('*')
          .order('received_at', { ascending: false });
          
        if (error) throw error;
        return data as ContactMessage[];
      } catch (error: any) {
        console.error('Error fetching contact messages:', error);
        return [] as ContactMessage[];
      }
    }
  });
  
  // Filter messages based on search query and active tab
  const filteredMessages = messages?.filter(message => 
    (message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
     (message.subject && message.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
     message.message.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (activeTab === 'all' || message.status.toLowerCase() === activeTab.toLowerCase())
  );
  
  // Mutation to update message status
  const updateMessageStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      try {
        const { data, error } = await supabase
          .from('contact_messages')
          .update({ status })
          .eq('id', id)
          .select();
          
        if (error) throw error;
        return data[0] as ContactMessage;
      } catch (error: any) {
        console.error('Error updating message status:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      toast({
        title: "Status Updated",
        description: "Message status has been updated successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update message status",
        variant: "destructive"
      });
    }
  });
  
  // Mutation to delete a message
  const deleteMessage = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase
          .from('contact_messages')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        return id;
      } catch (error: any) {
        console.error('Error deleting message:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      setSelectedMessage(null);
      toast({
        title: "Message Deleted",
        description: "Message has been deleted successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete message",
        variant: "destructive"
      });
    }
  });
  
  // Mutation to send response
  const sendResponse = useMutation({
    mutationFn: async ({ id, response }: { id: string; response: string }) => {
      try {
        // For now, just update the message in the database
        // In a real application, you would also send an email
        const { data, error } = await supabase
          .from('contact_messages')
          .update({
            response,
            responded_at: new Date().toISOString(),
            status: 'replied'
          })
          .eq('id', id)
          .select();
          
        if (error) throw error;
        return data[0] as ContactMessage;
      } catch (error: any) {
        console.error('Error sending response:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      setIsReplying(false);
      setResponseText('');
      toast({
        title: "Response Sent",
        description: "Your response has been recorded successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send response",
        variant: "destructive"
      });
    }
  });
  
  // Handle opening a message
  const handleOpenMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    
    // If message is new, mark it as read
    if (message.status === 'new') {
      updateMessageStatus.mutate({ id: message.id, status: 'read' });
    }
  };
  
  // Handle message status change
  const handleStatusChange = (id: string, status: string) => {
    updateMessageStatus.mutate({ id, status });
  };
  
  // Handle delete confirmation
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this message? This action cannot be undone.")) {
      deleteMessage.mutate(id);
    }
  };
  
  // Handle reply form submission
  const handleSendResponse = () => {
    if (!selectedMessage) return;
    
    if (!responseText.trim()) {
      toast({
        title: "Empty Response",
        description: "Please write a response before sending.",
        variant: "destructive"
      });
      return;
    }
    
    sendResponse.mutate({ id: selectedMessage.id, response: responseText });
  };
  
  // Calculate counts
  const newCount = messages?.filter(m => m.status === 'new').length || 0;
  const readCount = messages?.filter(m => m.status === 'read').length || 0;
  const repliedCount = messages?.filter(m => m.status === 'replied').length || 0;
  const archivedCount = messages?.filter(m => m.status === 'archived').length || 0;

  return (
    <AdminLayout title="Messages">
      <SEO title="Contact Messages | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-meow-primary">Contact Messages</h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full md:w-64"
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card 
            className={`cursor-pointer ${activeTab === 'new' ? 'bg-slate-100' : ''}`} 
            onClick={() => setActiveTab('new')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">New</p>
                  <h3 className="text-2xl font-bold">{newCount}</h3>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer ${activeTab === 'read' ? 'bg-slate-100' : ''}`} 
            onClick={() => setActiveTab('read')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Read</p>
                  <h3 className="text-2xl font-bold">{readCount}</h3>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer ${activeTab === 'replied' ? 'bg-slate-100' : ''}`} 
            onClick={() => setActiveTab('replied')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Replied</p>
                  <h3 className="text-2xl font-bold">{repliedCount}</h3>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Send className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer ${activeTab === 'archived' ? 'bg-slate-100' : ''}`} 
            onClick={() => setActiveTab('archived')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Archived</p>
                  <h3 className="text-2xl font-bold">{archivedCount}</h3>
                </div>
                <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <X className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer ${activeTab === 'all' ? 'bg-slate-100' : ''}`} 
            onClick={() => setActiveTab('all')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">All Messages</p>
                  <h3 className="text-2xl font-bold">{messages?.length || 0}</h3>
                </div>
                <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab === 'all' ? 'All Messages' : 
               activeTab === 'new' ? 'New Messages' : 
               activeTab === 'read' ? 'Read Messages' : 
               activeTab === 'replied' ? 'Replied Messages' : 
               'Archived Messages'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
              </div>
            ) : isError ? (
              <div className="text-center py-12">
                <p className="text-red-500">Error loading messages. Please try again later.</p>
              </div>
            ) : filteredMessages && filteredMessages.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Received</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.map((message) => (
                    <TableRow 
                      key={message.id} 
                      className="cursor-pointer hover:bg-slate-50"
                      onClick={() => handleOpenMessage(message)}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{message.name}</div>
                          <div className="text-sm text-gray-500">{message.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {message.subject || 'No subject'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          message.status === 'new' ? 'default' :
                          message.status === 'read' ? 'secondary' :
                          message.status === 'replied' ? 'default' :
                          'outline'
                        }>
                          {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(message.received_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenMessage(message);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-700">
                  {searchQuery 
                    ? 'No messages match your search.' 
                    : `No ${activeTab !== 'all' ? activeTab : ''} messages to display.`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Message View Dialog */}
      {selectedMessage && (
        <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isReplying ? 'Reply to Message' : selectedMessage.subject || 'Contact Message'}
              </DialogTitle>
              <DialogDescription>
                {isReplying 
                  ? `Replying to ${selectedMessage.name} (${selectedMessage.email})` 
                  : `Received on ${new Date(selectedMessage.received_at).toLocaleString()}`}
              </DialogDescription>
            </DialogHeader>
            
            {isReplying ? (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-sm font-semibold">Original Message:</h4>
                  <p className="mt-2 text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Your Response:</label>
                  <Textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows={8}
                    placeholder="Write your response here..."
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsReplying(false)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button 
                    onClick={handleSendResponse}
                    disabled={sendResponse.isPending}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {sendResponse.isPending ? 'Sending...' : 'Send Response'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        <p>{selectedMessage.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p>{selectedMessage.email}</p>
                      </div>
                      {selectedMessage.phone && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Phone</p>
                          <p>{selectedMessage.phone}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Message Details</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Subject</p>
                        <p>{selectedMessage.subject || 'No subject'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <Badge variant={
                          selectedMessage.status === 'new' ? 'default' :
                          selectedMessage.status === 'read' ? 'secondary' :
                          selectedMessage.status === 'replied' ? 'default' :
                          'outline'
                        }>
                          {selectedMessage.status.charAt(0).toUpperCase() + selectedMessage.status.slice(1)}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Received</p>
                        <p>{new Date(selectedMessage.received_at).toLocaleString()}</p>
                      </div>
                      {selectedMessage.responded_at && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Responded</p>
                          <p>{new Date(selectedMessage.responded_at).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Message</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>
                
                {selectedMessage.response && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Response</h3>
                    <div className="bg-blue-50 p-4 rounded-md">
                      <p className="whitespace-pre-wrap">{selectedMessage.response}</p>
                    </div>
                  </div>
                )}
                
                <DialogFooter className="flex-col sm:flex-row sm:justify-between">
                  <div className="flex gap-2 mb-4 sm:mb-0">
                    <Button 
                      variant="destructive" 
                      onClick={() => handleDelete(selectedMessage.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                    
                    {selectedMessage.status !== 'archived' && (
                      <Button 
                        variant="outline" 
                        onClick={() => handleStatusChange(selectedMessage.id, 'archived')}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Archive
                      </Button>
                    )}
                    
                    {selectedMessage.status === 'archived' && (
                      <Button 
                        variant="outline" 
                        onClick={() => handleStatusChange(selectedMessage.id, 'read')}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Unarchive
                      </Button>
                    )}
                  </div>
                  
                  <div>
                    {!selectedMessage.response && (
                      <Button onClick={() => setIsReplying(true)}>
                        <Send className="mr-2 h-4 w-4" />
                        Reply
                      </Button>
                    )}
                  </div>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
};

export default AdminMessages;
