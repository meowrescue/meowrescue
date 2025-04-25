
import { useState, useMemo } from 'react';
import { ExpenseDetail } from '@/hooks/finance/useExpenses';

export interface ExpensesFilteringResult {
  category: string;
  setCategory: (category: string) => void;
  categories: string[];
  filtered: ExpenseDetail[];
  resetFilter: () => void;
}

export const useExpensesFiltering = (expenses: ExpenseDetail[] | undefined): ExpensesFilteringResult => {
  // Initialize filter state
  const [category, setCategory] = useState("");

  // Extract unique categories from expenses
  const categories = useMemo(() =>
    expenses ? Array.from(new Set(expenses.map(e => e.category).filter(Boolean))).sort() : [],
    [expenses]
  );

  // Apply category filter to expenses
  const filtered = useMemo(() => {
    if (!expenses) return [];
    return category 
      ? expenses.filter(exp => exp.category === category)
      : expenses;
  }, [category, expenses]);

  const resetFilter = () => setCategory("");

  return {
    category,
    setCategory,
    categories,
    filtered,
    resetFilter
  };
};
