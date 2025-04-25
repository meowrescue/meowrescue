
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, ArrowUpDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Props {
  monthlyDonations?: number;
  monthlyDonationsChange: number;
  isLoading: boolean;
}

const MonthlyRevenueCard: React.FC<Props> = ({ monthlyDonations, monthlyDonationsChange, isLoading }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center">
        <DollarSign className="h-4 w-4 text-green-500 mr-2" /> 
        Monthly Revenue
      </CardTitle>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
      ) : (
        <>
          <div className="text-2xl font-bold">{formatCurrency(monthlyDonations)}</div>
          <div className="flex items-center text-xs mt-1">
            <ArrowUpDown className="h-3 w-3 mr-1" />
            <span className={monthlyDonationsChange >= 0 ? "text-green-500" : "text-red-500"}>
              {monthlyDonationsChange > 0 ? '+' : ''}
              {monthlyDonationsChange === Infinity 
                ? '100+' 
                : Math.abs(monthlyDonationsChange) > 1000 
                  ? '1000+' 
                  : monthlyDonationsChange.toFixed(1)
              }% from last month
            </span>
          </div>
        </>
      )}
    </CardContent>
  </Card>
);

export default MonthlyRevenueCard;
