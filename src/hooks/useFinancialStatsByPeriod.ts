import { useQuery } from '@tanstack/react-query';
import { getDonationsSum } from '@/services/finance/donations';
import { getExpensesSum } from '@/services/finance/expenses';

export type PeriodType = 'month' | 'year' | 'all' | 'custom';

interface CustomRange {
  startDate: Date;
  endDate: Date;
}

function getDateRange(period: PeriodType, customRange?: CustomRange) {
  const now = new Date();
  switch (period) {
    case 'month':
      return {
        startDate: new Date(now.getFullYear(), now.getMonth(), 1),
        endDate: now
      };
    case 'year':
      return {
        startDate: new Date(now.getFullYear(), 0, 1),
        endDate: now
      };
    case 'all':
      // Use a very early date for all-time
      return {
        startDate: new Date(2000, 0, 1),
        endDate: now
      };
    case 'custom':
      if (customRange && customRange.startDate && customRange.endDate) {
        return customRange;
      }
      throw new Error('Custom range requires startDate and endDate');
    default:
      throw new Error('Invalid period type');
  }
}

export function useFinancialStatsByPeriod(period: PeriodType, customRange?: CustomRange) {
  const { startDate, endDate } = getDateRange(period, customRange);

  const {
    data: donations = 0,
    isLoading: donationsLoading
  } = useQuery({
    queryKey: ['donations-sum', period, startDate.toISOString(), endDate.toISOString()],
    queryFn: () => getDonationsSum({ startDate, endDate }),
    staleTime: 30 * 1000,
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  const {
    data: expenses = 0,
    isLoading: expensesLoading
  } = useQuery({
    queryKey: ['expenses-sum', period, startDate.toISOString(), endDate.toISOString()],
    queryFn: () => getExpensesSum({ startDate, endDate }),
    staleTime: 30 * 1000,
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  return {
    donations,
    expenses,
    isLoading: {
      donations: donationsLoading,
      expenses: expensesLoading
    },
    period,
    startDate,
    endDate
  };
}
