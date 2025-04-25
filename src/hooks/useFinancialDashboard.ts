
import { useFinancialStats } from '@/hooks/useFinancialStats';
import { useRecentDonors } from '@/hooks/finance/useRecentDonors';
import { useTopDonors } from '@/hooks/finance/useTopDonors';
import { useExpenses } from '@/hooks/finance/useExpenses';
import { useEffect } from 'react';
import { checkSupabaseConnection, checkFinancialData } from '@/integrations/supabase/client';

export const useFinancialDashboard = () => {
  // First check the Supabase connection
  useEffect(() => {
    const verifyConnection = async () => {
      const connectionStatus = await checkSupabaseConnection();
      console.log('Supabase connection status:', connectionStatus);
      
      if (connectionStatus.connected) {
        // If connected, check sample financial data
        const financialData = await checkFinancialData();
        console.log('Financial data availability:', {
          donationsCount: financialData.donations.length,
          expensesCount: financialData.expenses.length,
          budgetsCount: financialData.budgets.length
        });
      }
    };
    
    verifyConnection();
  }, []);

  // Get financial data from custom hooks
  const {
    totalBudget,
    totalDonations,
    budgetCategories,
    monthlyDonations,
    monthlyExpenses,
    previousMonthDonations,
    previousMonthExpenses,
    campaigns,
    isLoading,
    refetchFinancialStats
  } = useFinancialStats();

  // Fetch donors and expenses using custom hooks with explicit configuration
  const { 
    data: recentDonors, 
    isLoading: donorsLoading, 
    refetch: refetchRecentDonors 
  } = useRecentDonors({
    staleTime: 5000, // 5 seconds for very fresh data
    gcTime: 60000, // Formerly cacheTime - 1 minute
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 3
  });
  
  const { 
    data: topDonors, 
    isLoading: topDonorsLoading, 
    refetch: refetchTopDonors 
  } = useTopDonors({
    staleTime: 5000, // 5 seconds for very fresh data
    gcTime: 60000, // Formerly cacheTime - 1 minute
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 3
  });
  
  const { 
    data: expenses, 
    isLoading: expensesLoading, 
    refetch: refetchExpenses 
  } = useExpenses({
    staleTime: 5000, // 5 seconds for very fresh data
    gcTime: 60000, // Formerly cacheTime - 1 minute
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 3
  });
  
  // Automatically refetch data when the component mounts to ensure fresh data
  useEffect(() => {
    console.log("Refetching financial dashboard data...");
    
    const fetchAllData = async () => {
      try {
        // Refresh financial stats first
        await refetchFinancialStats();
        
        const donorsResult = await refetchRecentDonors();
        console.log("Recent donors refetch result:", donorsResult.data);
        
        const topDonorsResult = await refetchTopDonors();
        console.log("Top donors refetch result:", topDonorsResult.data);
        
        const expensesResult = await refetchExpenses();
        console.log("Expenses refetch result:", expensesResult.data);
      } catch (error) {
        console.error("Error refetching financial data:", error);
      }
    };
    
    // Initial fetch
    fetchAllData();
    
    // Set up an interval to periodically refresh the data
    const intervalId = setInterval(fetchAllData, 15000); // Refresh every 15 seconds
    
    return () => clearInterval(intervalId);
  }, [refetchRecentDonors, refetchTopDonors, refetchExpenses, refetchFinancialStats]);
  
  // Debug logging
  useEffect(() => {
    console.log("Financial Dashboard Data:", {
      totalBudget,
      totalDonations,
      budgetCategoriesCount: budgetCategories?.length,
      monthlyDonations,
      monthlyExpenses,
      recentDonorsCount: recentDonors?.length,
      topDonorsCount: topDonors?.length,
      expensesCount: expenses?.length,
      loadingStates: {
        totalBudget: isLoading.totalBudget,
        totalDonations: isLoading.totalDonations,
        donors: donorsLoading,
        topDonors: topDonorsLoading,
        expenses: expensesLoading
      }
    });
  }, [totalBudget, totalDonations, budgetCategories, monthlyDonations, monthlyExpenses, recentDonors, topDonors, expenses, isLoading, donorsLoading, topDonorsLoading, expensesLoading]);

  return {
    financialStats: {
      totalBudget,
      totalDonations,
      monthlyDonations,
      monthlyExpenses,
      previousMonthDonations,
      previousMonthExpenses,
      budgetCategories: budgetCategories || [],
      campaigns: campaigns || [],
      isLoading
    },
    donorData: {
      recentDonors: recentDonors || [],
      topDonors: topDonors || [],
      donorsLoading,
      topDonorsLoading
    },
    expenses: {
      data: expenses || [],
      isLoading: expensesLoading
    },
    refetchData: {
      refetchFinancialStats,
      refetchRecentDonors,
      refetchTopDonors,
      refetchExpenses
    }
  };
};
