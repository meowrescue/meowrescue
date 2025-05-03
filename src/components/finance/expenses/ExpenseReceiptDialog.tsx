import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Receipt, Download, ExternalLink } from "lucide-react";
import { ExpenseDetail } from "@/hooks/finance/useExpenses";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

  const handleOpenInNewTab = () => {
    if (expense.receipt_url) {
      window.open(expense.receipt_url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownload = () => {
    if (expense.receipt_url) {
      const link = document.createElement('a');
      link.href = expense.receipt_url;
      link.download = `receipt-${expense.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

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
            <div className="flex flex-col h-full">
              <div className="flex justify-end space-x-2 mb-2">
                <Button variant="outline" size="sm" onClick={handleOpenInNewTab}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              <div className="bg-gray-100 rounded-md p-4 flex-grow flex items-center justify-center">
                <a 
                  href={expense.receipt_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-meow-primary hover:underline flex items-center"
                >
                  <Receipt className="h-6 w-6 mr-2" />
                  View Receipt
                </a>
              </div>
            </div>
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
