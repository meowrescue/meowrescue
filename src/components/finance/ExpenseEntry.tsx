
import React from "react";
import { useExpenseEntry } from "./useExpenseEntry";
import ExpenseEntryForm from "./ExpenseEntryForm";
import { useQuery } from "@tanstack/react-query";
import { getBudgetCategories, calculateCategorySpending } from "@/services/finance/categories";

interface Category {
  id: string;
  name: string;
}
interface ExpenseEntryProps {
  onSuccess?: () => void;
  categories?: Category[];
}

const ExpenseEntry: React.FC<ExpenseEntryProps> = ({
  onSuccess,
  categories = [],
}) => {
  const {
    expenseData,
    isSubmitting,
    showAdvanced,
    setShowAdvanced,
    handleChange,
    handleCheckboxChange,
    handleFileChange,
    handleSubmit,
  } = useExpenseEntry({ onSuccess });

  // Fetch budget categories from the database
  const { data: baseBudgetCategories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['budget-categories-base'],
    queryFn: getBudgetCategories
  });

  // Use budget categories from props if available, otherwise use fetched categories
  const availableCategories = categories.length > 0 
    ? categories 
    : (baseBudgetCategories || []).map(cat => ({
        id: cat.id,
        name: cat.name
      }));

  const handleCustomSubmit = async (e: React.FormEvent) => {
    await handleSubmit(e);
    if (onSuccess) onSuccess();
  };

  return (
    <ExpenseEntryForm
      expenseData={expenseData}
      isSubmitting={isSubmitting}
      showAdvanced={showAdvanced}
      setShowAdvanced={setShowAdvanced}
      handleChange={handleChange}
      handleCheckboxChange={handleCheckboxChange}
      handleFileChange={handleFileChange}
      handleSubmit={handleCustomSubmit}
      categories={availableCategories}
      requireCategory // instruct form to enforce choosing one
    />
  );
};

export default ExpenseEntry;
