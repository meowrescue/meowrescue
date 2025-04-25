
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface CatExpense {
  catId: string;
  catName: string;
  totalSpent: number;
  expenses: {
    date: string;
    category: string;
    amount: number;
    description: string;
  }[];
}

interface CatExpensesProps {
  catExpenses: CatExpense[] | undefined;
  catExpensesLoading: boolean;
}

const CatExpenses: React.FC<CatExpensesProps> = ({
  catExpenses,
  catExpensesLoading,
}) => (
  <Card className="shadow-md">
    <CardHeader className="pb-2 border-b">
      <CardTitle className="text-xl text-meow-primary">Cat Care Expenses</CardTitle>
    </CardHeader>
    <CardContent className="pt-6">
      {catExpensesLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-md"></div>
          ))}
        </div>
      ) : catExpenses?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {catExpenses.slice(0, 6).map((cat) => (
            <Card key={cat.catId} className="border border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between text-base font-bold">
                  <span>{cat.catName}</span>
                  <span className="text-meow-primary">
                    {formatCurrency(cat.totalSpent)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {cat.expenses.slice(0, 5).map((expense, index) => (
                    <div key={index} className="flex justify-between text-sm border-b border-gray-100 pb-1">
                      <div>
                        <span className="font-medium">{expense.category}</span>
                        {expense.description && (
                          <span className="text-gray-500 ml-2 text-xs">
                            - {expense.description}
                          </span>
                        )}
                      </div>
                      <div className="text-gray-600">
                        {formatCurrency(expense.amount)}
                      </div>
                    </div>
                  ))}
                  {cat.expenses.length > 5 && (
                    <div className="text-center text-sm text-gray-500 italic pt-1">
                      + {cat.expenses.length - 5} more expenses
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
          <p>No cat-specific expenses found.</p>
          <p className="text-sm mt-2">Expenses will appear here when they are assigned to specific cats.</p>
        </div>
      )}
    </CardContent>
  </Card>
);

export default CatExpenses;
