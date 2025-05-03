
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import getSupabaseClient from '@/integrations/supabase/client';

const config = {
  donations: { color: "#4ade80" }, // Green
  expenses: { color: "#f97316" },  // Orange
  axis: { color: "#888888" },
};

// Define the type for our chart data items
type DataItem = {
  name: string;
  donations: number;
  expenses: number;
};

const RevenueAnalytics: React.FC = () => {
  // Fetch real financial data from the database
  const { data: chartData, isLoading } = useQuery<DataItem[]>({
    queryKey: ['annual-financial-overview'],
    queryFn: async () => {
      const currentYear = new Date().getFullYear();
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      
      // Initialize data structure with all months
      const monthlyData: Record<string, DataItem> = {};
      months.forEach((month, index) => {
        monthlyData[month] = {
          name: month,
          donations: 0,
          expenses: 0
        };
      });
      
      // Fetch all donations for the current year
      const startOfYear = new Date(currentYear, 0, 1).toISOString();
      const endOfYear = new Date(currentYear, 11, 31).toISOString();
      
      const { data: donationsData, error: donationsError } = await supabase
        .from('donations')
        .select('amount, donation_date')
        .gte('donation_date', startOfYear)
        .lte('donation_date', endOfYear);
        
      if (donationsError) console.error('Error fetching donations:', donationsError);
      
      // Process donations
      if (donationsData) {
        donationsData.forEach(donation => {
          const date = new Date(donation.donation_date);
          const month = months[date.getMonth()];
          const amount = typeof donation.amount === 'string' 
            ? parseFloat(donation.amount) 
            : donation.amount;
            
          if (monthlyData[month]) {
            monthlyData[month].donations += amount;
          }
        });
      }
      
      // Fetch all expenses for the current year
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('amount, expense_date')
        .gte('expense_date', startOfYear)
        .lte('expense_date', endOfYear);
        
      if (expensesError) console.error('Error fetching expenses:', expensesError);
      
      // Process expenses
      if (expensesData) {
        expensesData.forEach(expense => {
          const date = new Date(expense.expense_date);
          const month = months[date.getMonth()];
          const amount = typeof expense.amount === 'string' 
            ? parseFloat(expense.amount) 
            : expense.amount;
            
          if (monthlyData[month]) {
            monthlyData[month].expenses += amount;
          }
        });
      }
      
      // Convert to array for the chart
      return Object.values(monthlyData);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Annual Financial Overview</CardTitle>
        <CardDescription>
          Compare monthly income and expenses throughout the year
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer config={config}>
            <ResponsiveContainer width="100%" height="100%">
              {isLoading ? (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="animate-spin h-8 w-8 border-2 border-meow-primary border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <BarChart 
                  data={chartData} 
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  barGap={0}
                  barSize={15}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    tickLine={{ stroke: config.axis.color }}
                    axisLine={{ stroke: config.axis.color }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${value}`}
                    tick={{ fontSize: 12 }}
                    tickLine={{ stroke: config.axis.color }}
                    axisLine={{ stroke: config.axis.color }}
                  />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        // Type safety: ensure we have the actual numeric values
                        const donationValue = payload[0]?.value as number;
                        const expenseValue = payload[1]?.value as number;
                        
                        // Only calculate net if both values are numbers
                        const netValue = typeof donationValue === 'number' && typeof expenseValue === 'number' 
                          ? donationValue - expenseValue 
                          : 0;
                        
                        // Determine if net is positive for styling
                        const isNetPositive = netValue >= 0;
                        
                        return (
                          <ChartTooltipContent>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  Donations
                                </span>
                                <span className="font-bold text-green-500">
                                  {formatCurrency(donationValue)}
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  Expenses
                                </span>
                                <span className="font-bold text-orange-500">
                                  {formatCurrency(expenseValue)}
                                </span>
                              </div>
                              <div className="flex flex-col col-span-2 border-t pt-1 mt-1">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  Net
                                </span>
                                <span className={`font-bold ${isNetPositive ? 'text-green-500' : 'text-red-500'}`}>
                                  {formatCurrency(netValue)}
                                </span>
                              </div>
                            </div>
                          </ChartTooltipContent>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="donations" 
                    name="Donations" 
                    fill={config.donations.color}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="expenses" 
                    name="Expenses" 
                    fill={config.expenses.color}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueAnalytics;
