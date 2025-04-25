
import React from "react";
import { Eye, Receipt } from "lucide-react";
import { ExpenseDetail } from "@/hooks/finance/useExpenses";

interface ExpenseActionsProps {
  expense: ExpenseDetail;
  onViewDetails: (expense: ExpenseDetail) => void;
  onViewReceipt: (expense: ExpenseDetail) => void;
}

export const ExpenseActions: React.FC<ExpenseActionsProps> = ({
  expense,
  onViewDetails,
  onViewReceipt,
}) => (
  <div className="flex justify-center items-center gap-2 min-w-[56px] h-6">
    <button
      className="p-1 hover:text-meow-primary cursor-pointer"
      title="View Details"
      tabIndex={-1}
      aria-hidden="true"
      onClick={() => onViewDetails(expense)}
    >
      <Eye className="h-4 w-4" />
    </button>
    {expense.receipt_url && (
      <button
        className="p-1 hover:text-meow-primary"
        onClick={(e) => {
          e.stopPropagation();
          onViewReceipt(expense);
        }}
        title="View Receipt"
      >
        <Receipt className="h-4 w-4" />
      </button>
    )}
    {!expense.receipt_url && <div className="w-5 h-4" />}
  </div>
);

