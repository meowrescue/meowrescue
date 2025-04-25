
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CatExpenseGroup {
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

export const useCatExpenses = () => {
  return useQuery<CatExpenseGroup[]>({
    queryKey: ["catExpenses"],
    queryFn: async () => {
      // Query the expenses table with cat relationships
      const { data: expenses, error } = await supabase
        .from("expenses")
        .select(
          `
            id,
            amount,
            expense_date,
            description,
            category,
            cats:cat_id (
              id,
              name
            )
          `
        )
        .not("cat_id", "is", null)
        .order("expense_date", { ascending: false });

      if (error) throw error;

      const catGroups: Record<
        string,
        CatExpenseGroup
      > = {};

      expenses?.forEach((expense) => {
        if (!expense.cats || !expense.cats.id) return;
        const catId = expense.cats.id;
        const catName = expense.cats.name;
        if (!catGroups[catId]) {
          catGroups[catId] = {
            catId,
            catName,
            totalSpent: 0,
            expenses: [],
          };
        }
        const amount =
          typeof expense.amount === "string"
            ? parseFloat(expense.amount)
            : expense.amount;
        catGroups[catId].expenses.push({
          date: new Date(expense.expense_date).toLocaleDateString(),
          category: expense.category,
          amount,
          description: expense.description,
        });
        catGroups[catId].totalSpent += amount;
      });

      return Object.values(catGroups).sort(
        (a, b) => b.totalSpent - a.totalSpent
      );
    },
  });
};
