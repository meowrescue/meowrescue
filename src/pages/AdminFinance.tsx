import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  DollarSign, 
  Download, 
  PlusCircle, 
  TrendingUp,
  Receipt,
  FileUp,
  Calculator,
  CreditCard,
  ShoppingBag
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Donation, Expense } from '@/types/finance';

const AdminFinance: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('donations');
  
  // Form states
  const [isAddDonationOpen, setIsAddDonationOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [donationFormData, setDonationFormData] = useState({
    amount: '',
    donor_name: '',
    donor_email: '',
    is_recurring: false,
    notes: ''
  });
  const [expenseFormData, setExpenseFormData] = useState({
    amount: '',
    description: '',
    category: '',
    vendor: '',
    payment_method: '',
    donation_id: 'none', // Changed from empty string to 'none'
    receipt: null as File | null
  });
  
  // Receipt upload state
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  
  // Fetch donations with donor information
  const { data: donations, isLoading: isDonationsLoading, error: donationsError, refetch: refetchDonations } = useQuery({
    queryKey: ['donations'],
    queryFn: async () => {
      const { data: donationsData, error: donationsError } = await supabase
        .from('donations')
        .select('*')
        .order('donation_date', { ascending: false });
      
      if (donationsError) throw donationsError;
      
      // For each donation with a donor_profile_id, fetch the donor's name and email
      const donationsWithDonorInfo = await Promise.all(
        donationsData.map(async (donation) => {
          if (donation.donor_profile_id) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('first_name, last_name, email')
              .eq('id', donation.donor_profile_id)
              .single();
              
            if (profileData) {
              return {
                ...donation,
                donor_name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Anonymous',
                donor_email: profileData.email,
                // Set default income_type if it doesn't exist
                income_type: donation.income_type || 'donation'
              };
            }
          }
          
          return {
            ...donation,
            donor_name: 'Anonymous',
            donor_email: '',
            // Set default income_type if it doesn't exist
            income_type: donation.income_type || 'donation'
          };
        })
      );
      
      // Explicitly cast to Donation[] to resolve type issues
      return donationsWithDonorInfo as Donation[];
    }
  });
  
  // Fetch expenses
  const { data: expenses, isLoading: isExpensesLoading, error: expensesError, refetch: refetchExpenses } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .order('expense_date', { ascending: false });
        
        if (error) throw error;
        return data as Expense[];
      } catch (error) {
        console.error("Error fetching expenses:", error);
        return [];
      }
    }
  });
  
  // Calculate total donations
  const totalDonations = donations?.reduce((sum, donation) => 
    sum + parseFloat(donation.amount.toString()), 0) || 0;
  
  // Calculate total expenses
  const totalExpenses = expenses?.reduce((sum, expense) => 
    sum + parseFloat(expense.amount.toString()), 0) || 0;
  
  // Calculate balance
  const balance = totalDonations - totalExpenses;
  
  // Calculate monthly donations (for this month)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyDonations = donations?.filter(donation => {
    const donationDate = new Date(donation.donation_date);
    return donationDate.getMonth() === currentMonth && 
           donationDate.getFullYear() === currentYear;
  }).reduce((sum, donation) => 
    sum + parseFloat(donation.amount.toString()), 0) || 0;
  
  // Calculate monthly expenses (for this month)
  const monthlyExpenses = expenses?.filter(expense => {
    const expenseDate = new Date(expense.expense_date);
    return expenseDate.getMonth() === currentMonth && 
           expenseDate.getFullYear() === currentYear;
  }).reduce((sum, expense) => 
    sum + parseFloat(expense.amount.toString()), 0) || 0;
  
  // Filter donations based on search query
  const filteredDonations = donations?.filter(donation =>
    donation.donor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donation.donor_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donation.notes?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter expenses based on search query
  const filteredExpenses = expenses?.filter(expense =>
    expense.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.vendor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle donation form input change
  const handleDonationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setDonationFormData({
      ...donationFormData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };
  
  // Handle expense form input change
  const handleExpenseInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setExpenseFormData({
      ...expenseFormData,
      [name]: value
    });
  };
  
  // Handle expense form select change
  const handleExpenseSelectChange = (name: string, value: string) => {
    setExpenseFormData({
      ...expenseFormData,
      [name]: value
    });
  };
  
  // Handle receipt file change
  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReceiptFile(file);
      
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Add new donation
  const handleAddDonation = async () => {
    try {
      const { error } = await supabase
        .from('donations')
        .insert([{
          amount: parseFloat(donationFormData.amount),
          donation_date: new Date().toISOString(),
          donor_name: donationFormData.donor_name,
          donor_email: donationFormData.donor_email,
          is_recurring: donationFormData.is_recurring,
          notes: donationFormData.notes,
          status: 'completed',
          income_type: 'donation' // Add default income_type
        }]);
      
      if (error) throw error;
      
      toast({
        title: "Donation Added",
        description: "The donation has been successfully recorded."
      });
      
      setIsAddDonationOpen(false);
      setDonationFormData({
        amount: '',
        donor_name: '',
        donor_email: '',
        is_recurring: false,
        notes: ''
      });
      refetchDonations();
    } catch (error: any) {
      toast({
        title: "Error Adding Donation",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  // Add new expense
  const handleAddExpense = async () => {
    try {
      // First upload receipt if exists
      let receiptUrl = null;
      if (receiptFile) {
        const fileName = `${Date.now()}-${receiptFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('receipts')
          .upload(fileName, receiptFile);
        
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('receipts')
          .getPublicUrl(fileName);
        
        receiptUrl = publicUrlData.publicUrl;
      }
      
      // Then record the expense
      const { error } = await supabase
        .from('expenses')
        .insert([{
          amount: parseFloat(expenseFormData.amount),
          expense_date: new Date().toISOString(),
          description: expenseFormData.description,
          category: expenseFormData.category,
          vendor: expenseFormData.vendor,
          payment_method: expenseFormData.payment_method,
          donation_id: expenseFormData.donation_id === 'none' ? null : expenseFormData.donation_id, // Modified to check for 'none'
          receipt_url: receiptUrl,
          created_at: new Date().toISOString(),
          created_by: (await supabase.auth.getUser()).data.user?.id
        }]);
      
      if (error) throw error;
      
      toast({
        title: "Expense Added",
        description: "The expense has been successfully recorded."
      });
      
      setIsAddExpenseOpen(false);
      setExpenseFormData({
        amount: '',
        description: '',
        category: '',
        vendor: '',
        payment_method: '',
        donation_id: 'none', // Updated default value to 'none'
        receipt: null
      });
      setReceiptFile(null);
      setReceiptPreview(null);
      refetchExpenses();
    } catch (error: any) {
      toast({
        title: "Error Adding Expense",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  // Export finance data as CSV
  const exportFinanceData = () => {
    const exportType = activeTab === 'donations' ? 'donations' : 'expenses';
    const data = exportType === 'donations' ? donations : expenses;
    
    if (!data || data.length === 0) {
      toast({
        title: "No Data",
        description: `There is no ${exportType} data to export.`,
        variant: "destructive"
      });
      return;
    }
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    const headers = exportType === 'donations' 
      ? ["ID", "Amount", "Date", "Donor Name", "Donor Email", "Recurring", "Status", "Notes"] 
      : ["ID", "Amount", "Date", "Description", "Category", "Vendor", "Payment Method", "Receipt URL", "Related Donation"];
    csvContent += headers.join(",") + "\n";
    
    // Add rows
    data.forEach(item => {
      let row;
      if (exportType === 'donations') {
        const donation = item as Donation;
        row = [
          donation.id,
          donation.amount,
          new Date(donation.donation_date).toLocaleDateString(),
          donation.donor_name?.replace(/,/g, " ") || 'Anonymous',
          donation.donor_email?.replace(/,/g, " ") || '',
          donation.is_recurring ? 'Yes' : 'No',
          donation.status,
          donation.notes?.replace(/,/g, " ") || ''
        ];
      } else {
        const expense = item as Expense;
        row = [
          expense.id,
          expense.amount,
          new Date(expense.expense_date).toLocaleDateString(),
          expense.description.replace(/,/g, " "),
          expense.category,
          expense.vendor,
          expense.payment_method,
          expense.receipt_url || '',
          expense.donation_id || ''
        ];
      }
      csvContent += row.join(",") + "\n";
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `meow_rescue_${exportType}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Complete",
      description: `The ${exportType} data has been exported.`
    });
  };

  return (
    
    <AdminLayout title="Finance">
      <SEO title="Finance | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-meow-primary">Finance</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={exportFinanceData}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            
            <Dialog open={isAddDonationOpen} onOpenChange={setIsAddDonationOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Donation
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Donation</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new donation.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      value={donationFormData.amount}
                      onChange={handleDonationInputChange}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="donor_name">Donor Name</Label>
                    <Input
                      id="donor_name"
                      name="donor_name"
                      value={donationFormData.donor_name}
                      onChange={handleDonationInputChange}
                      placeholder="Anonymous"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="donor_email">Donor Email</Label>
                    <Input
                      id="donor_email"
                      name="donor_email"
                      type="email"
                      value={donationFormData.donor_email}
                      onChange={handleDonationInputChange}
                      placeholder="donor@example.com"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      id="is_recurring"
                      name="is_recurring"
                      type="checkbox"
                      checked={donationFormData.is_recurring}
                      onChange={handleDonationInputChange}
                      className="rounded border-gray-300 text-meow-primary focus:ring-meow-primary"
                    />
                    <Label htmlFor="is_recurring">Recurring Donation</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={donationFormData.notes}
                      onChange={handleDonationInputChange}
                      placeholder="Any additional information"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDonationOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddDonation}>Add Donation</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                  <DialogDescription>
                    Record a new expense and upload a receipt.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="expense_amount">Amount ($)</Label>
                    <Input
                      id="expense_amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      value={expenseFormData.amount}
                      onChange={handleExpenseInputChange}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      name="description"
                      value={expenseFormData.description}
                      onChange={handleExpenseInputChange}
                      placeholder="What was purchased"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={expenseFormData.category} 
                      onValueChange={(value) => handleExpenseSelectChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cat Food">Cat Food</SelectItem>
                        <SelectItem value="Cat Supplies">Cat Supplies</SelectItem>
                        <SelectItem value="Veterinary">Veterinary</SelectItem>
                        <SelectItem value="Medications">Medications</SelectItem>
                        <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Events">Events</SelectItem>
                        <SelectItem value="Transportation">Transportation</SelectItem>
                        <SelectItem value="Facility">Facility</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vendor">Vendor</Label>
                    <Input
                      id="vendor"
                      name="vendor"
                      value={expenseFormData.vendor}
                      onChange={handleExpenseInputChange}
                      placeholder="Where it was purchased"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment_method">Payment Method</Label>
                    <Select 
                      value={expenseFormData.payment_method} 
                      onValueChange={(value) => handleExpenseSelectChange('payment_method', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="Debit Card">Debit Card</SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Check">Check</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="PayPal">PayPal</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="donation_id">Related Donation (Optional)</Label>
                    <Select 
                      value={expenseFormData.donation_id} 
                      onValueChange={(value) => handleExpenseSelectChange('donation_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a donation (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem> {/* Changed from empty string to "none" */}
                        {donations?.map(donation => (
                          <SelectItem key={donation.id} value={donation.id}>
                            ${donation.amount} - {donation.donor_name} ({new Date(donation.donation_date).toLocaleDateString()})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="receipt">Receipt (Optional)</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="receipt"
                        type="file"
                        onChange={handleReceiptChange}
                        accept="image/*,application/pdf"
                        className="flex-1"
                      />
                      {receiptPreview && (
                        <div className="h-16 w-16 overflow-hidden bg-gray-100 rounded border">
                          <img 
                            src={receiptPreview} 
                            alt="Receipt preview" 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddExpenseOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddExpense}>Add Expense</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalDonations.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
              <p className="text-xs text-gray-500 mt-1">Lifetime total</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <ShoppingBag className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalExpenses.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
              <p className="text-xs text-gray-500 mt-1">Lifetime expenses</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
              <Calculator className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${balance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
              <p className="text-xs text-gray-500 mt-1">Donations minus expenses</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(monthlyDonations - monthlyExpenses).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
              <p className="text-xs text-gray-500 mt-1">Net for current month</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="donations" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="donations">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="donations">
            <div className="flex items-center mb-6">
              <Input
                placeholder="Search donations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            {isDonationsLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
              </div>
            ) : donationsError ? (
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
                      <TableHead>Donor</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDonations?.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell>
                          {new Date(donation.donation_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{donation.donor_name}</TableCell>
                        <TableCell>{donation.donor_email || '-'}</TableCell>
                        <TableCell>
                          ${parseFloat(donation.amount.toString()).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge className={donation.is_recurring ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"}>
                            {donation.is_recurring ? 'Recurring' : 'One-time'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">
                            {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{donation.notes || '-'}</TableCell>
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
          </TabsContent>
          
          <TabsContent value="expenses">
            <div className="flex items-center mb-6">
              <Input
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            {isExpensesLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
              </div>
            ) : expensesError ? (
              <div className="text-center py-12">
                <p className="text-red-500">Error loading expenses. Please try again later.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>A list of all expenses recorded.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Receipt</TableHead>
                      <TableHead>Related Donation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses?.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>
                          {new Date(expense.expense_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>
                          <Badge className="bg-gray-100 text-gray-800">
                            {expense.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{expense.vendor}</TableCell>
                        <TableCell>
                          ${parseFloat(expense.amount.toString()).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </TableCell>
                        <TableCell>{expense.payment_method}</TableCell>
                        <TableCell>
                          {expense.receipt_url ? (
                            <a 
                              href={expense.receipt_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                            >
                              <Receipt className="h-4 w-4" />
                              <span>View</span>
                            </a>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          {expense.donation_id ? (
                            <Badge className="bg-blue-100 text-blue-800">
                              Linked
                            </Badge>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredExpenses?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          No expenses found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminFinance;
