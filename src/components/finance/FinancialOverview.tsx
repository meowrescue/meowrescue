
import React from "react";
import DonationSummary from "@/components/finance/DonationSummary";
import OverallFundraisingGoal from "@/components/finance/OverallFundraisingGoal";
import { calculatePercentageChange } from "@/utils/financeUtils";

interface FinancialOverviewProps {
  totalBudget: number;
  totalDonations: number;
  monthlyDonations: number;
  monthlyExpenses: number;
  previousMonthDonations: number;
  previousMonthExpenses: number;
  isLoading: {
    totalBudget: boolean;
    totalDonations: boolean;
    monthlyDonations: boolean;
    monthlyExpenses: boolean;
  };
}

const FinancialOverview: React.FC<FinancialOverviewProps> = ({
  totalBudget,
  totalDonations,
  monthlyDonations,
  monthlyExpenses,
  previousMonthDonations,
  previousMonthExpenses,
  isLoading,
}) => {
  const currentYear = new Date().getFullYear();
  
  // Calculate net balance and percentage change
  const netBalance = (monthlyDonations || 0) - (monthlyExpenses || 0);
  const previousNetBalance = (previousMonthDonations || 0) - (previousMonthExpenses || 0);
  const percentChange = calculatePercentageChange(netBalance, previousNetBalance);

  // Calculate overall fundraising progress
  const overallBudgetAmount = totalBudget || 0;
  const overallDonationsAmount = totalDonations || 0;
  const overallPercentComplete = 
    overallBudgetAmount > 0 
      ? (overallDonationsAmount / overallBudgetAmount) * 100 
      : 0;

  const summary = {
    totalDonations: monthlyDonations || 0,
    totalExpenses: monthlyExpenses || 0,
    netBalance: netBalance,
    percentChange: Math.round(percentChange * 10) / 10
  };

  return (
    <>
      <OverallFundraisingGoal 
        totalTarget={overallBudgetAmount}
        totalRaised={overallDonationsAmount}
        percentComplete={overallPercentComplete}
        isLoading={isLoading.totalBudget || isLoading.totalDonations}
        year={currentYear}
      />
      
      <div className="mb-8 w-full">
        <h2 className="text-xl font-semibold mb-4 text-meow-primary text-center md:text-left font-serif">
          Financial Summary
        </h2>
        <DonationSummary 
          summary={summary} 
          summaryLoading={isLoading.monthlyDonations || isLoading.monthlyExpenses} 
        />
      </div>
    </>
  );
};

export default FinancialOverview;
