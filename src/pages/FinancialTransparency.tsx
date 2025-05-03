import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import PageHeader from "@/components/ui/PageHeader";
import { InfoIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { checkSupabaseConnection, checkFinancialData } from "@/integrations/supabase/client";
import FinancialOverview from "@/components/finance/FinancialOverview";
import FinancialDataTabs from "@/components/finance/FinancialDataTabs";
import { useFinancialStats } from '@/hooks/useFinancialStats';
import { useRecentDonors } from '@/hooks/finance/useRecentDonors';
import { useTopDonors } from '@/hooks/finance/useTopDonors';
import { useExpenses } from '@/hooks/finance/useExpenses';
import getSupabaseClient from '@/integrations/supabase/client';

const FinancialTransparency: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("summary");
  const [donorLimit, setDonorLimit] = useState<number>(10); // for pagination
  const navigate = useNavigate();
  // Use YTD stats only for transparency page
  const { financialStats } = useFinancialStats();
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Fetch paginated all-time donors
  const { data: recentDonors = [], isLoading: donorsLoading } = useRecentDonors({ limit: donorLimit });
  const { data: topDonors = [], isLoading: topDonorsLoading } = useTopDonors({ limit: donorLimit });
  
  // Fetch individual expense records
  const { data: expenseRecords = [], isLoading: expensesLoading } = useExpenses();

  // Handler for loading more donors
  const handleLoadMoreDonors = () => setDonorLimit((prev) => prev + 10);

  // Mark when client-side hydration is complete
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Test connection and fetch data on page load
  useEffect(() => {
    const init = async () => {
      try {
        // Check connection
        const connectionStatus = await checkSupabaseConnection();
        console.log("Supabase connection status on Financial Transparency page:", connectionStatus);

        if (!connectionStatus.connected) {
          toast.error("Unable to connect to the database. Some data may not be available.");
          return;
        }

        // Check if we have actual data
        const sampleData = await checkFinancialData();
        console.log("Financial data sample:", sampleData);

        if (
          !sampleData.donations.length &&
          !sampleData.expenses.length &&
          !sampleData.budgets.length
        ) {
          console.warn("No financial data found in the database");
        }
      } catch (err) {
        console.error("Error initializing financial transparency page:", err);
      }
    };

    // Only run initialization if we're in the browser (client-side)
    if (typeof window !== 'undefined') {
      init();
    }
  }, []); // Ensure this runs only once on mount

  // Subscribe to real-time updates for financial data
  useEffect(() => {
    // Skip subscription during server-side rendering
    if (typeof window === 'undefined') return;
    
    console.log('Setting up real-time subscription for financial data');
    
    const subscription = getSupabaseClient()
      .channel('financial-data-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'donations' }, (payload) => {
        console.log('Donation update received:', payload);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, (payload) => {
        console.log('Expense update received:', payload);
      })
      .subscribe();

    // Mark elements as having real-time data for initialization script
    document.querySelectorAll('[data-realtime]').forEach(el => {
      el.setAttribute('data-initialized', 'true');
    });

    return () => {
      console.log('Unsubscribing from financial data updates');
      subscription.unsubscribe();
    };
  }, [isHydrated]);

  // Handle donations
  const handleDonate = (campaignId: string, assignedBudgetCategory?: string) => {
    toast.success("Redirecting to donation page...");
    let url = `/donate?campaign=${campaignId}`;
    if (assignedBudgetCategory) {
      url += `&category=${encodeURIComponent(assignedBudgetCategory)}`;
    }
    navigate(url);
  };

  // Log data for debugging
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    console.log("Financial Transparency Render Data:", {
      totalBudget: financialStats.totalBudget,
      totalDonations: financialStats.totalIncome,
      totalExpenses: financialStats.totalExpenses,
      netBalance: financialStats.totalIncome - financialStats.totalExpenses,
      isLoading: {
        totalBudget: financialStats.isLoading.totalBudget,
        totalDonations: financialStats.isLoading.totalIncome,
        totalExpenses: financialStats.isLoading.totalExpenses,
      },
      isHydrated
    });
  }, [financialStats, isHydrated]);

  return (
    <Layout>
      <SEO title="Financial Transparency | Meow Rescue" />
      
      <PageHeader 
        title="Financial Transparency" 
        subtitle="At Meow Rescue, we believe in complete transparency with our finances. This dashboard shows real-time data on our donations, expenses, and how funds are used to help cats in our care."
      />
      
      <div className="container mx-auto py-8 px-2 sm:px-4">
        <div className="max-w-5xl mx-auto flex flex-col w-full items-center">
          <FinancialOverview
            data-realtime="financial-overview"
            totalBudget={financialStats.totalBudget || 0}
            totalIncome={financialStats.totalIncome || 0} 
            totalExpenses={financialStats.totalExpenses || 0} 
            monthlyIncome={financialStats.monthlyIncome || 0} 
            monthlyExpenses={financialStats.monthlyExpenses || 0} 
            previousMonthIncome={financialStats.previousMonthIncome || 0} 
            previousMonthExpenses={financialStats.previousMonthExpenses || 0} 
            isLoading={{
              monthlyIncome: financialStats.isLoading.monthlyIncome,
              monthlyExpenses: financialStats.isLoading.monthlyExpenses,
              previousMonthIncome: financialStats.isLoading.previousMonthIncome,
              previousMonthExpenses: financialStats.isLoading.previousMonthExpenses,
              totalBudget: financialStats.isLoading.totalBudget,
              budgetCategories: false,
              totalIncome: financialStats.isLoading.totalIncome,
              campaigns: false,
              totalExpenses: financialStats.isLoading.totalExpenses
            }}
          />
          
          <FinancialDataTabs
            data-realtime="financial-tabs"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            budgetCategories={financialStats.budgetCategories || []}
            campaigns={financialStats.campaigns || []}
            recentDonors={recentDonors}
            topDonors={topDonors}
            expenses={expenseRecords}
            isLoading={{
              budgetCategories: financialStats.isLoading.budgetCategories,
              campaigns: financialStats.isLoading.campaigns,
              donorsLoading,
              topDonorsLoading,
              expensesLoading
            }}
            onDonate={handleDonate}
          />
          
          <div className="mt-8 border-t border-gray-200 pt-4 text-center text-sm text-gray-500 w-full">
            <p className="flex items-center justify-center">
              <InfoIcon className="h-4 w-4 mr-2" />
              This dashboard updates automatically with our financial records. Last updated: {new Date().toLocaleDateString()}
            </p>
            {!isHydrated && (
              <p className="text-xs mt-2 text-yellow-600">
                Loading real-time data...
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FinancialTransparency;
