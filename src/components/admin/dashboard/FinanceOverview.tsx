
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinancialStats } from '@/hooks/useFinancialStats';
import { calculatePercentageChange } from '@/utils/financeUtils';
import FinanceStatCard from './finance/FinanceStatCard';

const FinanceOverview = () => {
  const { financialStats } = useFinancialStats();
  
  const { 
    monthlyIncome: monthlyDonations, 
    monthlyExpenses, 
    previousMonthIncome: previousMonthDonations 
  } = financialStats;

  const donationsPercentChange = 
    previousMonthDonations !== undefined && monthlyDonations !== undefined
      ? calculatePercentageChange(monthlyDonations, previousMonthDonations)
      : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Finance Overview</CardTitle>
        <Link 
          to="/admin/finance" 
          className="text-sm text-meow-primary hover:underline"
        >
          View details
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <FinanceStatCard
            title="Monthly Donations"
            amount={monthlyDonations || 0}
            percentageChange={donationsPercentChange}
            bgColor="bg-green-50"
            textColor="text-green-600"
          />
          <FinanceStatCard
            title="Monthly Income"
            amount={monthlyDonations || 0}
            percentageChange={donationsPercentChange}
            bgColor="bg-blue-50"
            textColor="text-blue-600"
          />
          <FinanceStatCard
            title="Expenses"
            amount={monthlyExpenses || 0}
            percentageChange={2.7}
            bgColor="bg-amber-50"
            textColor="text-amber-600"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FinanceOverview;
