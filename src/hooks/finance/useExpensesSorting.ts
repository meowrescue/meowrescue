
import { useState } from "react";
import { ExpenseDetail } from "./useExpenses";

export type SortDir = "asc" | "desc";
export type SortCol = "date" | "category" | "amount" | null;

interface UseExpensesSortingOptions {
  initialSortCol?: SortCol;
  initialSortDir?: SortDir;
}

interface UseExpensesSortingReturn {
  sortCol: SortCol;
  sortDir: SortDir;
  sortedExpenses: ExpenseDetail[];
  handleSort: (col: SortCol) => void;
  resetSort: () => void;
}

export const useExpensesSorting = (
  expenses: ExpenseDetail[] = [], 
  options: UseExpensesSortingOptions = {}
): UseExpensesSortingReturn => {
  const [sortCol, setSortCol] = useState<SortCol>(options.initialSortCol || null);
  const [sortDir, setSortDir] = useState<SortDir>(options.initialSortDir || "desc");

  const handleSort = (col: SortCol) => {
    if (sortCol === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir(col === "amount" ? "desc" : "asc");
    }
  };

  const resetSort = () => {
    setSortCol(options.initialSortCol || null);
    setSortDir(options.initialSortDir || "desc");
  };

  const sortedExpenses = [...expenses];
  if (sortCol && sortedExpenses.length > 0) {
    sortedExpenses.sort((a, b) => {
      if (sortCol === "amount") {
        if (sortDir === "asc") return (a.amount||0) - (b.amount||0);
        return (b.amount||0) - (a.amount||0);
      }
      if (sortCol === "category") {
        const ca = (a.category || "").toLowerCase(), cb = (b.category || "").toLowerCase();
        if (ca < cb) return sortDir === "asc" ? -1 : 1;
        if (ca > cb) return sortDir === "asc" ? 1 : -1;
        return 0;
      }
      if (sortCol === "date") {
        if (!a.date) return 1;
        if (!b.date) return -1;
        if (a.date < b.date) return sortDir === "asc" ? -1 : 1;
        if (a.date > b.date) return sortDir === "asc" ? 1 : -1;
        return 0;
      }
      return 0;
    });
  }

  return {
    sortCol,
    sortDir,
    sortedExpenses,
    handleSort,
    resetSort
  };
};
