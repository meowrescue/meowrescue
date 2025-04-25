
import React from 'react';
import IncomeEntry from "@/components/finance/IncomeEntry";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  recentDonations: any[];
  isLoadingDonations: boolean;
}

const IncomeTab: React.FC<Props> = ({ recentDonations, isLoadingDonations }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-1">
      <IncomeEntry />
    </div>
    <div className="lg:col-span-2">
      <Card>
        <CardHeader>
          <CardTitle>Recent Income</CardTitle>
          <CardDescription>
            Latest donations and income received by your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingDonations ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 animate-pulse rounded"></div>
              ))}
            </div>
          ) : recentDonations.length > 0 ? (
            <div className="divide-y">
              {recentDonations.map((donation: any) => (
                <div key={donation.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {donation.profiles ? 
                        `${donation.profiles.first_name || ''} ${donation.profiles.last_name || ''}`.trim() || 'Anonymous' : 
                        'Anonymous'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(donation.donation_date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-lg font-semibold text-green-600">
                    ${typeof donation.amount === 'number' ? donation.amount.toFixed(2) : donation.amount}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-6 text-gray-500">
              No recent donations found. Start recording income to see it here.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  </div>
);

export default IncomeTab;
