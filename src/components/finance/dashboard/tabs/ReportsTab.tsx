
import React from 'react';
import FinancialReports from "@/components/finance/FinancialReports";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ReportsTab: React.FC = () => (
  <div className="space-y-6">
    <Alert variant="default" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Financial Reporting</AlertTitle>
      <AlertDescription>
        Generate and download financial reports for your organization. Reports include donation summaries, 
        expense breakdowns, and tax-related documentation.
      </AlertDescription>
    </Alert>
    <FinancialReports />
  </div>
);

export default ReportsTab;
