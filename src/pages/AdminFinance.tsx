import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Download, Calendar, Search, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';

interface FinancialRecord {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  notes?: string;
  created_at: string;
  updated_at: string;
}

const AdminFinance: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch financial records
  const { data: financialRecords, isLoading, error, refetch } = useQuery({
    queryKey: ['financial-records'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('financial_records')
          .select('*')
          .order('date', { ascending: false });
        
        if (error) throw error;
        return data as FinancialRecord[];
      } catch (err: any) {
        console.error("Error fetching financial records:", err);
        toast({
          title: "Error fetching records",
          description: err.message || "Failed to load financial records",
          variant: "destructive"
        });
        return [] as FinancialRecord[];
      }
    }
  });

  // Add financial record mutation
  const addFinancialRecord = useMutation({
    mutationFn: async (newRecord: Omit<FinancialRecord, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('financial_records')
        .insert([newRecord]);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-records'] });
      toast({
        title: "Record Added",
        description: "Financial record added successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Adding Record",
        description: error.message || "Failed to add financial record",
        variant: "destructive"
      });
    }
  });

  // Update financial record mutation
  const updateFinancialRecord = useMutation({
    mutationFn: async ({ id, updatedRecord }: { id: string; updatedRecord: Partial<FinancialRecord> }) => {
      const { data, error } = await supabase
        .from('financial_records')
        .update(updatedRecord)
        .eq('id', id);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-records'] });
      toast({
        title: "Record Updated",
        description: "Financial record updated successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Updating Record",
        description: error.message || "Failed to update financial record",
        variant: "destructive"
      });
    }
  });

  // Delete financial record mutation
  const deleteFinancialRecord = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('financial_records')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-records'] });
      toast({
        title: "Record Deleted",
        description: "Financial record deleted successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Deleting Record",
        description: error.message || "Failed to delete financial record",
        variant: "destructive"
      });
    }
  });

  // Filter records based on search query, category, and type
  const filteredRecords = financialRecords?.filter(record => {
    const matchesSearch = searchQuery === '' ||
      record.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === '' || filterCategory === 'all' ||
      record.category.toLowerCase() === filterCategory.toLowerCase();
    
    const matchesType = filterType === '' || filterType === 'all' ||
      record.type.toLowerCase() === filterType.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesType;
  });

  // Calculate total balance
  const totalBalance = financialRecords?.reduce((acc, record) => {
    return record.type === 'income' ? acc + record.amount : acc - record.amount;
  }, 0) || 0;

  return (
    <AdminLayout title="Finance">
      <SEO title="Finance | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-meow-primary">Finance</h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full md:w-64"
              />
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Record
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="w-full sm:w-auto">
            <Select 
              value={filterCategory} 
              onValueChange={setFilterCategory}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="supplies">Supplies</SelectItem>
                <SelectItem value="adoption_fees">Adoption Fees</SelectItem>
                <SelectItem value="donations">Donations</SelectItem>
                {/* Add more categories as needed */}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-auto">
            <Select 
              value={filterType} 
              onValueChange={setFilterType}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
            <CardDescription>Summary of income and expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Total Balance</h3>
                <p className="text-2xl">${totalBalance.toFixed(2)}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Total Income</h3>
                <p className="text-2xl text-green-500">
                  ${financialRecords?.filter(r => r.type === 'income').reduce((acc, r) => acc + r.amount, 0).toFixed(2)}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Total Expenses</h3>
                <p className="text-2xl text-red-500">
                  ${financialRecords?.filter(r => r.type === 'expense').reduce((acc, r) => acc + r.amount, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
          </div>
        ) : filteredRecords && filteredRecords.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableCaption>Financial records overview.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>{record.description}</TableCell>
                    <TableCell>{record.category}</TableCell>
                    <TableCell>{record.type}</TableCell>
                    <TableCell className="text-right">
                      ${record.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Financial Records</h2>
              <p className="text-gray-500 mb-8">
                There are no financial records in the database yet.
              </p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminFinance;
