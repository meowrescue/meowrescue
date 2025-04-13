import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Search, Mail, CheckCircle, ArrowRightCircle, ArchiveIcon } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/SEO';
import { MessageStatus } from '@/types/users';

const AdminMessages: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [openMessageId, setOpenMessageId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [messageStatus, setMessageStatus] = useState<MessageStatus>("New");

  // Fetch messages from Supabase
  const { data: messages, isLoading, error, refetch } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Mutation to update message status
  const updateMessageStatus = useMutation(
    async ({ id, status }: { id: string; status: MessageStatus }) => {
      const { data, error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id)
        .select();

      if (error) throw new Error(`Failed to update message status: ${error.message}`);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['messages'] });
        toast({
          title: "Message Updated",
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

  // Mutation to send a reply
  const sendReply = useMutation(
    async ({ id, reply }: { id: string; reply: string }) => {
      // Simulate sending a reply (replace with actual implementation)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { id, reply };
    },
    {
      onSuccess: () => {
        toast({
          title: "Reply Sent",
          description: "Reply sent successfully.",
        });
        setReplyText('');
        setOpenMessageId(null);
      },
      onError: () => {
        toast({
          title: "Reply Failed",
          description: "Failed to send reply.",
          variant: "destructive",
        });
      },
    }
  );

  // Filter messages based on search query
  const filteredMessages = messages?.filter(message =>
    message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = (id: string, status: MessageStatus) => {
    updateMessageStatus.mutate({ id, status });
  };

  const handleOpenMessage = (id: string) => {
    setOpenMessageId(id);
  };

  const handleCloseMessage = () => {
    setOpenMessageId(null);
    setReplyText('');
  };

  const handleSendReply = (id: string) => {
    sendReply.mutate({ id, reply: replyText });
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
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>A list of all contact messages received.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages?.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>{message.name}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell>{message.message.substring(0, 50)}{message.message.length > 50 ? '...' : ''}</TableCell>
                    <TableCell>
                      <Badge variant={
                        message.status === 'New' ? 'secondary' :
                        message.status === 'Read' ? 'default' :
                        message.status === 'Replied' ? 'outline' :
                        'destructive'
                      }>
                        {message.status}
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
                          <DropdownMenuItem onClick={() => handleOpenMessage(message.id)}>
                            View Message
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(message.id, "Read")}>
                            Mark as Read
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(message.id, "Replied")}>
                            Mark as Replied
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(message.id, "Archived")}>
                            Archive Message
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => refetch()}>
                            Refresh
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

        {/* View Message Dialog */}
        <Dialog open={openMessageId !== null} onOpenChange={() => handleCloseMessage()}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>View Message</DialogTitle>
              <DialogDescription>
                View the complete message and send a reply.
              </DialogDescription>
            </DialogHeader>
            {messages?.find(message => message.id === openMessageId) && (
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Message Details</h3>
                  <p><strong>Name:</strong> {messages?.find(message => message.id === openMessageId)?.name}</p>
                  <p><strong>Email:</strong> {messages?.find(message => message.id === openMessageId)?.email}</p>
                  <p><strong>Message:</strong></p>
                  <p className="whitespace-pre-line">{messages?.find(message => message.id === openMessageId)?.message}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reply">Reply</Label>
                  <Textarea
                    id="reply"
                    placeholder="Enter your reply"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => handleCloseMessage()}>
                Cancel
              </Button>
              <Button onClick={() => handleSendReply(openMessageId || '')}>Send Reply</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;
