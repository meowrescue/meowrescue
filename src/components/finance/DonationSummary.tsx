
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface DonationSummaryProps {
  summary: {
    totalDonations: number;
    totalExpenses: number;
    netBalance: number;
    percentChange: number;
  } | undefined;
  summaryLoading: boolean;
}

const DonationSummary: React.FC<DonationSummaryProps> = ({
  summary,
  summaryLoading,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <Card className="shadow-md border-t-4 border-t-green-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-green-500" />
          Total Donations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {summaryLoading ? (
          <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
        ) : (
          <div className="text-3xl font-bold text-green-600">
            {formatCurrency(summary?.totalDonations || 0)}
          </div>
        )}
      </CardContent>
    </Card>
    <Card className="shadow-md border-t-4 border-t-red-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-red-500" />
          Total Expenses
        </CardTitle>
      </CardHeader>
      <CardContent>
        {summaryLoading ? (
          <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
        ) : (
          <div className="text-3xl font-bold text-red-600">
            {formatCurrency(summary?.totalExpenses || 0)}
          </div>
        )}
      </CardContent>
    </Card>
    <Card className="shadow-md border-t-4 border-t-blue-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          {summary && summary.netBalance >= 0 ? (
            <ArrowUp className="h-5 w-5 mr-2 text-green-500" />
          ) : (
            <ArrowDown className="h-5 w-5 mr-2 text-red-500" />
          )}
          Net Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {summaryLoading ? (
          <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
        ) : (
          <div
            className={`text-3xl font-bold ${
              summary && summary.netBalance >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {formatCurrency(summary?.netBalance || 0)}
            {summary && (
              <span className="text-sm ml-2 font-normal">
                ({summary.percentChange >= 0 ? "+" : ""}
                {summary.percentChange}%)
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  </div>
);

export default DonationSummary;
