import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, CheckCircle, Send, Archive, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Define the type for messages
interface Message {
  id: string;
  created_at: string;
  sender_id: string;
  sender_name: string;
  sender_email: string;
  message_subject: string;
  message_body: string;
  message_status: MessageStatus;
}

// Update the status type to include 'Archived'
type MessageStatus = 'New' | 'Read' | 'Replied' | 'Archived';

const AdminMessages: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const queryClient = useQueryClient();

  // Fetch messages from Supabase
  const { data: messages, isLoading, error, refetch } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Message[];
    },
  });

  useEffect(() => {
    refetch(); // Refresh messages on component mount
  }, [refetch]);

  // Mutation to update message status
  const updateMessageStatus = useMutation(
    async ({ messageId, newStatus }: { messageId: string; newStatus: MessageStatus }) => {
      const { error } = await supabase
        .from('messages')
        .update({ message_status: newStatus })
        .eq('id', messageId);

      if (error) throw error;
    },
    {
      onSuccess: () => {
        // Invalidate the query to refetch messages
        queryClient.invalidateQueries(['messages']);
        toast({
          title: "Status Updated",
          description: "Message status updated successfully.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Update Failed",
          description: `Failed to update message status: ${error.message}`,
          variant: "destructive",
        });
      },
    }
  );

  // Filter messages based on search query
  const filteredMessages = messages?.filter((message) =>
    message.sender_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.sender_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.message_subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.message_body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle opening the reply dialog
  const handleReplyClick = (message: Message) => {
    setSelectedMessage(message);
    setReplyDialogOpen(true);
  };

  // Handle sending a reply (mock implementation)
  const handleSendReply = async () => {
    if (!selectedMessage) return;

    // Here you would typically send the reply and update the message status
    // For this example, we'll just update the status to "Replied"
    try {
      await updateMessageStatus.mutateAsync({ messageId: selectedMessage.id, newStatus: 'Replied' });
      setReplyDialogOpen(false);
      setSelectedMessage(null);
      setReplyText('');
      toast({
        title: "Reply Sent",
        description: "Reply sent and message status updated.",
      });
    } catch (error: any) {
      toast({
        title: "Reply Failed",
        description: `Failed to send reply: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Function to handle status change
  const handleStatusChange = async (messageId: string, newStatus: MessageStatus) => {
    try {
      await updateMessageStatus.mutateAsync({ messageId: messageId, newStatus: newStatus });
    } catch (error: any) {
      toast({
        title: "Status Update Failed",
        description: `Failed to update status: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout title="Messages">
      <SEO title="Messages | Meow Rescue Admin" />

      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-meow-primary">Messages</h1>
        </div>

        <div className="flex items-center mb-6">
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading messages. Please try again later.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>A list of all messages received.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages?.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>{new Date(message.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{message.sender_name}</TableCell>
                    <TableCell>{message.sender_email}</TableCell>
                    <TableCell>{message.message_subject}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          message.message_status === 'New'
                            ? 'bg-blue-100 text-blue-800'
                            : message.message_status === 'Read'
                              ? 'bg-gray-100 text-gray-800'
                              : message.message_status === 'Replied'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800' // Archived
                        }
                      >
                        {message.message_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Message Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleReplyClick(message)}>
                            <Send className="mr-2 h-4 w-4" />
                            <span>Reply</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(message.id, 'Read')}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            <span>Mark as Read</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(message.id, 'Archived')}>
                            <Archive className="mr-2 h-4 w-4" />
                            <span>Archive</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => refetch()}>
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            <span>Refresh</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredMessages?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No messages found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Reply Dialog */}
        <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Reply to Message</DialogTitle>
              <DialogDescription>
                Write your reply to the message.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {selectedMessage && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" value={`RE: ${selectedMessage.message_subject}`} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Enter your reply here"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendReply}>Send Reply</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;
