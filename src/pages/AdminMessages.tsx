
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Search, Trash2, Reply, CheckCircle2, User, Clock, FileText } from 'lucide-react';
import SEO from '@/components/SEO';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
  updated_at: string;
}

const AdminMessages: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  // Fetch contact messages
  const { data: messages, isLoading } = useQuery({
    queryKey: ['contactMessages', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('contact_messages')
        .select('*');
        
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as ContactMessage[];
    },
  });
  
  // Update message status mutation
  const updateMessageStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
        
      if (error) throw error;
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
      toast({
        title: 'Success',
        description: 'Message status updated',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update message status',
        variant: 'destructive',
      });
    },
  });
  
  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      setDeleteAlertOpen(false);
      setSelectedMessage(null);
      queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
      toast({
        title: 'Success',
        description: 'Message deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete message',
        variant: 'destructive',
      });
    },
  });
  
  // Send reply mutation
  const sendReplyMutation = useMutation({
    mutationFn: async ({ messageId, replyContent }: { messageId: string; replyContent: string }) => {
      // In a real app, you would send an email here
      console.log(`Sending reply to message ${messageId}: ${replyContent}`);
      
      // Update message status to replied
      const { error } = await supabase
        .from('contact_messages')
        .update({ 
          status: 'replied', 
          updated_at: new Date().toISOString(),
          reply_text: replyContent,
          replied_at: new Date().toISOString()
        })
        .eq('id', messageId);
        
      if (error) throw error;
      
      return { messageId, replyContent };
    },
    onSuccess: () => {
      setReplyModalOpen(false);
      setReplyText('');
      queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
      toast({
        title: 'Success',
        description: 'Reply sent successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send reply',
        variant: 'destructive',
      });
    },
  });
  
  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setViewModalOpen(true);
    
    // If message is new, mark as read
    if (message.status === 'new') {
      updateMessageStatusMutation.mutate({ id: message.id, status: 'read' });
    }
  };
  
  const handleReplyClick = (message: ContactMessage) => {
    setSelectedMessage(message);
    setReplyModalOpen(true);
    setReplyText(`Dear ${message.name},\n\nThank you for contacting Meow Rescue.\n\n\n\nBest regards,\nMeow Rescue Team`);
  };
  
  const handleSendReply = () => {
    if (!selectedMessage || !replyText.trim()) return;
    
    sendReplyMutation.mutate({
      messageId: selectedMessage.id,
      replyContent: replyText
    });
  };
  
  const handleDeleteClick = (message: ContactMessage) => {
    setSelectedMessage(message);
    setDeleteAlertOpen(true);
  };
  
  const confirmDelete = () => {
    if (!selectedMessage) return;
    deleteMessageMutation.mutate(selectedMessage.id);
  };
  
  // Filter messages based on search term
  const filteredMessages = messages?.filter(message => 
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'new':
        return <Badge variant="destructive">New</Badge>;
      case 'read':
        return <Badge variant="secondary">Read</Badge>;
      case 'replied':
        return <Badge variant="default">Replied</Badge>;
      case 'archived':
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <AdminLayout title="Contact Messages">
      <SEO title="Contact Messages | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-meow-primary">Contact Messages</h1>
          
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full md:w-64"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 w-full md:w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="">All Messages</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
          </div>
        ) : messages && messages.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableCaption>Contact form messages from website visitors.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Sender</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages?.map((message) => (
                  <TableRow 
                    key={message.id} 
                    className={message.status === 'new' ? 'bg-blue-50' : undefined}
                  >
                    <TableCell className="font-medium">
                      {message.name}
                      <div className="text-xs text-gray-500">{message.email}</div>
                    </TableCell>
                    <TableCell>{message.subject}</TableCell>
                    <TableCell>{formatDate(message.created_at)}</TableCell>
                    <TableCell>{getStatusBadge(message.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewMessage(message)}
                        >
                          View
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleReplyClick(message)}
                        >
                          <Reply className="h-4 w-4 mr-2" />
                          Reply
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteClick(message)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Messages Yet</h2>
            <p className="text-gray-500">
              When visitors send messages through the contact form, they will appear here.
            </p>
          </div>
        )}
      </div>
      
      {/* View Message Dialog */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject}</DialogTitle>
            <DialogDescription>
              From: {selectedMessage?.name} ({selectedMessage?.email})
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6">
            <div className="flex items-center text-sm text-gray-500 justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{selectedMessage?.name} &lt;{selectedMessage?.email}&gt;</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{selectedMessage?.created_at ? formatDate(selectedMessage.created_at) : ''}</span>
              </div>
            </div>
            
            {selectedMessage?.phone && (
              <div className="text-sm text-gray-500">
                <span className="font-medium">Phone:</span> {selectedMessage.phone}
              </div>
            )}
            
            <div className="border rounded-md p-4 min-h-[150px] whitespace-pre-line">
              {selectedMessage?.message}
            </div>
            
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setViewModalOpen(false);
                  setReplyModalOpen(true);
                  if (selectedMessage) {
                    setReplyText(`Dear ${selectedMessage.name},\n\nThank you for contacting Meow Rescue.\n\n\n\nBest regards,\nMeow Rescue Team`);
                  }
                }}
              >
                <Reply className="h-4 w-4 mr-2" />
                Reply
              </Button>
              
              {selectedMessage?.status !== 'archived' && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (selectedMessage) {
                      updateMessageStatusMutation.mutate({ id: selectedMessage.id, status: 'archived' });
                      setViewModalOpen(false);
                    }
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Archive
                </Button>
              )}
              
              <Button
                variant="destructive"
                onClick={() => {
                  setViewModalOpen(false);
                  setDeleteAlertOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Reply Dialog */}
      <Dialog open={replyModalOpen} onOpenChange={setReplyModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Reply to {selectedMessage?.name}</DialogTitle>
            <DialogDescription>
              Re: {selectedMessage?.subject}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium text-right">To:</div>
              <div className="col-span-2">{selectedMessage?.name} &lt;{selectedMessage?.email}&gt;</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium text-right">Subject:</div>
              <div className="col-span-2">Re: {selectedMessage?.subject}</div>
            </div>
            
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={10}
              placeholder="Your reply message..."
            />
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSendReply} disabled={sendReplyMutation.isPending}>
              {sendReplyMutation.isPending ? 'Sending...' : 'Send Reply'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminMessages;
