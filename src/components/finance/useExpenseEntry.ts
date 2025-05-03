
import { useState } from "react";
import { toast } from "sonner";
import getSupabaseClient from '@/integrations/getSupabaseClient()/client';
import { format } from "date-fns";
import { capitalizeWords } from "@/utils/stringUtils";

interface ExpenseEntryProps {
  onSuccess?: () => void;
}

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

export const useExpenseEntry = ({ onSuccess }: ExpenseEntryProps = {}) => {
  const today = format(new Date(), "yyyy-MM-dd");

  const [expenseData, setExpenseData] = useState<ExpenseData>({
    description: "",
    amount: "",
    category: "",
    vendor: "",
    paymentMethod: "Credit Card",
    date: today,
    receiptFile: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setExpenseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, value: boolean) => {
    setExpenseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setExpenseData((prev) => ({
        ...prev,
        receiptFile: e.target.files?.[0] || null,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Apply capitalization to description before submitting
      const capitalizedDescription = capitalizeWords(expenseData.description);
      const { amount, category, vendor } = expenseData;
      
      // Validation: must assign category (required)
      if (!category) {
        toast.error("Please assign this expense to a budget category.");
        setIsSubmitting(false);
        return;
      }
      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        toast.error("Please enter a valid, non-zero amount.");
        setIsSubmitting(false);
        return;
      }
      if (!capitalizedDescription || !vendor) {
        toast.error("Please fill out all required fields.");
        setIsSubmitting(false);
        return;
      }

      // First, create the expense record
      const { data: expense, error: expenseError } = await getSupabaseClient()
        .from("expenses")
        .insert({
          description: capitalizedDescription,
          amount: parseFloat(amount),
          category,
          vendor,
          payment_method: expenseData.paymentMethod,
          expense_date: expenseData.date,
          cat_id: expenseData.catId || null,
        })
        .select()
        .single();

      if (expenseError) throw expenseError;

      // Upload receipt if attached
      if (expenseData.receiptFile && expense) {
        const fileExt = expenseData.receiptFile.name.split(".").pop();
        const fileName = `${expense.id}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await getSupabaseClient().storage
          .from("expense-receipts")
          .upload(filePath, expenseData.receiptFile);

        if (uploadError) throw uploadError;

        const { data: publicURLData } = getSupabaseClient().storage
          .from("expense-receipts")
          .getPublicUrl(filePath);

        // Update the expense record with the receipt URL
        const { error: updateError } = await getSupabaseClient()
          .from("expenses")
          .update({ receipt_url: publicURLData.publicUrl })
          .eq("id", expense.id);

        if (updateError) throw updateError;
      }

      toast.success("Expense recorded successfully");

      setExpenseData({
        description: "",
        amount: "",
        category: "",
        vendor: "",
        paymentMethod: "Credit Card",
        date: today,
        receiptFile: null,
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error recording expense:", error);
      toast.error("Problem recording expense. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    expenseData,
    isSubmitting,
    showAdvanced,
    setShowAdvanced,
    handleChange,
    handleCheckboxChange,
    handleFileChange,
    handleSubmit,
  };
};
