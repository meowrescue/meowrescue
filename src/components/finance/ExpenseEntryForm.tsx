import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp, Receipt } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { capitalizeWords } from "@/utils/stringUtils";
import { restrictToTwoDecimals } from '@/lib/utils';

interface ExpenseData {
  description: string;
  amount: string;
  category: string;
  vendor: string;
  paymentMethod: string;
  date: string;
  catId?: string;
  receiptFile?: File | null;
}

interface Category {
  id: string;
  name: string;
}

interface ExpenseEntryFormProps {
  expenseData: ExpenseData;
  isSubmitting: boolean;
  showAdvanced: boolean;
  setShowAdvanced: (show: boolean) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCheckboxChange?: (name: string, value: boolean) => void;
  handleFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  categories?: Category[];
  requireCategory?: boolean;
}

const ExpenseEntryForm: React.FC<ExpenseEntryFormProps> = ({
  expenseData,
  isSubmitting,
  showAdvanced,
  setShowAdvanced,
  handleChange,
  handleCheckboxChange,
  handleFileChange,
  handleSubmit,
  categories = [],
  requireCategory,
}) => {
  const isMobile = useIsMobile();

  const paymentMethods = [
    "Cash",
    "Credit Card",
    "Debit Card",
    "Check",
    "Bank Transfer",
    "PayPal",
    "Other",
  ];

  // Ensure dropdown only includes available categories
  const availableCategories = categories.map(cat => ({
    ...cat,
    name: cat.name,
  }));

  // Only allow two decimals on amount field
  const handleAmountBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.value = restrictToTwoDecimals(e.target.value);
    handleChange({
      ...e,
      target: { ...e.target, value: e.target.value }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Record Expense</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className={`space-y-4 ${isMobile ? "px-2" : ""}`}>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={expenseData.description}
              onChange={handleChange}
              placeholder="Brief description of expense"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              value={expenseData.amount}
              onChange={handleChange}
              onBlur={handleAmountBlur}
              placeholder="0.00"
              required
              inputMode="decimal"
              pattern="\d*(\.\d{0,2})?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              name="category"
              value={expenseData.category}
              onValueChange={(value) => {
                const event = {
                  target: { name: 'category', value }
                } as React.ChangeEvent<HTMLSelectElement>;
                handleChange(event);
              }}
              required={requireCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-white">
                {availableCategories.length > 0 ? (
                  availableCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-categories" disabled>
                    No budget categories
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor">Vendor/Supplier</Label>
            <Input
              id="vendor"
              name="vendor"
              value={expenseData.vendor}
              onChange={handleChange}
              placeholder="Name of vendor or supplier"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={expenseData.date}
              onChange={handleChange}
              required
            />
          </div>

          {showAdvanced && (
            <>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select
                  name="paymentMethod"
                  value={expenseData.paymentMethod}
                  onValueChange={(value) => {
                    const event = {
                      target: { name: 'paymentMethod', value }
                    } as React.ChangeEvent<HTMLSelectElement>;
                    handleChange(event);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="receiptFile" className="flex items-center gap-2">
                  <Receipt className="h-4 w-4" /> Receipt Image
                </Label>
                <Input
                  id="receiptFile"
                  name="receiptFile"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload a photo or scan of your receipt (optional)
                </p>
              </div>
            </>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full mt-2"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" /> Hide advanced options
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" /> Show advanced options
              </>
            )}
          </Button>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Record Expense"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ExpenseEntryForm;
