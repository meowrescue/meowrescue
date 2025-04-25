import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExpenseDetail } from "@/hooks/finance/useExpenses";
import { formatCurrency } from "@/lib/utils";
import { ExpenseCategoryFilter } from "./expenses/ExpenseCategoryFilter";
import { ExpenseActions } from "./expenses/ExpenseActions";
import { ExpenseDetailsDialog } from "./expenses/ExpenseDetailsDialog";
import { ExpenseReceiptDialog } from "./expenses/ExpenseReceiptDialog";
import { useExpensesSorting } from "@/hooks/finance/useExpensesSorting";
import { useExpensesFiltering } from "@/hooks/finance/useExpensesFiltering";

interface ExpensesTableProps {
  expenses: ExpenseDetail[] | undefined;
  expensesLoading: boolean;
}

const sortIcon = (active: boolean, dir: "asc" | "desc" | null, isDefaultSort: boolean) => {
  if (!active || isDefaultSort) return null;
  return dir === "asc" 
    ? <span className="inline-block align-middle ml-1 text-meow-primary">&#9650;</span> 
    : <span className="inline-block align-middle ml-1 text-meow-primary">&#9660;</span>;
}

const ExpensesTable: React.FC<ExpensesTableProps> = ({ expenses, expensesLoading }) => {
  const [selectedExpense, setSelectedExpense] = useState<ExpenseDetail | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const {
    category,
    setCategory,
    categories,
    filtered,
    resetFilter
  } = useExpensesFiltering(expenses);

  // Initialize sorting to show newest first
  const {
    sortCol,
    sortDir,
    sortedExpenses,
    handleSort,
    resetSort
  } = useExpensesSorting(filtered, { initialSortCol: 'date', initialSortDir: 'desc' });

  const resetSortAndFilters = () => {
    resetFilter();
    resetSort();
  };

  const handleViewDetails = (expense: ExpenseDetail) => {
    setSelectedExpense(expense);
    setShowReceipt(false);
  };

  const handleViewReceipt = (expense: ExpenseDetail) => {
    setSelectedExpense(expense);
    setShowReceipt(true);
  };

  // Helper to check if current sort is different from default
  const isDefaultSort = (col: string) => {
    return col === 'date' && sortDir === 'desc' && sortCol === 'date';
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2 border-b flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-xl text-meow-primary">Expense Records</CardTitle>
        <div className="flex items-center gap-4">
          <ExpenseCategoryFilter 
            categories={categories} 
            value={category} 
            onChange={setCategory} 
          />
          <button
            onClick={resetSortAndFilters}
            className="text-meow-secondary border border-meow-secondary rounded px-3 py-2 h-10 hover:bg-meow-secondary/10 transition text-sm font-medium"
            aria-label="Clear filters"
          >
            Clear Filters
          </button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {expensesLoading ? (
          <div className="h-52 bg-gray-200 animate-pulse rounded-md"></div>
        ) : sortedExpenses.length ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer select-none"
                    onClick={() => handleSort("date")}
                  >
                    Date
                    {sortIcon(sortCol === "date", sortCol === "date" ? sortDir : null, isDefaultSort("date"))}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none"
                    onClick={() => handleSort("category")}
                  >
                    Category
                    {sortIcon(sortCol === "category", sortCol === "category" ? sortDir : null, isDefaultSort("category"))}
                  </TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead 
                    className="text-right cursor-pointer select-none"
                    onClick={() => handleSort("amount")}
                  >
                    Amount
                    {sortIcon(sortCol === "amount", sortCol === "amount" ? sortDir : null, isDefaultSort("amount"))}
                  </TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedExpenses.map((expense) => (
                  <TableRow
                    key={expense.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    tabIndex={0}
                    onClick={() => handleViewDetails(expense)}
                    onKeyDown={e => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleViewDetails(expense);
                      }
                    }}
                    aria-label={`View details for expense: ${expense.description}`}
                  >
                    <TableCell className="font-medium">{expense.date}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell className="max-w-xs truncate">{expense.description}</TableCell>
                    <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
                    <TableCell className="text-center">
                      <ExpenseActions
                        expense={expense}
                        onViewDetails={handleViewDetails}
                        onViewReceipt={handleViewReceipt}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
            <p>No expense records found.</p>
            <p className="text-sm mt-2">Expenses will appear here once they are recorded in the system.</p>
          </div>
        )}
      </CardContent>

      <ExpenseDetailsDialog
        expense={selectedExpense}
        open={!!selectedExpense && !showReceipt}
        onOpenChange={(open) => {
          if (!open) setSelectedExpense(null);
        }}
        onViewReceipt={() => setShowReceipt(true)}
      />

      <ExpenseReceiptDialog
        expense={selectedExpense}
        open={!!selectedExpense && showReceipt}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedExpense(null);
            setShowReceipt(false);
          }
        }}
      />
    </Card>
  );
};

export default ExpensesTable;
