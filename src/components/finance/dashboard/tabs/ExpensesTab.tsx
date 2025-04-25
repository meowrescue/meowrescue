
import React from 'react';
import ExpenseEntry from "@/components/finance/ExpenseEntry";
import ExpensesTable from "@/components/finance/ExpensesTable";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getBudgetCategories } from '@/services/finance';

interface Props {
  expenses: any[];
  expensesLoading: boolean;
  catExpenses: any[];
  catExpensesLoading: boolean;
}

const ExpensesTab: React.FC<Props> = ({ expenses, expensesLoading, catExpenses, catExpensesLoading }) => {
  const { data: budgetCategories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['budget-categories-base'],
    queryFn: getBudgetCategories
  });

  const categories = budgetCategories ? budgetCategories.map(cat => ({
    id: cat.id,
    name: cat.name
  })) : [];

  return (
    <div>
      <Alert variant="default" className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Expense Management</AlertTitle>
        <AlertDescription>
          Record and track organization expenses. Add receipt images by uploading them in the expense form.
          All expenses will be visible on the financial transparency page.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div>
          <ExpenseEntry 
            onSuccess={() => console.log('Expense added successfully')} 
            categories={categories}
          />
        </div>
        <div className="lg:col-span-2">
          <ExpensesTable expenses={expenses} expensesLoading={expensesLoading} />
        </div>
      </div>
    </div>
  );
};

export default ExpensesTab;
