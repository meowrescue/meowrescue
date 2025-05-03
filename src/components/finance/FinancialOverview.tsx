import React from "react";
import DonationSummary from "@/components/finance/DonationSummary";
import OverallFundraisingGoal from "@/components/finance/OverallFundraisingGoal";
import { calculatePercentageChange } from "@/utils/financeUtils";

interface FinancialOverviewProps {
  totalBudget: number;
  totalIncome: number;
  totalExpenses: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  previousMonthIncome: number;
  previousMonthExpenses: number;
  isLoading: {
    monthlyIncome: boolean;
    monthlyExpenses: boolean;
    previousMonthIncome: boolean;
    previousMonthExpenses: boolean;
    totalBudget: boolean;
    budgetCategories: boolean;
    totalIncome: boolean;
    campaigns: boolean;
  };
}

const FinancialOverview: React.FC<FinancialOverviewProps> = ({
  totalBudget,
  totalIncome,
  totalExpenses,
  monthlyIncome,
  monthlyExpenses,
  previousMonthIncome,
  previousMonthExpenses,
  isLoading,
}) => {
  // Use YTD for all stats
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);
  const today = new Date();

  // All props below must be YTD values (not monthly)
  // If props are not YTD, fetch YTD using backend unified functions

  // Calculate net balance using YTD values
  const netBalance = (totalIncome || 0) - (totalExpenses || 0);
  const previousYearNetBalance = (previousMonthIncome || 0) - (previousMonthExpenses || 0);
  const percentChange = calculatePercentageChange(netBalance, previousYearNetBalance);

  // Calculate overall fundraising progress
  const overallBudgetAmount = totalBudget || 0;
  const overallIncomeAmount = totalIncome || 0;
  const overallPercentComplete = 
    overallBudgetAmount > 0 
      ? (overallIncomeAmount / overallBudgetAmount) * 100 
      : 0;

  const summary = {
    totalIncome: totalIncome || 0,
    totalExpenses: totalExpenses || 0,
    netBalance: (totalIncome || 0) - (totalExpenses || 0),
    percentChange: Math.round(percentChange * 10) / 10
  };

  // Pass currentYear to OverallFundraisingGoal for dynamic heading
  return (
    <div className="mb-8 w-full">
      <OverallFundraisingGoal 
        totalTarget={totalBudget}
        totalRaised={totalIncome}
        percentComplete={overallPercentComplete}
        isLoading={isLoading.totalBudget || isLoading.totalIncome}
        year={currentYear}
      />
      
      <div className="mb-8 w-full">
        <h2 className="text-xl font-semibold mb-4 text-meow-primary text-center md:text-left font-serif">
          Financial Summary
        </h2>
        <DonationSummary 
          summary={summary} 
          summaryLoading={isLoading.monthlyIncome || isLoading.monthlyExpenses} 
        />
      </div>
    </div>
  );
};

export default FinancialOverview;
