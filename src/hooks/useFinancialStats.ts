import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getDonationsSum,
  getExpensesSum,
  getPreviousMonthDonations,
  getPreviousMonthExpenses,
  getTotalBudget,
  getBudgetCategories,
  calculateCategorySpending,
  getTotalDonations,
  getCurrentCampaigns
} from '@/services/finance';
import { FundraisingCampaign } from '@/types/finance';

interface FinancialStats {
  totalIncome: number;
  totalExpenses: number;
  totalBudget: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  previousMonthIncome: number;
  previousMonthExpenses: number;
  budgetCategories: any[];
  campaigns: FundraisingCampaign[];
  isLoading: {
    monthlyIncome: boolean;
    monthlyExpenses: boolean;
    previousMonthIncome: boolean;
    previousMonthExpenses: boolean;
    totalBudget: boolean;
    budgetCategories: boolean;
    totalIncome: boolean;
    totalExpenses: boolean;
    campaigns: boolean;
  };
}

export const useFinancialStats = () => {
  const queryClient = useQueryClient();
  
  // Common query configuration for all financial stats with shorter staleTime for more frequent refreshes
  const commonConfig = {
    staleTime: 30 * 1000, // 30 seconds - refresh more frequently
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  };

  // Unified YTD queries
  const {
    data: ytdDonations = 0,
    isLoading: ytdDonationsLoading
  } = useQuery({
    queryKey: ['ytd-donations'],
    queryFn: () => getDonationsSum(),
    ...commonConfig
  });

  const {
    data: ytdExpenses = 0,
    isLoading: ytdExpensesLoading
  } = useQuery({
    queryKey: ['ytd-expenses'],
    queryFn: () => getExpensesSum(),
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
      queryClient.refetchQueries({ queryKey: ['ytd-donations'] }),
      queryClient.refetchQueries({ queryKey: ['ytd-expenses'] }),
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
    monthlyDonations: Number(ytdDonations),
    monthlyExpenses: Number(ytdExpenses),
    totalBudget: Number(totalBudget),
    budgetCategoriesCount: budgetCategories?.length,
    baseBudgetCategoriesCount: baseBudgetCategories?.length,
    totalDonations: Number(totalDonations),
    campaignsCount: campaigns?.length
  });

  return {
    financialStats: {
      totalIncome: ytdDonations,
      totalExpenses: ytdExpenses,
      totalBudget: totalBudget,
      monthlyIncome: ytdDonations,
      monthlyExpenses: ytdExpenses,
      previousMonthIncome: previousMonthDonations,
      previousMonthExpenses: previousMonthExpenses,
      budgetCategories: budgetCategories || [],
      campaigns: campaigns || [],
      isLoading: {
        monthlyIncome: ytdDonationsLoading,
        monthlyExpenses: ytdExpensesLoading,
        previousMonthIncome: previousMonthDonationsLoading,
        previousMonthExpenses: previousMonthExpensesLoading,
        totalBudget: totalBudgetLoading,
        budgetCategories: budgetCategoriesLoading || baseBudgetCategoriesLoading,
        totalIncome: ytdDonationsLoading,
        totalExpenses: ytdExpensesLoading,
        campaigns: campaignsLoading
      }
    } as FinancialStats
  };
};
