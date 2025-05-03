
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import getSupabaseClient from '@/integrations/supabase/client';

export interface FinancialStats {
  totalDonations: number;
  totalExpenses: number;
  monthlyDonations: number;
  monthlyExpenses: number;
  previousMonthDonations: number;
  previousMonthExpenses: number;
  recentDonations: {
    id: string;
    amount: number;
    donation_date: string;
    donor_name?: string;
  }[];
}

export const useFinancialDashboard = () => {
  const [financialStats, setFinancialStats] = useState<FinancialStats>({
    totalDonations: 0,
    totalExpenses: 0,
    monthlyDonations: 0,
    monthlyExpenses: 0,
    previousMonthDonations: 0,
    previousMonthExpenses: 0,
    recentDonations: [],
  });

  const [isLoading, setIsLoading] = useState({
    totalDonations: true,
    totalExpenses: true,
    monthlyDonations: true,
    monthlyExpenses: true,
    recentDonations: true,
  });

  // Function to fetch financial data
  const fetchFinancialStats = async () => {
    const supabase = getSupabaseClient();
    
    // Fetch total donations
    const { data: totalDonationsData } = await supabase
      .from('donations')
      .select('amount')
      .eq('status', 'completed');
    
    // Fetch total expenses
    const { data: totalExpensesData } = await supabase
      .from('expenses')
      .select('amount');
    
    // Get the current date
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
    
    // For previous month
    const firstDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const lastDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();
    
    // Fetch monthly donations
    const { data: monthlyDonationsData } = await supabase
      .from('donations')
      .select('amount')
      .eq('status', 'completed')
      .gte('donation_date', firstDayOfMonth)
      .lte('donation_date', lastDayOfMonth);
    
    // Fetch previous month donations
    const { data: prevMonthDonationsData } = await supabase
      .from('donations')
      .select('amount')
      .eq('status', 'completed')
      .gte('donation_date', firstDayOfPrevMonth)
      .lte('donation_date', lastDayOfPrevMonth);
    
    // Fetch monthly expenses
    const { data: monthlyExpensesData } = await supabase
      .from('expenses')
      .select('amount')
      .gte('expense_date', firstDayOfMonth)
      .lte('expense_date', lastDayOfMonth);
    
    // Fetch previous month expenses
    const { data: prevMonthExpensesData } = await supabase
      .from('expenses')
      .select('amount')
      .gte('expense_date', firstDayOfPrevMonth)
      .lte('expense_date', lastDayOfPrevMonth);
    
    // Calculate total donations
    const totalDonations = totalDonationsData?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
    
    // Calculate total expenses
    const totalExpenses = totalExpensesData?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
    
    // Calculate monthly donations
    const monthlyDonations = monthlyDonationsData?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
    
    // Calculate previous month donations
    const previousMonthDonations = prevMonthDonationsData?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
    
    // Calculate monthly expenses
    const monthlyExpenses = monthlyExpensesData?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
    
    // Calculate previous month expenses
    const previousMonthExpenses = prevMonthExpensesData?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
    
    // Fetch recent donations
    const { data: recentDonations } = await supabase
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
      .eq('status', 'completed')
      .order('donation_date', { ascending: false })
      .limit(5);
    
    const formattedRecentDonations = recentDonations?.map(donation => ({
      id: donation.id,
      amount: donation.amount,
      donation_date: donation.donation_date,
      donor_name: donation.profiles ? 
        `${donation.profiles.first_name || ''} ${donation.profiles.last_name || ''}`.trim() || 'Anonymous' : 
        'Anonymous'
    })) || [];
    
    return {
      totalDonations,
      totalExpenses,
      monthlyDonations,
      monthlyExpenses,
      previousMonthDonations,
      previousMonthExpenses,
      recentDonations: formattedRecentDonations
    };
  };

  // Using react-query to fetch and cache financial data
  const { data, isLoading: queryLoading, refetch } = useQuery({
    queryKey: ['financial-dashboard-stats'],
    queryFn: fetchFinancialStats
  });
  
  useEffect(() => {
    if (data) {
      setFinancialStats(data);
      setIsLoading({
        totalDonations: false,
        totalExpenses: false,
        monthlyDonations: false,
        monthlyExpenses: false,
        recentDonations: false,
      });
    }
  }, [data]);

  return { 
    monthlyDonations: financialStats.monthlyDonations,
    monthlyExpenses: financialStats.monthlyExpenses,
    previousMonthDonations: financialStats.previousMonthDonations,
    previousMonthExpenses: financialStats.previousMonthExpenses,
    financialStats, 
    isLoading,
    refetchFinancialStats: refetch 
  };
};

export default useFinancialDashboard;
