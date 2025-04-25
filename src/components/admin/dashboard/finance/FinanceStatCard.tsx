
import React from 'react';
import { ArrowRight, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface FinanceStatCardProps {
  title: string;
  amount: number;
  percentageChange?: number;
  bgColor: string;
  textColor: string;
}

const FinanceStatCard = ({ 
  title, 
  amount, 
  percentageChange, 
  bgColor, 
  textColor 
}: FinanceStatCardProps) => {
  return (
    <div className={`flex flex-col items-center ${bgColor} rounded-lg p-4 flex-1`}>
      <div className="mb-2 text-sm text-gray-600">{title}</div>
      <div className="flex items-center">
        <DollarSign className={`h-5 w-5 ${textColor} mr-1`} />
        <span className={`text-2xl font-bold ${textColor}`}>{formatCurrency(amount)}</span>
      </div>
      {percentageChange !== undefined && (
        <div className="flex items-center mt-1 text-xs">
          <ArrowRight className={`h-3 w-3 ${textColor} mr-1`} />
          <span className={textColor}>
            {percentageChange > 0 ? '+' : ''}
            {percentageChange.toFixed(1)}% from last month
          </span>
        </div>
      )}
    </div>
  );
};

export default FinanceStatCard;
