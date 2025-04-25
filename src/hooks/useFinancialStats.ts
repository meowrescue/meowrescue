
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMonthlyDonations,
  getMonthlyExpenses,
  getPreviousMonthDonations,
  getPreviousMonthExpenses,
  getTotalBudget,
  getBudgetCategories,
  calculateCategorySpending,
  getTotalDonations,
  getCurrentCampaigns
} from '@/services/finance';
import { FundraisingCampaign } from '@/types/finance';

export const useFinancialStats = () => {
  const queryClient = useQueryClient();
  
  // Common query configuration for all financial stats with shorter staleTime for more frequent refreshes
  const commonConfig = {
    staleTime: 30 * 1000, // 30 seconds - refresh more frequently
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  };

  const { 
    data: monthlyDonations = 0, 
    isLoading: monthlyDonationsLoading 
  } = useQuery({
    queryKey: ['monthly-donations'],
    queryFn: getMonthlyDonations,
    ...commonConfig
  });

  const { 
    data: monthlyExpenses = 0, 
    isLoading: monthlyExpensesLoading 
  } = useQuery({
    queryKey: ['monthly-expenses'],
    queryFn: getMonthlyExpenses,
    ...commonConfig
  });

  const { 
    data: previousMonthDonations = 0, 
    isLoading: previousMonthDonationsLoading 
  } = useQuery({
    queryKey: ['prev-monthly-donations'],
    queryFn: getPreviousMonthDonations,
    ...commonConfig
  });

  const { 
    data: previousMonthExpenses = 0, 
    isLoading: previousMonthExpensesLoading 
  } = useQuery({
    queryKey: ['prev-monthly-expenses'],
    queryFn: getPreviousMonthExpenses,
    ...commonConfig
  });

  const { 
    data: totalBudget = 0, 
    isLoading: totalBudgetLoading 
  } = useQuery({
    queryKey: ['total-budget'],
    queryFn: getTotalBudget,
    ...commonConfig
  });

  const { 
    data: baseBudgetCategories = [], 
    isLoading: baseBudgetCategoriesLoading 
  } = useQuery({
    queryKey: ['budget-categories-base'],
    queryFn: getBudgetCategories,
    ...commonConfig,
    meta: {
      onError: (err: Error) => {
        console.error("Error fetching budget categories base:", err);
      }
    }
  });

  // Only calculate spending if we have base categories
  const shouldCalculateSpending = Array.isArray(baseBudgetCategories) && baseBudgetCategories.length > 0;

  const { 
    data: budgetCategories = [], 
    isLoading: budgetCategoriesLoading 
  } = useQuery({
    queryKey: ['budget-categories', baseBudgetCategories],
    queryFn: () => calculateCategorySpending(baseBudgetCategories || []),
    enabled: shouldCalculateSpending,
    ...commonConfig,
    meta: {
      onError: (err: Error) => {
        console.error("Error calculating categories spending:", err);
      }
    }
  });

  const { 
    data: totalDonations = 0, 
    isLoading: totalDonationsLoading 
  } = useQuery({
    queryKey: ['total-donations'],
    queryFn: getTotalDonations,
    ...commonConfig
  });

  const { 
    data: campaigns = [], 
    isLoading: campaignsLoading 
  } = useQuery<FundraisingCampaign[]>({
    queryKey: ['current-campaigns'],
    queryFn: getCurrentCampaigns,
    ...commonConfig
  });

  // Function to refetch all financial stats
  const refetchFinancialStats = async () => {
    console.log("Refetching all financial stats...");
    await Promise.all([
      queryClient.refetchQueries({ queryKey: ['monthly-donations'] }),
      queryClient.refetchQueries({ queryKey: ['monthly-expenses'] }),
      queryClient.refetchQueries({ queryKey: ['prev-monthly-donations'] }),
      queryClient.refetchQueries({ queryKey: ['prev-monthly-expenses'] }),
      queryClient.refetchQueries({ queryKey: ['total-budget'] }),
      queryClient.refetchQueries({ queryKey: ['budget-categories-base'] }),
      queryClient.refetchQueries({ queryKey: ['total-donations'] }),
      queryClient.refetchQueries({ queryKey: ['current-campaigns'] })
    ]);
    console.log("All financial stats refetched");
  };

  // Log the values for debugging
  console.log({
    monthlyDonations: Number(monthlyDonations),
    monthlyExpenses: Number(monthlyExpenses),
    totalBudget: Number(totalBudget),
    budgetCategoriesCount: budgetCategories?.length,
    baseBudgetCategoriesCount: baseBudgetCategories?.length,
    totalDonations: Number(totalDonations),
    campaignsCount: campaigns?.length
  });

  return {
    monthlyDonations: Number(monthlyDonations),
    monthlyExpenses: Number(monthlyExpenses),
    previousMonthDonations: Number(previousMonthDonations),
    previousMonthExpenses: Number(previousMonthExpenses),
    totalBudget: Number(totalBudget),
    budgetCategories,
    totalDonations: Number(totalDonations),
    campaigns,
    refetchFinancialStats,
    isLoading: {
      monthlyDonations: monthlyDonationsLoading,
      monthlyExpenses: monthlyExpensesLoading,
      previousMonthDonations: previousMonthDonationsLoading,
      previousMonthExpenses: previousMonthExpensesLoading,
      totalBudget: totalBudgetLoading,
      budgetCategories: budgetCategoriesLoading || baseBudgetCategoriesLoading,
      totalDonations: totalDonationsLoading,
      campaigns: campaignsLoading
    }
  };
};
