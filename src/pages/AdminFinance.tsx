
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, CreditCard, Coins, Upload, Receipt } from 'lucide-react';
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
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import { Donation, Expense } from '@/types/finance';

const AdminFinance: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expenses'>('all');
  
  // Income form state
  const [isCreateIncomeDialogOpen, setIsCreateIncomeDialogOpen] = useState(false);
  const [newDonationDate, setNewDonationDate] = useState<Date | undefined>(undefined);
  const [newDonationAmount, setNewDonationAmount] = useState('');
  const [newDonationRecurring, setNewDonationRecurring] = useState(false);
  const [newDonationNotes, setNewDonationNotes] = useState('');
  const [newDonationPaymentGateway, setNewDonationPaymentGateway] = useState('');
  const [newDonationStatus, setNewDonationStatus] = useState('');
  const [newDonationIncomeType, setNewDonationIncomeType] = useState('');

  // Expense form state
  const [isCreateExpenseDialogOpen, setIsCreateExpenseDialogOpen] = useState(false);
  const [newExpenseDate, setNewExpenseDate] = useState<Date | undefined>(undefined);
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseDescription, setNewExpenseDescription] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState('');
  const [newExpenseVendor, setNewExpenseVendor] = useState('');
  const [newExpensePaymentMethod, setNewExpensePaymentMethod] = useState('');
  const [newExpenseReceiptFile, setNewExpenseReceiptFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch donations from Supabase
  const { data: donations, isLoading: isLoadingDonations, error: donationsError, refetch: refetchDonations } = useQuery({
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

  // Fetch expenses from Supabase
  const { data: expenses, isLoading: isLoadingExpenses, error: expensesError, refetch: refetchExpenses } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('expense_date', { ascending: false });

      if (error) throw error;
      return data as Expense[];
    },
  });

  useEffect(() => {
    refetchDonations();
    refetchExpenses();
  }, [refetchDonations, refetchExpenses]);

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
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      toast({
        title: "Donation Created",
        description: "New donation created successfully.",
      });
      resetIncomeDialog();
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: `Failed to create donation: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Mutation to create a new expense
  const createExpense = useMutation({
    mutationFn: async () => {
      let receiptUrl = '';
      
      // Upload receipt if file is selected
      if (newExpenseReceiptFile) {
        const fileName = `${Date.now()}-${newExpenseReceiptFile.name}`;
        
        // Set up progress tracker
        const progressHandler = (progress: { loaded: number; total: number }) => {
          setUploadProgress((progress.loaded / progress.total) * 100);
        };
        
        // Upload file with modified options that don't use onUploadProgress
        const { data, error } = await supabase.storage
          .from('receipts')
          .upload(fileName, newExpenseReceiptFile, {
            cacheControl: '3600',
            upsert: false
          });

        // Update progress manually after upload completes
        setUploadProgress(100);

        if (error) throw error;
        
        // Get public URL for the uploaded file
        const { data: urlData } = supabase.storage
          .from('receipts')
          .getPublicUrl(fileName);
          
        receiptUrl = urlData.publicUrl;
      }

      const { error } = await supabase
        .from('expenses')
        .insert({
          expense_date: newExpenseDate ? format(newExpenseDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
          amount: parseFloat(newExpenseAmount),
          description: newExpenseDescription,
          category: newExpenseCategory,
          vendor: newExpenseVendor,
          payment_method: newExpensePaymentMethod,
          receipt_url: receiptUrl || null,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "Expense Created",
        description: "New expense created successfully.",
      });
      resetExpenseDialog();
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: `Failed to create expense: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Combine and sort transactions for All tab
  const allTransactions = React.useMemo(() => {
    const combined = [];
    
    if (donations) {
      combined.push(...donations.map(donation => ({
        ...donation,
        type: 'income',
        date: new Date(donation.donation_date),
        displayAmount: parseFloat(donation.amount.toString()).toFixed(2)
      })));
    }
    
    if (expenses) {
      combined.push(...expenses.map(expense => ({
        ...expense,
        type: 'expense',
        date: new Date(expense.expense_date),
        displayAmount: parseFloat(expense.amount.toString()).toFixed(2)
      })));
    }
    
    // Sort by date (newest first)
    return combined.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [donations, expenses]);

  // Filter data based on search query
  const filteredDonations = donations?.filter((donation) =>
    donation.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donation.payment_gateway_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donation.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donation.income_type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredExpenses = expenses?.filter((expense) =>
    expense.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.vendor?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAllTransactions = allTransactions.filter((transaction) => {
    if (transaction.type === 'income') {
      const donation = transaction as any;
      return donation.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donation.payment_gateway_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donation.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donation.income_type?.toLowerCase().includes(searchQuery.toLowerCase());
    } else {
      const expense = transaction as any;
      return expense.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.vendor?.toLowerCase().includes(searchQuery.toLowerCase());
    }
  });

  // Reset form states
  const resetIncomeDialog = () => {
    setIsCreateIncomeDialogOpen(false);
    setNewDonationDate(undefined);
    setNewDonationAmount('');
    setNewDonationRecurring(false);
    setNewDonationNotes('');
    setNewDonationPaymentGateway('');
    setNewDonationStatus('');
    setNewDonationIncomeType('');
  };

  const resetExpenseDialog = () => {
    setIsCreateExpenseDialogOpen(false);
    setNewExpenseDate(undefined);
    setNewExpenseAmount('');
    setNewExpenseDescription('');
    setNewExpenseCategory('');
    setNewExpenseVendor('');
    setNewExpensePaymentMethod('');
    setNewExpenseReceiptFile(null);
    setUploadProgress(0);
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

  // Handle creating a new expense
  const handleCreateExpense = async () => {
    try {
      await createExpense.mutateAsync();
    } catch (error: any) {
      toast({
        title: "Creation Failed",
        description: `Failed to create expense: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewExpenseReceiptFile(e.target.files[0]);
    }
  };

  // Custom handler for date picker
  const handleDateChange = (date: Date | Date[] | { from: Date; to?: Date } | undefined, setter: React.Dispatch<React.SetStateAction<Date | undefined>>) => {
    if (date instanceof Date) {
      setter(date);
    } else if (Array.isArray(date) && date.length > 0) {
      setter(date[0]);
    } else if (date && 'from' in date) {
      setter(date.from);
    }
  };

  // Calculate total income and expenses
  const totalIncome = donations?.reduce((sum, donation) => sum + parseFloat(donation.amount.toString()), 0) || 0;
  const totalExpenses = expenses?.reduce((sum, expense) => sum + parseFloat(expense.amount.toString()), 0) || 0;
  const balance = totalIncome - totalExpenses;

  return (
    <AdminLayout title="Finance">
      <SEO title="Finance | Meow Rescue Admin" />

      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-meow-primary">Finance</h1>
          <div className="flex gap-2">
            <Button onClick={() => setIsCreateIncomeDialogOpen(true)}>Add Income</Button>
            <Button onClick={() => setIsCreateExpenseDialogOpen(true)}>Add Expense</Button>
          </div>
        </div>

        {/* Finance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-green-500" />
                Total Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Receipt className="mr-2 h-5 w-5 text-red-500" />
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Coins className="mr-2 h-5 w-5 text-blue-500" />
                Current Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${balance.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(value as 'all' | 'income' | 'expenses')}>
            <TabsList>
              <TabsTrigger value="all">All Transactions</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="w-full md:w-auto">
            <Input
              placeholder={`Search transactions...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>

        {/* All Transactions Tab Content */}
        {activeTab === 'all' && (
          (isLoadingDonations || isLoadingExpenses) ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
            </div>
          ) : (donationsError || expensesError) ? (
            <div className="text-center py-12">
              <p className="text-red-500">Error loading transactions. Please try again later.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  refetchDonations();
                  refetchExpenses();
                }}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <Table>
                <TableCaption>A list of all transactions.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category/Income Type</TableHead>
                    <TableHead>Vendor/Payment Gateway</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAllTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type === 'income' ? 'Income' : 'Expense'}
                        </span>
                      </TableCell>
                      <TableCell className={transaction.type === 'income' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                        ${transaction.displayAmount}
                      </TableCell>
                      <TableCell>
                        {transaction.type === 'income' 
                          ? (transaction as any).notes || 'N/A'
                          : (transaction as any).description
                        }
                      </TableCell>
                      <TableCell>
                        {transaction.type === 'income' 
                          ? (transaction as any).income_type || 'Donation'
                          : (transaction as any).category
                        }
                      </TableCell>
                      <TableCell>
                        {transaction.type === 'income' 
                          ? (transaction as any).payment_gateway_id || 'N/A'
                          : (transaction as any).vendor
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Transaction Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => 
                              transaction.type === 'income' ? refetchDonations() : refetchExpenses()
                            }>
                              Refresh
                            </DropdownMenuItem>
                            {transaction.type === 'expense' && (transaction as any).receipt_url && (
                              <DropdownMenuItem>
                                <a 
                                  href={(transaction as any).receipt_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="w-full text-left"
                                >
                                  View Receipt
                                </a>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredAllTransactions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )
        )}

        {/* Income Tab Content */}
        {activeTab === 'income' && (
          isLoadingDonations ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
            </div>
          ) : donationsError ? (
            <div className="text-center py-12">
              <p className="text-red-500">Error loading donations. Please try again later.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => refetchDonations()}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <Table>
                <TableCaption>A list of all income received.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Income Type</TableHead>
                    <TableHead>Recurring</TableHead>
                    <TableHead>Payment Gateway</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDonations?.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell>{new Date(donation.donation_date).toLocaleDateString()}</TableCell>
                      <TableCell>${parseFloat(donation.amount.toString()).toFixed(2)}</TableCell>
                      <TableCell>{donation.income_type || 'Donation'}</TableCell>
                      <TableCell>{donation.is_recurring ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{donation.payment_gateway_id || 'N/A'}</TableCell>
                      <TableCell>{donation.status}</TableCell>
                      <TableCell>{donation.notes || 'N/A'}</TableCell>
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
                            <DropdownMenuItem onClick={() => refetchDonations()}>
                              Refresh
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredDonations?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No income entries found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )
        )}

        {/* Expenses Tab Content */}
        {activeTab === 'expenses' && (
          isLoadingExpenses ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
            </div>
          ) : expensesError ? (
            <div className="text-center py-12">
              <p className="text-red-500">Error loading expenses. Please try again later.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => refetchExpenses()}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <Table>
                <TableCaption>A list of all expenses.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Receipt</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses?.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{new Date(expense.expense_date).toLocaleDateString()}</TableCell>
                      <TableCell>${parseFloat(expense.amount.toString()).toFixed(2)}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{expense.vendor}</TableCell>
                      <TableCell>{expense.payment_method}</TableCell>
                      <TableCell>
                        {expense.receipt_url ? (
                          <a 
                            href={expense.receipt_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 underline"
                          >
                            View Receipt
                          </a>
                        ) : (
                          'No Receipt'
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Expense Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => refetchExpenses()}>
                              Refresh
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredExpenses?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No expense entries found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )
        )}

        {/* Create Income Dialog */}
        <Dialog open={isCreateIncomeDialogOpen} onOpenChange={setIsCreateIncomeDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Income</DialogTitle>
              <DialogDescription>
                Add a new income entry to the database.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="donationDate">Date</Label>
                  <DatePicker
                    mode="single"
                    selected={newDonationDate}
                    onSelect={(date) => handleDateChange(date, setNewDonationDate)}
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
                  <Label htmlFor="incomeType">Income Type</Label>
                  <Select onValueChange={setNewDonationIncomeType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select income type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Donation">Donation</SelectItem>
                      <SelectItem value="Grant">Grant</SelectItem>
                      <SelectItem value="Fundraiser">Fundraiser</SelectItem>
                      <SelectItem value="Personal Fund">Personal Fund</SelectItem>
                      <SelectItem value="Loan">Loan</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recurring">Recurring</Label>
                  <div className="flex items-center h-10 pt-2">
                    <input
                      type="checkbox"
                      id="recurring"
                      checked={newDonationRecurring}
                      onChange={(e) => setNewDonationRecurring(e.target.checked)}
                      className="mr-2 h-4 w-4"
                    />
                    <Label htmlFor="recurring">This is a recurring income</Label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
              <Button variant="outline" onClick={resetIncomeDialog}>
                Cancel
              </Button>
              <Button onClick={handleCreateDonation}>Create Income</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Expense Dialog */}
        <Dialog open={isCreateExpenseDialogOpen} onOpenChange={setIsCreateExpenseDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>
                Add a new expense entry to the database.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expenseDate">Date</Label>
                  <DatePicker
                    mode="single"
                    selected={newExpenseDate}
                    onSelect={(date) => handleDateChange(date, setNewExpenseDate)}
                    placeholder={new Date().toLocaleDateString()}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expenseAmount">Amount</Label>
                  <Input
                    type="number"
                    id="expenseAmount"
                    placeholder="Enter amount"
                    value={newExpenseAmount}
                    onChange={(e) => setNewExpenseAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expenseDescription">Description</Label>
                <Input
                  id="expenseDescription"
                  placeholder="Enter description"
                  value={newExpenseDescription}
                  onChange={(e) => setNewExpenseDescription(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expenseCategory">Category</Label>
                  <Select onValueChange={setNewExpenseCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Supplies">Supplies</SelectItem>
                      <SelectItem value="Medical">Medical</SelectItem>
                      <SelectItem value="Rent">Rent</SelectItem>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Advertising">Advertising</SelectItem>
                      <SelectItem value="Equipment">Equipment</SelectItem>
                      <SelectItem value="Transportation">Transportation</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expenseVendor">Vendor</Label>
                  <Input
                    id="expenseVendor"
                    placeholder="Enter vendor name"
                    value={newExpenseVendor}
                    onChange={(e) => setNewExpenseVendor(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select onValueChange={setNewExpensePaymentMethod}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="Debit Card">Debit Card</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Check">Check</SelectItem>
                      <SelectItem value="PayPal">PayPal</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receipt">Receipt</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      id="receipt"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="text-sm"
                    />
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetExpenseDialog}>
                Cancel
              </Button>
              <Button onClick={handleCreateExpense}>Create Expense</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminFinance;
