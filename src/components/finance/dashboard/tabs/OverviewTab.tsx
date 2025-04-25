
import React from 'react';
import RevenueAnalytics from "@/components/finance/RevenueAnalytics";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatCurrency } from '@/lib/utils';

interface Props {
  monthlyDonations?: number;
  monthlyExpenses?: number;
}

const OverviewTab: React.FC<Props> = ({ monthlyDonations, monthlyExpenses }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <RevenueAnalytics />
    <Card>
      <CardHeader>
        <CardTitle>Financial Health</CardTitle>
        <CardDescription>
          Key performance indicators for your organization's finances
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cash on Hand</p>
              <p className="text-2xl font-bold">
                {formatCurrency((monthlyDonations || 0) - (monthlyExpenses || 0))}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Burn Rate</p>
              <p className="text-2xl font-bold">{formatCurrency(monthlyExpenses)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Donor Retention</p>
              <p className="text-2xl font-bold">-</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Donation</p>
              <p className="text-2xl font-bold">-</p>
            </div>
          </div>
          <div className="pt-4">
            <h4 className="text-sm font-semibold mb-2">Recommendations</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li className="flex">
                <span className="text-green-500 mr-1">•</span>
                {monthlyDonations && monthlyDonations < 1000 ? 
                  'Consider launching a fundraising campaign' : 
                  'Continue with current fundraising efforts'}
              </li>
              <li className="flex">
                <span className="text-amber-500 mr-1">•</span>
                {monthlyExpenses && monthlyExpenses > 1000 ? 
                  'Review expenses - potential savings may be found' : 
                  'Expenses are well-managed'}
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default OverviewTab;
