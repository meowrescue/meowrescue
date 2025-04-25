
import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Progress } from "@/components/ui/progress";

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );
}

const BudgetCategories = ({
  budgetCategories,
  budgetLoading,
}: {
  budgetCategories: any[];
  budgetLoading: boolean;
}) => {
  const isMobile = useIsMobile();
  
  useEffect(() => {
    console.log('Budget Categories component received:', budgetCategories);
  }, [budgetCategories]);

  // Ensure categories are objects with name and other required properties
  const validCategories = Array.isArray(budgetCategories) 
    ? budgetCategories.filter(cat => cat && typeof cat === 'object' && cat.name)
    : [];
  
  const sorted = [...validCategories]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((cat) => ({
      ...cat,
      name: toTitleCase(cat.name),
      // Ensure these fields exist with correct types
      spent: cat.spent || cat.amountSpent || 0,
      amountSpent: cat.spent || cat.amountSpent || 0,
      budgetAmount: cat.amount || cat.budgetAmount || 0,
      percentUsed: cat.percentUsed || 0
    }));

  return (
    <div className="max-w-5xl mx-auto w-full">
      <Card className="w-full bg-[#f7fafd] border border-[#e7f0f7] shadow-sm rounded-2xl p-0">
        <div className="border-b border-[#dde6ef] bg-[#f1f6fb] rounded-t-2xl px-4 sm:px-6 py-3">
          <span className="text-xl font-semibold text-[#004080] font-serif">
            Budget vs. Actual Spending
          </span>
        </div>
        <div className="py-2 px-1 sm:px-6">
          {budgetLoading ? (
            <div className="space-y-4 py-6">{
              [...Array(5)].map((_, i) =>
                <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-xl"></div>
              )}
            </div>
          ) : sorted.length === 0 ? (
            <div className="p-6 text-center rounded-xl bg-white text-gray-500">
              No budget categories found.
            </div>
          ) : (
            <div className="flex flex-col gap-4 py-4">
              {sorted.map((cat) => (
                <div
                  key={cat.id || cat.name}
                  className="bg-white rounded-xl px-3 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between shadow-sm"
                  style={{ border: "none" }}
                >
                  {/* Name */}
                  <div className="font-semibold text-base md:text-lg text-[#193f6d] mb-2 md:mb-0 md:w-1/3">
                    {cat.name}
                  </div>
                  
                  {/* Progress bar and numbers */}
                  <div className="flex-1 flex flex-col gap-2 justify-center">
                    <Progress
                      value={Math.min(cat.percentUsed || 0, 100)}
                      max={100}
                      barColor="#004080"
                      trackColor="#e6eff7"
                      className="h-3 rounded-full bg-[#e6eff7] w-full"
                    />
                  </div>
                  
                  {/* Amounts and percent */}
                  <div className="flex flex-col items-end md:pl-6 mt-2 md:mt-0 min-w-[110px]">
                    <span className="text-gray-700 font-semibold text-right text-sm">
                      {formatCurrency(cat.amountSpent || 0)} <span className="text-gray-400 font-normal">of</span> {formatCurrency(cat.budgetAmount || 0)}
                    </span>
                    <span className="text-[#fff] bg-[#004080] rounded-lg px-3 py-1 mt-1 text-sm font-bold shadow-sm"
                      style={{
                        minWidth: 42,
                        textAlign: "center",
                      }}
                    >
                      {typeof cat.percentUsed === "number"
                        ? `${Math.min(Math.round(cat.percentUsed * 10) / 10, 100)}%`
                        : "0%"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default BudgetCategories;
