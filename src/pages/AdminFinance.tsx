
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/pages/Admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';
import { Pencil, Trash2, FileText, DollarSign, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import SEO from '@/components/SEO';
import CatFoodTracker from '@/components/finance/CatFoodTracker';

interface Donation {
  id: string;
  amount: number;
  donation_date: string;
  donor_profile_id: string | null;
  notes: string | null;
  is_recurring: boolean;
  status: string;
  income_type: string | null;
  donor?: {
    first_name: string;
    last_name: string;
  };
}

interface Expense {
  id: string;
  amount: number;
  expense_date: string;
  description: string;
  category: string;
  vendor: string;
  payment_method: string;
  receipt_url: string | null;
}

const AdminFinance: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [addDonationModalOpen, setAddDonationModalOpen] = useState(false);
  const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [editMode, setEditMode] = useState<{ type: 'donation' | 'expense', id: string } | null>(null);
  
  // Form states
  const [donationForm, setDonationForm] = useState({
    id: '',
    amount: '',
    donation_date: format(new Date(), 'yyyy-MM-dd'),
    donor_name: '',
    notes: '',
    is_recurring: false,
    income_type: 'one-time',
    status: 'completed'
  });
  
  const [expenseForm, setExpenseForm] = useState({
    id: '',
    amount: '',
    expense_date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    category: '',
    vendor: '',
    payment_method: '',
    receipt_url: ''
  });

  // Fetch donation data
  const { data: donations, isLoading: donationsLoading } = useQuery({
    queryKey: ['donations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donations')
        .select(`
          *,
          donor:donor_profile_id (
            first_name,
            last_name
          )
        `)
        .order('donation_date', { ascending: false });
      
      if (error) throw error;
      return data as Donation[];
    }
  });

  // Fetch expense data
  const { data: expenses, isLoading: expensesLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('expense_date', { ascending: false });
      
      if (error) throw error;
      return data as Expense[];
    }
  });

  // Filter donations by search query
  const filteredDonations = donations?.filter(donation => 
    String(donation.amount).includes(searchQuery) ||
    (donation.donor?.first_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (donation.donor?.last_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (donation.notes?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (donation.income_type?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  // Filter expenses by search query
  const filteredExpenses = expenses?.filter(expense => 
    String(expense.amount).includes(searchQuery) ||
    expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.payment_method.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mutation to add or update donation
  const donationMutation = useMutation({
    mutationFn: async (formData: typeof donationForm) => {
      const isUpdate = !!formData.id;
      
      const payload = {
        amount: parseFloat(formData.amount),
        donation_date: new Date(formData.donation_date).toISOString(),
        notes: formData.notes || null,
        is_recurring: formData.is_recurring,
        income_type: formData.income_type,
        status: formData.status
      };
      
      if (isUpdate) {
        const { error } = await supabase
          .from('donations')
          .update(payload)
          .eq('id', formData.id);
        
        if (error) throw error;
        return { type: 'update', id: formData.id };
      } else {
        const { data, error } = await supabase
          .from('donations')
          .insert([payload])
          .select();
        
        if (error) throw error;
        return { type: 'insert', id: data[0].id };
      }
    },
    onSuccess: (result) => {
      toast({
        title: result.type === 'insert' ? "Donation Added" : "Donation Updated",
        description: result.type === 'insert' ? "New donation has been recorded." : "Donation has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      resetDonationForm();
      setAddDonationModalOpen(false);
      setEditMode(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save donation.",
        variant: "destructive"
      });
    }
  });

  // Mutation to add or update expense
  const expenseMutation = useMutation({
    mutationFn: async (formData: typeof expenseForm) => {
      const isUpdate = !!formData.id;
      
      const payload = {
        amount: parseFloat(formData.amount),
        expense_date: new Date(formData.expense_date).toISOString(),
        description: formData.description,
        category: formData.category,
        vendor: formData.vendor,
        payment_method: formData.payment_method,
        receipt_url: formData.receipt_url || null,
        created_by: (await supabase.auth.getUser()).data.user?.id
      };
      
      if (isUpdate) {
        const { error } = await supabase
          .from('expenses')
          .update(payload)
          .eq('id', formData.id);
        
        if (error) throw error;
        return { type: 'update', id: formData.id };
      } else {
        const { data, error } = await supabase
          .from('expenses')
          .insert([payload])
          .select();
        
        if (error) throw error;
        return { type: 'insert', id: data[0].id };
      }
    },
    onSuccess: (result) => {
      toast({
        title: result.type === 'insert' ? "Expense Added" : "Expense Updated",
        description: result.type === 'insert' ? "New expense has been recorded." : "Expense has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      resetExpenseForm();
      setAddExpenseModalOpen(false);
      setEditMode(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save expense.",
        variant: "destructive"
      });
    }
  });

  // Mutation to delete donation
  const deleteDonationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('donations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      toast({
        title: "Donation Deleted",
        description: "The donation has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['donations'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete donation.",
        variant: "destructive"
      });
    }
  });

  // Mutation to delete expense
  const deleteExpenseMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      toast({
        title: "Expense Deleted",
        description: "The expense has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete expense.",
        variant: "destructive"
      });
    }
  });

  // Calculate total donations and expenses
  const totalDonations = donations?.reduce((sum, donation) => sum + donation.amount, 0) || 0;
  const totalExpenses = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const netBalance = totalDonations - totalExpenses;

  // Upload receipt file
  const uploadReceipt = async (file: File) => {
    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `receipts/${fileName}`;
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('finance')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('finance')
        .getPublicUrl(filePath);
      
      setExpenseForm({
        ...expenseForm,
        receipt_url: data.publicUrl
      });
      
      toast({
        title: "Receipt Uploaded",
        description: "Your receipt has been uploaded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload receipt.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Reset donation form
  const resetDonationForm = () => {
    setDonationForm({
      id: '',
      amount: '',
      donation_date: format(new Date(), 'yyyy-MM-dd'),
      donor_name: '',
      notes: '',
      is_recurring: false,
      income_type: 'one-time',
      status: 'completed'
    });
  };

  // Reset expense form
  const resetExpenseForm = () => {
    setExpenseForm({
      id: '',
      amount: '',
      expense_date: format(new Date(), 'yyyy-MM-dd'),
      description: '',
      category: '',
      vendor: '',
      payment_method: '',
      receipt_url: ''
    });
  };

  // Edit donation
  const editDonation = (donation: Donation) => {
    setDonationForm({
      id: donation.id,
      amount: donation.amount.toString(),
      donation_date: format(new Date(donation.donation_date), 'yyyy-MM-dd'),
      donor_name: donation.donor ? `${donation.donor.first_name} ${donation.donor.last_name}` : '',
      notes: donation.notes || '',
      is_recurring: donation.is_recurring,
      income_type: donation.income_type || 'one-time',
      status: donation.status
    });
    setEditMode({ type: 'donation', id: donation.id });
    setAddDonationModalOpen(true);
  };

  // Edit expense
  const editExpense = (expense: Expense) => {
    setExpenseForm({
      id: expense.id,
      amount: expense.amount.toString(),
      expense_date: format(new Date(expense.expense_date), 'yyyy-MM-dd'),
      description: expense.description,
      category: expense.category,
      vendor: expense.vendor,
      payment_method: expense.payment_method,
      receipt_url: expense.receipt_url || ''
    });
    setEditMode({ type: 'expense', id: expense.id });
    setAddExpenseModalOpen(true);
  };

  // Confirm deletion
  const confirmDelete = (type: 'donation' | 'expense', id: string) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      if (type === 'donation') {
        deleteDonationMutation.mutate(id);
      } else {
        deleteExpenseMutation.mutate(id);
      }
    }
  };

  // Prepare monthly data for charts
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), i);
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    
    const monthDonations = donations?.filter(d => {
      const donationDate = new Date(d.donation_date);
      return donationDate >= monthStart && donationDate <= monthEnd;
    }) || [];
    
    const monthExpenses = expenses?.filter(e => {
      const expenseDate = new Date(e.expense_date);
      return expenseDate >= monthStart && expenseDate <= monthEnd;
    }) || [];
    
    const monthDonationsTotal = monthDonations.reduce((sum, d) => sum + d.amount, 0);
    const monthExpensesTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    return {
      name: format(date, 'MMM yyyy'),
      donations: monthDonationsTotal,
      expenses: monthExpensesTotal,
      net: monthDonationsTotal - monthExpensesTotal
    };
  }).reverse();

  // Prepare category data for pie chart
  const expenseCategories = expenses?.reduce((acc: Record<string, number>, expense) => {
    const category = expense.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += expense.amount;
    return acc;
  }, {});
  
  const pieChartData = expenseCategories ? Object.entries(expenseCategories).map(([name, value]) => ({ name, value })) : [];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <AdminLayout title="Finance">
      <SEO title="Finance | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-meow-primary">Finance Management</h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64"
            />
          </div>
        </div>
        
        <Tabs defaultValue="overview" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="cat-food">Cat Food</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Donations</p>
                      <h3 className="text-2xl font-bold text-green-600">${totalDonations.toFixed(2)}</h3>
                    </div>
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                      <h3 className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</h3>
                    </div>
                    <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                      <FileText className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Net Balance</p>
                      <h3 className={`text-2xl font-bold ${netBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        ${netBalance.toFixed(2)}
                      </h3>
                    </div>
                    <div className={`h-12 w-12 ${netBalance >= 0 ? 'bg-blue-100' : 'bg-red-100'} rounded-full flex items-center justify-center`}>
                      <DollarSign className={`h-6 w-6 ${netBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Finance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={last6Months}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="donations" stroke="#4ade80" name="Donations" />
                        <Line type="monotone" dataKey="expenses" stroke="#f87171" name="Expenses" />
                        <Line type="monotone" dataKey="net" stroke="#60a5fa" name="Net" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Expenses by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    {pieChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-center text-gray-500">No expense data available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader className="flex-row items-center justify-between pb-2">
                  <CardTitle>Recent Transactions</CardTitle>
                  <div className="flex gap-2">
                    <Button onClick={() => {
                      resetDonationForm();
                      setAddDonationModalOpen(true);
                    }}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Donation
                    </Button>
                    <Button onClick={() => {
                      resetExpenseForm();
                      setAddExpenseModalOpen(true);
                    }}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Expense
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {donationsLoading || expensesLoading ? (
                    <div className="flex justify-center py-6">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-meow-primary"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Combine and sort donations and expenses by date */}
                      {[...(donations || []), ...(expenses || [])]
                        .sort((a, b) => {
                          const dateA = new Date('donation_date' in a ? a.donation_date : a.expense_date);
                          const dateB = new Date('donation_date' in b ? b.donation_date : b.expense_date);
                          return dateB.getTime() - dateA.getTime();
                        })
                        .slice(0, 10) // Show only the 10 most recent transactions
                        .map((item) => {
                          const isDonation = 'donation_date' in item;
                          const date = new Date(isDonation ? item.donation_date : item.expense_date);
                          
                          return (
                            <div key={item.id} className="flex items-center justify-between p-4 border rounded-md">
                              <div className="flex items-center">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                  isDonation ? 'bg-green-100' : 'bg-red-100'
                                }`}>
                                  {isDonation ? (
                                    <DollarSign className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <FileText className="h-5 w-5 text-red-600" />
                                  )}
                                </div>
                                <div className="ml-4">
                                  <p className="font-medium">
                                    {isDonation ? (
                                      `Donation${item.donor ? ` from ${item.donor.first_name} ${item.donor.last_name}` : ''}`
                                    ) : (
                                      `${item.description} (${item.category})`
                                    )}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {date.toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <p className={`font-semibold ${isDonation ? 'text-green-600' : 'text-red-600'}`}>
                                  {isDonation ? '+' : '-'}${item.amount.toFixed(2)}
                                </p>
                                {isAdmin && (
                                  <div className="flex">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => isDonation ? editDonation(item as Donation) : editExpense(item as Expense)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => confirmDelete(isDonation ? 'donation' : 'expense', item.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="donations">
            <Card>
              <CardHeader className="flex-row items-center justify-between pb-2">
                <CardTitle>All Donations</CardTitle>
                <Button onClick={() => {
                  resetDonationForm();
                  setAddDonationModalOpen(true);
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Donation
                </Button>
              </CardHeader>
              <CardContent>
                {donationsLoading ? (
                  <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-meow-primary"></div>
                  </div>
                ) : filteredDonations && filteredDonations.length > 0 ? (
                  <div className="space-y-4">
                    {filteredDonations.map((donation) => (
                      <div key={donation.id} className="flex items-center justify-between p-4 border rounded-md">
                        <div>
                          <p className="font-medium">
                            {donation.donor ? `${donation.donor.first_name} ${donation.donor.last_name}` : 'Anonymous'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(donation.donation_date).toLocaleDateString()} • 
                            {donation.is_recurring ? ' Recurring' : ' One-time'}
                          </p>
                          {donation.notes && (
                            <p className="text-sm text-gray-600 mt-1">{donation.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-semibold text-green-600">
                            +${donation.amount.toFixed(2)}
                          </p>
                          {isAdmin && (
                            <div className="flex">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => editDonation(donation)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => confirmDelete('donation', donation.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-6 text-gray-500">
                    {searchQuery ? 'No donations match your search.' : 'No donations recorded yet.'}
                  </p>
                )}
              </CardContent>
            </Card>
            
            {/* Add Donation Modal */}
            {addDonationModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle>{editMode?.type === 'donation' ? 'Edit Donation' : 'Add Donation'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      donationMutation.mutate(donationForm);
                    }}>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="amount">Amount ($)</Label>
                          <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            required
                            value={donationForm.amount}
                            onChange={(e) => setDonationForm({ ...donationForm, amount: e.target.value })}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="donation_date">Date</Label>
                          <Input
                            id="donation_date"
                            type="date"
                            required
                            value={donationForm.donation_date}
                            onChange={(e) => setDonationForm({ ...donationForm, donation_date: e.target.value })}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="donor_name">Donor Name (Optional)</Label>
                          <Input
                            id="donor_name"
                            type="text"
                            value={donationForm.donor_name}
                            onChange={(e) => setDonationForm({ ...donationForm, donor_name: e.target.value })}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="income_type">Income Type</Label>
                          <Select
                            value={donationForm.income_type}
                            onValueChange={(value) => setDonationForm({ ...donationForm, income_type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select income type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="one-time">One-time Donation</SelectItem>
                              <SelectItem value="recurring">Recurring Donation</SelectItem>
                              <SelectItem value="grant">Grant</SelectItem>
                              <SelectItem value="fundraiser">Fundraiser</SelectItem>
                              <SelectItem value="adoption-fee">Adoption Fee</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="is_recurring"
                            checked={donationForm.is_recurring}
                            onChange={(e) => setDonationForm({ ...donationForm, is_recurring: e.target.checked })}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label htmlFor="is_recurring" className="text-sm font-medium cursor-pointer">
                            This is a recurring donation
                          </Label>
                        </div>
                        
                        <div>
                          <Label htmlFor="notes">Notes</Label>
                          <Textarea
                            id="notes"
                            value={donationForm.notes}
                            onChange={(e) => setDonationForm({ ...donationForm, notes: e.target.value })}
                            rows={3}
                          />
                        </div>
                        
                        <div className="flex justify-end gap-2 pt-4">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => {
                              setAddDonationModalOpen(false);
                              setEditMode(null);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={donationMutation.isPending}>
                            {donationMutation.isPending ? 'Saving...' : 'Save Donation'}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="expenses">
            <Card>
              <CardHeader className="flex-row items-center justify-between pb-2">
                <CardTitle>All Expenses</CardTitle>
                <Button onClick={() => {
                  resetExpenseForm();
                  setAddExpenseModalOpen(true);
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Expense
                </Button>
              </CardHeader>
              <CardContent>
                {expensesLoading ? (
                  <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-meow-primary"></div>
                  </div>
                ) : filteredExpenses && filteredExpenses.length > 0 ? (
                  <div className="space-y-4">
                    {filteredExpenses.map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between p-4 border rounded-md">
                        <div>
                          <p className="font-medium">{expense.description}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(expense.expense_date).toLocaleDateString()} • 
                            {expense.category} • {expense.vendor}
                          </p>
                          <p className="text-sm text-gray-600">
                            Paid via: {expense.payment_method}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-semibold text-red-600">
                            -${expense.amount.toFixed(2)}
                          </p>
                          {isAdmin && (
                            <div className="flex">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => editExpense(expense)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => confirmDelete('expense', expense.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-6 text-gray-500">
                    {searchQuery ? 'No expenses match your search.' : 'No expenses recorded yet.'}
                  </p>
                )}
              </CardContent>
            </Card>
            
            {/* Add Expense Modal */}
            {addExpenseModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle>{editMode?.type === 'expense' ? 'Edit Expense' : 'Add Expense'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      expenseMutation.mutate(expenseForm);
                    }}>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Input
                            id="description"
                            type="text"
                            required
                            value={expenseForm.description}
                            onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="amount">Amount ($)</Label>
                          <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            required
                            value={expenseForm.amount}
                            onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="expense_date">Date</Label>
                          <Input
                            id="expense_date"
                            type="date"
                            required
                            value={expenseForm.expense_date}
                            onChange={(e) => setExpenseForm({ ...expenseForm, expense_date: e.target.value })}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={expenseForm.category}
                            onValueChange={(value) => setExpenseForm({ ...expenseForm, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Cat Food">Cat Food</SelectItem>
                              <SelectItem value="Veterinary">Veterinary</SelectItem>
                              <SelectItem value="Medications">Medications</SelectItem>
                              <SelectItem value="Litter">Litter</SelectItem>
                              <SelectItem value="Toys & Supplies">Toys & Supplies</SelectItem>
                              <SelectItem value="Marketing">Marketing</SelectItem>
                              <SelectItem value="Event">Event</SelectItem>
                              <SelectItem value="Utilities">Utilities</SelectItem>
                              <SelectItem value="Rent">Rent</SelectItem>
                              <SelectItem value="Travel">Travel</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="vendor">Vendor/Store</Label>
                          <Input
                            id="vendor"
                            type="text"
                            required
                            value={expenseForm.vendor}
                            onChange={(e) => setExpenseForm({ ...expenseForm, vendor: e.target.value })}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="payment_method">Payment Method</Label>
                          <Select
                            value={expenseForm.payment_method}
                            onValueChange={(value) => setExpenseForm({ ...expenseForm, payment_method: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Credit Card">Credit Card</SelectItem>
                              <SelectItem value="Debit Card">Debit Card</SelectItem>
                              <SelectItem value="Cash">Cash</SelectItem>
                              <SelectItem value="Check">Check</SelectItem>
                              <SelectItem value="PayPal">PayPal</SelectItem>
                              <SelectItem value="Venmo">Venmo</SelectItem>
                              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="receipt">Receipt (Optional)</Label>
                          <div className="mt-1">
                            <Input
                              id="receipt"
                              type="file"
                              accept="image/*,.pdf"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) uploadReceipt(file);
                              }}
                            />
                          </div>
                          {isUploading && (
                            <div className="flex justify-center py-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-meow-primary"></div>
                            </div>
                          )}
                          {expenseForm.receipt_url && (
                            <div className="mt-2">
                              <a 
                                href={expenseForm.receipt_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                              >
                                View uploaded receipt
                              </a>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-end gap-2 pt-4">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => {
                              setAddExpenseModalOpen(false);
                              setEditMode(null);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={expenseMutation.isPending}>
                            {expenseMutation.isPending ? 'Saving...' : 'Save Expense'}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="cat-food">
            <CatFoodTracker isAdmin={isAdmin} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminFinance;
