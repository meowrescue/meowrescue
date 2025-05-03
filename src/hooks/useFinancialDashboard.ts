
import { useFinancialStats } from '@/hooks/useFinancialStats';
import { useRecentDonors } from '@/hooks/finance/useRecentDonors';
import { useTopDonors } from '@/hooks/finance/useTopDonors';
import { useExpenses } from '@/hooks/finance/useExpenses';
import { useEffect } from 'react';
import { checkSupabaseConnection, checkFinancialData } from '@/integrations/supabase/client';
import { getDonationsSum, getExpensesSum } from '@/services/finance';
import { useQuery } from '@tanstack/react-query';

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

  // Get current year boundaries
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);
  const today = new Date();

  // Fetch YTD donations and expenses
  const { data: totalDonations, refetch: refetchDonations, isLoading: loadingDonations } = useQuery({
    queryKey: ['ytd-donations'],
    queryFn: () => getDonationsSum({ startDate: startOfYear, endDate: today })
  });
  const { data: totalExpenses, refetch: refetchExpenses, isLoading: loadingExpenses } = useQuery({
    queryKey: ['ytd-expenses'],
    queryFn: () => getExpensesSum({ startDate: startOfYear, endDate: today })
  });

  // Get financial data from custom hooks
  const { financialStats } = useFinancialStats();
  
  const {
    budgetCategories,
    monthlyDonations,
    monthlyExpenses,
    previousMonthDonations,
    previousMonthExpenses,
    campaigns,
    isLoading: financialStatsLoading,
    refetchFinancialStats
  } = financialStats;

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
    isLoading: expensesLoading 
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
        
        await refetchDonations();
        await refetchExpenses();
      } catch (error) {
        console.error("Error refetching financial data:", error);
      }
    };
    
    // Initial fetch
    fetchAllData();
    
    // Set up an interval to periodically refresh the data
    const intervalId = setInterval(fetchAllData, 15000); // Refresh every 15 seconds
    
    return () => clearInterval(intervalId);
  }, [refetchRecentDonors, refetchTopDonors, refetchFinancialStats, refetchDonations, refetchExpenses]);
  
  // Debug logging
  useEffect(() => {
    console.log("Financial Dashboard Data:", {
      totalDonations,
      totalExpenses,
      budgetCategoriesCount: budgetCategories?.length,
      monthlyDonations,
      monthlyExpenses,
      recentDonorsCount: recentDonors?.length,
      topDonorsCount: topDonors?.length,
      expensesCount: expenses?.length,
      loadingStates: {
        totalDonations: loadingDonations,
        totalExpenses: loadingExpenses,
        donors: donorsLoading,
        topDonors: topDonorsLoading,
        expenses: expensesLoading,
        financialStats: financialStatsLoading
      }
    });
  }, [totalDonations, totalExpenses, budgetCategories, monthlyDonations, monthlyExpenses, recentDonors, topDonors, expenses, loadingDonations, loadingExpenses, donorsLoading, topDonorsLoading, expensesLoading, financialStatsLoading]);

  return {
    financialStats: {
      totalDonations,
      totalExpenses,
      monthlyDonations,
      monthlyExpenses,
      previousMonthDonations,
      previousMonthExpenses,
      budgetCategories: budgetCategories || [],
      campaigns: campaigns || [],
      isLoading: financialStatsLoading,
      // Add the refetch function directly in the returned object
      refetchFinancialStats
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
      refetchExpenses,
      refetchDonations
    }
  };
};
