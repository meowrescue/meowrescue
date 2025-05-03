
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Receipt } from "lucide-react";
import { ExpenseDetail } from "@/hooks/finance/useExpenses";
import { formatCurrency } from "@/lib/utils";

interface ExpenseReceiptDialogProps {
  expense: ExpenseDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExpenseReceiptDialog: React.FC<ExpenseReceiptDialogProps> = ({
  expense,
  open,
  onOpenChange,
}) => {
  if (!expense) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Receipt</DialogTitle>
          <DialogDescription>
            {expense.vendor} - {expense.date} - {formatCurrency(expense.amount)}
          </DialogDescription>
        </DialogHeader>
        <div className="h-full overflow-auto pt-4">
          {expense.receipt_url ? (
            <iframe
              src={expense.receipt_url}
              className="w-full h-[60vh] border border-gray-200 rounded-md"
              title="Receipt"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Receipt className="h-12 w-12 mb-4" />
              <p>No receipt available for this expense.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
