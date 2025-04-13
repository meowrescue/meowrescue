
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Mail, Check, X, Eye, EyeOff } from 'lucide-react';
import SEO from '@/components/SEO';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  received_at: string;
  responded_at: string | null;
  response: string | null;
  status: 'New' | 'Read' | 'Replied' | 'Archived'; // Update the type to include 'Archived'
}

const AdminMessages: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [response, setResponse] = useState('');

  // Fetch contact messages
  const { data: messages, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-contact-messages'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('contact_messages')
          .select('*')
          .order('received_at', { ascending: false });
          
        if (error) throw error;
        return data as ContactMessage[];
      } catch (err: any) {
        console.error("Error fetching contact messages:", err);
        toast({
          title: "Error fetching messages",
          description: err.message || "Failed to load contact messages",
          variant: "destructive"
        });
        return [] as ContactMessage[];
      }
    }
  });

  // Filter messages based on search query
  const filteredMessages = messages?.filter(message =>
    message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendResponse = async () => {
    if (!selectedMessage) return;
    
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({
          response: response,
          responded_at: new Date().toISOString(),
          status: 'Replied'
        })
        .eq('id', selectedMessage.id);
        
      if (error) throw error;
      
      toast({
        title: "Response Sent",
        description: "Your response has been saved and will be sent to the user."
      });
      
      setSelectedMessage(null);
      setResponse('');
      refetch();

      // In a real application, you would also send an email here
      // using an edge function that calls an email service

    } catch (err: any) {
      toast({
        title: "Error Sending Response",
        description: err.message || "Failed to send response",
        variant: "destructive"
      });
    }
  };

  const handleViewMessage = (message: ContactMessage) => {
    // If the message is new, mark it as read when viewing
    if (message.status === 'New') {
      updateMessageStatus(message.id, 'Read');
    }
    
    setSelectedMessage(message);
    setResponse(message.response || '');
  };

  const updateMessageStatus = async (messageId: string, status: ContactMessage['status']) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', messageId);
        
      if (error) throw error;
      
      toast({
        title: "Status Updated",
        description: `Message marked as ${status.toLowerCase()}.`
      });
      
      refetch();
    } catch (err: any) {
      toast({
        title: "Error Updating Status",
        description: err.message || "Failed to update message status",
        variant: "destructive"
      });
    }
  };

  // Get badge variant based on message status
  const getStatusBadgeVariant = (status: ContactMessage['status']): "default" | "outline" | "secondary" | "destructive" => {
    switch(status) {
      case 'New': return 'destructive';
      case 'Read': return 'secondary';
      case 'Replied': return 'default';
      case 'Archived': return 'outline';
      default: return 'default';
    }
  };

  return (
    <AdminLayout title="Contact Messages">
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
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading contact messages. Please try again later.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => refetch()}
            >
              Try Again
            </Button>
          </div>
        ) : filteredMessages && filteredMessages.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableCaption>All contact form submissions.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date Received</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.map((message) => (
                  <TableRow key={message.id} className={message.status === 'New' ? 'bg-gray-50' : ''}>
                    <TableCell className="font-medium">{message.name}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell>{new Date(message.received_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(message.status)}>
                        {message.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewMessage(message)}
                          className="flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View/Reply
                        </Button>
                        {message.status !== 'New' ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateMessageStatus(message.id, 'New')}
                            className="flex items-center"
                          >
                            <EyeOff className="h-4 w-4 mr-1" />
                            Mark Unread
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Contact Messages</h2>
              <p className="text-gray-500 mb-8">
                There are no contact form submissions in the database yet.
              </p>
            </div>
          </div>
        )}
      </div>

      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Message from {selectedMessage?.name}</DialogTitle>
            <DialogDescription>
              Received on {selectedMessage && new Date(selectedMessage.received_at).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Message</CardTitle>
                <CardDescription>From: {selectedMessage?.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{selectedMessage?.message}</p>
              </CardContent>
            </Card>
            
            <div className="space-y-2">
              <label htmlFor="response" className="text-sm font-medium">Your Response</label>
              <Textarea
                id="response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Type your response here..."
                rows={6}
              />
            </div>
          </div>
          
          <DialogFooter>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {selectedMessage?.status !== 'New' ? (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    updateMessageStatus(selectedMessage?.id || '', 'New');
                    setSelectedMessage(null);
                  }}
                  className="flex items-center"
                >
                  <EyeOff className="h-4 w-4 mr-2" />
                  Mark Unread
                </Button>
              ) : null}
              <Button variant="outline" onClick={() => setSelectedMessage(null)}>Cancel</Button>
              <Button onClick={handleSendResponse} disabled={!response.trim()}>
                <Mail className="mr-2 h-4 w-4" />
                Send Response
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminMessages;
