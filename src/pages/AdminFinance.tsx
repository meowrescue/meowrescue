import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from './Admin';
import { useExpenses } from '@/hooks/finance/useExpenses';
import { useCatExpenses } from '@/hooks/finance/useCatExpenses';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PieChart, FileText, DollarSign } from 'lucide-react';
import { useFinancialStats } from '@/hooks/useFinancialStats';
import { supabase } from '@integrations/supabase';
import MonthlyRevenueCard from "@/components/finance/dashboard/MonthlyRevenueCard";
import MonthlyExpensesCard from "@/components/finance/dashboard/MonthlyExpensesCard";
import TaxDeadlinesCard from "@/components/finance/dashboard/TaxDeadlinesCard";
import OverviewTab from "@/components/finance/dashboard/tabs/OverviewTab";
import IncomeTab from "@/components/finance/dashboard/tabs/IncomeTab";
import ExpensesTab from "@/components/finance/dashboard/tabs/ExpensesTab";
import ReportsTab from "@/components/finance/dashboard/tabs/ReportsTab";
import TaxTab from "@/components/finance/dashboard/tabs/TaxTab";
import { useFinancialDashboard } from '@/hooks/useFinancialDashboard';

const AdminFinance = () => {
  const { data: expenses, isLoading: expensesLoading } = useExpenses();
  const { data: catExpenses, isLoading: catExpensesLoading } = useCatExpenses();
  const [activeTab, setActiveTab] = useState('overview');
  
  const {
    monthlyDonations,
    monthlyExpenses,
    previousMonthDonations,
    previousMonthExpenses,
    isLoading: statsLoading
  } = useFinancialDashboard();
  
  const [recentDonations, setRecentDonations] = useState([]);
  const [isLoadingDonations, setIsLoadingDonations] = useState(true);
  
  useEffect(() => {
    const fetchRecentDonations = async () => {
      try {
        const { data, error } = await supabase
          .from('donations')
          .select(`
            id,
            amount,
            donation_date,
            profiles:donor_profile_id (
              first_name,
              last_name
            )
          `)
          .order('donation_date', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        setRecentDonations(data || []);
      } catch (err) {
        console.error('Error fetching recent donations:', err);
      } finally {
        setIsLoadingDonations(false);
      }
    };
    
    fetchRecentDonations();
  }, []);
  
  // Calculate percentage changes - improved calculation for edge cases
  const calculatePercentChange = (current: number | undefined, previous: number | undefined): number => {
    if (previous === undefined || current === undefined) return 0;
    
    // If previous is zero or very small, but current has value
    if (previous === 0 || Math.abs(previous) < 0.001) {
      return current > 0 ? 100 : 0; // Return 100% for positive change from zero
    }
    
    return ((current - previous) / Math.abs(previous)) * 100;
  };
  
  const monthlyDonationsChange = calculatePercentChange(monthlyDonations, previousMonthDonations);
  const monthlyExpensesChange = calculatePercentChange(monthlyExpenses, previousMonthExpenses);

  return (
    <AdminLayout title="Finance Management">
      <div className="container mx-auto py-4 px-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-meow-primary">Finance Management</h1>
            <p className="text-gray-600">
              Comprehensive financial management and reporting tools
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/admin/budget">
                <PieChart className="mr-2 h-4 w-4" /> Budget Planning
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/finance/campaigns">
                <FileText className="mr-2 h-4 w-4" /> Campaigns
              </Link>
            </Button>
            <Button asChild>
              <Link to="/financial-transparency">
                <DollarSign className="mr-2 h-4 w-4" /> View Public Dashboard
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <MonthlyRevenueCard
            monthlyDonations={monthlyDonations}
            monthlyDonationsChange={monthlyDonationsChange}
            isLoading={statsLoading.monthlyDonations}
          />
          <MonthlyExpensesCard
            monthlyExpenses={monthlyExpenses}
            monthlyExpensesChange={monthlyExpensesChange}
            isLoading={statsLoading.monthlyExpenses}
          />
          <TaxDeadlinesCard />
        </div>

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="tax">Tax Documents</TabsTrigger>
          </TabsList>
          <div className="mt-6">
            <TabsContent value="overview" className="mt-0">
              <OverviewTab
                monthlyDonations={monthlyDonations}
                monthlyExpenses={monthlyExpenses}
              />
            </TabsContent>
            <TabsContent value="income" className="mt-0">
              <IncomeTab
                recentDonations={recentDonations}
                isLoadingDonations={isLoadingDonations}
              />
            </TabsContent>
            <TabsContent value="expenses" className="mt-0">
              <ExpensesTab
                expenses={expenses}
                expensesLoading={expensesLoading}
                catExpenses={catExpenses}
                catExpensesLoading={catExpensesLoading}
              />
            </TabsContent>
            <TabsContent value="reports" className="mt-0">
              <ReportsTab />
            </TabsContent>
            <TabsContent value="tax" className="mt-0">
              <TaxTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminFinance;
