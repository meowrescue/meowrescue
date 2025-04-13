
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import { Mail, User, Calendar, ArrowUpDown, Edit, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'New' | 'InProgress' | 'Responded' | 'Closed';
  received_at: string;
  response?: string;
  responded_at?: string;
}

const statusColors = {
  New: 'bg-blue-100 text-blue-800',
  InProgress: 'bg-yellow-100 text-yellow-800',
  Responded: 'bg-green-100 text-green-800',
  Closed: 'bg-gray-100 text-gray-800',
};

const statusIcons = {
  New: <AlertCircle className="h-4 w-4 mr-1" />,
  InProgress: <Edit className="h-4 w-4 mr-1" />,
  Responded: <CheckCircle className="h-4 w-4 mr-1" />,
  Closed: <XCircle className="h-4 w-4 mr-1" />,
};

const AdminMessages: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [responseText, setResponseText] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Fetch messages
  const { data: messages, isLoading, error } = useQuery({
    queryKey: ['contact-messages', sortOrder, filterStatus],
    queryFn: async () => {
      try {
        console.log("Fetching contact messages");
        let query = supabase
          .from('contact_messages')
          .select('*')
          .order('received_at', { ascending: sortOrder === 'asc' });
          
        if (filterStatus !== 'all') {
          query = query.eq('status', filterStatus);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error("Error fetching contact messages:", error);
          throw error;
        }
        
        console.log("Fetched contact messages:", data?.length);
        return data as ContactMessage[];
      } catch (err) {
        console.error("Error in contact messages query:", err);
        return [] as ContactMessage[];
      }
    },
  });

  // Update message status
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      try {
        console.log(`Updating message ${id} status to ${status}`);
        const { error } = await supabase
          .from('contact_messages')
          .update({ status })
          .eq('id', id);
          
        if (error) {
          console.error("Error updating message status:", error);
          throw error;
        }
      } catch (err) {
        console.error("Error in updateStatus mutation:", err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      toast({
        title: 'Status Updated',
        description: 'The message status has been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to update message status: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Submit response
  const submitResponse = useMutation({
    mutationFn: async ({ id, response }: { id: string; response: string }) => {
      try {
        console.log(`Submitting response for message ${id}`);
        const { error } = await supabase
          .from('contact_messages')
          .update({
            response,
            status: 'Responded',
            responded_at: new Date().toISOString(),
          })
          .eq('id', id);
          
        if (error) {
          console.error("Error submitting response:", error);
          throw error;
        }
      } catch (err) {
        console.error("Error in submitResponse mutation:", err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      setSelectedMessage(null);
      setResponseText('');
      toast({
        title: 'Response Sent',
        description: 'Your response has been recorded successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to send response: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleStatusChange = (id: string, status: string) => {
    updateStatus.mutate({ id, status });
  };

  const handleSortToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <AdminLayout title="Contact Messages">
      <SEO title="Contact Messages | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-meow-primary">Contact Messages</h1>
          
          <div className="flex items-center space-x-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="InProgress">In Progress</SelectItem>
                <SelectItem value="Responded">Responded</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={handleSortToggle}>
              <Calendar className="h-4 w-4 mr-2" />
              Date {sortOrder === 'asc' ? 'Oldest' : 'Newest'}
              <ArrowUpDown className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading messages. Please try again later.</p>
          </div>
        ) : messages && messages.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {messages.map((message) => (
              <Card key={message.id} className="overflow-hidden shadow-md">
                <CardHeader className="bg-gray-50 pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        <User className="h-5 w-5 mr-2 text-gray-500" />
                        {message.name}
                      </CardTitle>
                      <CardDescription>
                        <a href={`mailto:${message.email}`} className="flex items-center hover:text-meow-primary">
                          <Mail className="h-4 w-4 mr-1" />
                          {message.email}
                        </a>
                      </CardDescription>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-3 py-1 rounded-full text-xs flex items-center ${statusColors[message.status]}`}>
                        {statusIcons[message.status]}
                        {message.status}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Received:</p>
                    <p className="text-sm flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      {formatDate(message.received_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Message:</p>
                    <p className="text-gray-900 whitespace-pre-wrap">{message.message}</p>
                  </div>
                  
                  {message.response && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-500 mb-1">Your Response:</p>
                      <p className="text-gray-900 whitespace-pre-wrap">{message.response}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Responded on: {message.responded_at ? formatDate(message.responded_at) : 'N/A'}
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="bg-gray-50 border-t flex justify-between">
                  <Select 
                    defaultValue={message.status}
                    onValueChange={(value) => handleStatusChange(message.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="InProgress">In Progress</SelectItem>
                      <SelectItem value="Responded">Responded</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    onClick={() => {
                      setSelectedMessage(message);
                      setResponseText(message.response || '');
                    }}
                    variant={message.response ? "outline" : "default"}
                  >
                    {message.response ? "Edit Response" : "Respond"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Mail className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-xl text-gray-600">No messages found</p>
            <p className="text-gray-500 mt-2">Contact messages will appear here when visitors submit the contact form.</p>
          </div>
        )}
      </div>
      
      {/* Response Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Respond to {selectedMessage?.name}</DialogTitle>
            <DialogDescription>
              Compose a response that will be associated with this contact message.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="border rounded-md p-3 bg-gray-50">
              <p className="text-sm font-medium mb-1">Original Message:</p>
              <p className="text-sm">{selectedMessage?.message}</p>
            </div>
            
            <div>
              <label htmlFor="response" className="text-sm font-medium block mb-1">
                Your Response:
              </label>
              <Textarea
                id="response"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={6}
                placeholder="Type your response here..."
                className="w-full"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setSelectedMessage(null)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={() => selectedMessage && submitResponse.mutate({ id: selectedMessage.id, response: responseText })}
              disabled={!responseText.trim()}
            >
              {selectedMessage?.response ? "Update Response" : "Send Response"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminMessages;
