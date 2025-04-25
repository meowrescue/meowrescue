
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Receipt } from "lucide-react";
import { ExpenseDetail } from "@/hooks/finance/useExpenses";
import { formatCurrency } from "@/lib/utils";

interface ExpenseDetailsDialogProps {
  expense: ExpenseDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewReceipt: () => void;
}

export const ExpenseDetailsDialog: React.FC<ExpenseDetailsDialogProps> = ({
  expense,
  open,
  onOpenChange,
  onViewReceipt,
}) => {
  if (!expense) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Expense Details</DialogTitle>
          <DialogDescription>View detailed information about this expense</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 pt-4">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium">Amount:</span>
            <span className="text-lg font-bold text-meow-primary">{formatCurrency(expense.amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Date:</span>
            <span>{expense.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Category:</span>
            <span>{expense.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Vendor:</span>
            <span>{expense.vendor}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Payment Method:</span>
            <span>{expense.payment_method}</span>
          </div>
          {expense.cat_name && (
            <div className="flex justify-between">
              <span className="font-medium">Cat:</span>
              <span>{expense.cat_name}</span>
            </div>
          )}
          <div className="pt-2">
            <span className="font-medium block">Description:</span>
            <p className="mt-1 text-gray-600 bg-gray-50 p-2 rounded">{expense.description}</p>
          </div>
          {expense.receipt_url && (
            <div className="pt-2 flex justify-center">
              <button
                className="flex items-center space-x-2 px-3 py-2 bg-meow-primary text-white rounded-md hover:bg-meow-primary/80 transition-colors"
                onClick={onViewReceipt}
              >
                <Receipt className="h-4 w-4" />
                <span>View Receipt</span>
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
