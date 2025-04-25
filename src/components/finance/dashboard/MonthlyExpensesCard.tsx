
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Receipt, ArrowUpDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Props {
  monthlyExpenses?: number;
  monthlyExpensesChange: number;
  isLoading: boolean;
}

const MonthlyExpensesCard: React.FC<Props> = ({ monthlyExpenses, monthlyExpensesChange, isLoading }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center">
        <Receipt className="h-4 w-4 text-amber-500 mr-2" /> 
        Monthly Expenses
      </CardTitle>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
      ) : (
        <>
          <div className="text-2xl font-bold">{formatCurrency(monthlyExpenses)}</div>
          <div className="flex items-center text-xs mt-1">
            <ArrowUpDown className="h-3 w-3 mr-1" />
            <span className={monthlyExpensesChange <= 0 ? "text-green-500" : "text-red-500"}>
              {monthlyExpensesChange > 0 ? '+' : ''}
              {monthlyExpensesChange === Infinity 
                ? '100+' 
                : Math.abs(monthlyExpensesChange) > 1000 
                  ? '1000+' 
                  : monthlyExpensesChange.toFixed(1)
              }% from last month
            </span>
          </div>
        </>
      )}
    </CardContent>
  </Card>
);

export default MonthlyExpensesCard;
