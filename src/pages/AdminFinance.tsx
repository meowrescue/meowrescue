import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, CreditCard, Coins } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';

interface Donation {
  id: string;
  created_at: string;
  donation_date: string;
  donor_profile_id: string | null;
  amount: number;
  is_recurring: boolean;
  notes: string | null;
  payment_gateway_id: string | null;
  status: string;
  income_type: string | null;
}

const AdminFinance: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newDonationDate, setNewDonationDate] = useState<Date | undefined>(undefined);
  const [newDonationAmount, setNewDonationAmount] = useState('');
  const [newDonationRecurring, setNewDonationRecurring] = useState(false);
  const [newDonationNotes, setNewDonationNotes] = useState('');
  const [newDonationPaymentGateway, setNewDonationPaymentGateway] = useState('');
  const [newDonationStatus, setNewDonationStatus] = useState('');
  const [newDonationIncomeType, setNewDonationIncomeType] = useState('');

  // Fetch donations from Supabase
  const { data: donations, isLoading, error, refetch } = useQuery({
    queryKey: ['donations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('donation_date', { ascending: false });

      if (error) throw error;
      return data as Donation[];
    },
  });

  useEffect(() => {
    refetch(); // Refresh donations on component mount
  }, [refetch]);

  // Mutation to create a new donation
  const createDonation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('donations')
        .insert({
          donation_date: newDonationDate ? format(newDonationDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
          amount: parseFloat(newDonationAmount),
          is_recurring: newDonationRecurring,
          notes: newDonationNotes,
          payment_gateway_id: newDonationPaymentGateway,
          status: newDonationStatus,
          income_type: newDonationIncomeType,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate the query to refetch donations
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      toast({
        title: "Donation Created",
        description: "New donation created successfully.",
      });
      resetCreateDialog();
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: `Failed to create donation: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Filter donations based on search query
  const filteredDonations = donations?.filter((donation) =>
    donation.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donation.payment_gateway_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donation.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset the create dialog state
  const resetCreateDialog = () => {
    setIsCreateDialogOpen(false);
    setNewDonationDate(undefined);
    setNewDonationAmount('');
    setNewDonationRecurring(false);
    setNewDonationNotes('');
    setNewDonationPaymentGateway('');
    setNewDonationStatus('');
    setNewDonationIncomeType('');
  };

  // Handle creating a new donation
  const handleCreateDonation = async () => {
    try {
      await createDonation.mutateAsync();
    } catch (error: any) {
      toast({
        title: "Creation Failed",
        description: `Failed to create donation: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Custom handler for date picker
  const handleDateChange = (date: Date | Date[] | { from: Date; to?: Date } | undefined) => {
    if (date instanceof Date) {
      setNewDonationDate(date);
    } else if (Array.isArray(date) && date.length > 0) {
      setNewDonationDate(date[0]);
    } else if (date && 'from' in date) {
      setNewDonationDate(date.from);
    }
  };

  return (
    <AdminLayout title="Finance">
      <SEO title="Finance | Meow Rescue Admin" />

      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-meow-primary">Income</h1>
          <Button onClick={() => setIsCreateDialogOpen(true)}>Add Income</Button>
        </div>

        <div className="flex items-center mb-6">
          <Input
            placeholder="Search donations..."
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
            <p className="text-red-500">Error loading donations. Please try again later.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>A list of all donations received.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Recurring</TableHead>
                  <TableHead>Payment Gateway</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Income Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDonations?.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell>{new Date(donation.donation_date).toLocaleDateString()}</TableCell>
                    <TableCell>${donation.amount.toFixed(2)}</TableCell>
                    <TableCell>{donation.is_recurring ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{donation.payment_gateway_id}</TableCell>
                    <TableCell>{donation.status}</TableCell>
                    <TableCell>{donation.income_type}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Donation Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => refetch()}>
                            Refresh
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredDonations?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No donations found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Create Donation Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Income</DialogTitle>
              <DialogDescription>
                Add a new income entry to the database.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="donationDate">Donation Date</Label>
                  <DatePicker
                    mode="single"
                    selected={newDonationDate}
                    onSelect={handleDateChange}
                    placeholder={new Date().toLocaleDateString()}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    type="number"
                    id="amount"
                    placeholder="Enter amount"
                    value={newDonationAmount}
                    onChange={(e) => setNewDonationAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recurring">Recurring</Label>
                  <Input
                    type="checkbox"
                    id="recurring"
                    checked={newDonationRecurring}
                    onChange={(e) => setNewDonationRecurring(e.target.checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentGateway">Payment Gateway</Label>
                  <Select onValueChange={setNewDonationPaymentGateway}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select payment gateway" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Stripe">Stripe</SelectItem>
                      <SelectItem value="PayPal">PayPal</SelectItem>
                      <SelectItem value="Check">Check</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select onValueChange={setNewDonationStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                      <SelectItem value="Refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incomeType">Income Type</Label>
                  <Select onValueChange={setNewDonationIncomeType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select income type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Donation">Donation</SelectItem>
                      <SelectItem value="Grant">Grant</SelectItem>
                      <SelectItem value="Fundraiser">Fundraiser</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter notes"
                  value={newDonationNotes}
                  onChange={(e) => setNewDonationNotes(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetCreateDialog}>
                Cancel
              </Button>
              <Button onClick={handleCreateDonation}>Create Income</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminFinance;
