
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from "sonner";

const reports = [
  { 
    id: "monthly-summary", 
    title: "Monthly Financial Summary", 
    description: "Summary of donations, expenses, and balance",
    date: new Date(2025, 2, 15)
  },
  { 
    id: "quarterly-report", 
    title: "Q1 2025 Financial Report", 
    description: "Detailed quarterly financial statement",
    date: new Date(2025, 3, 10)
  },
  { 
    id: "annual-report", 
    title: "2024 Annual Report", 
    description: "Comprehensive annual financial report",
    date: new Date(2025, 1, 20)
  },
  { 
    id: "tax-filings", 
    title: "2024 Tax Documentation", 
    description: "Documentation for tax filing purposes",
    date: new Date(2025, 1, 28)
  }
];

const FinancialReports: React.FC = () => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  
  const handleDownload = (id: string) => {
    setDownloadingId(id);
    
    // Simulate download delay
    setTimeout(() => {
      setDownloadingId(null);
      toast.success("Report downloaded successfully");
    }, 1500);
  };
  
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Financial Reports</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {reports.map(report => (
              <div key={report.id} className="flex items-center justify-between p-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-10 w-10 text-gray-400 mt-1" />
                  <div>
                    <h3 className="font-medium">{report.title}</h3>
                    <p className="text-sm text-gray-500">{report.description}</p>
                    <p className="text-xs text-gray-400 mt-1">Generated on {format(report.date, 'MMM d, yyyy')}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => handleDownload(report.id)}
                  disabled={downloadingId === report.id}
                >
                  {downloadingId === report.id ? "Downloading..." : (
                    <>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Generate Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Button variant="outline" className="h-auto py-4 px-6 flex-col items-center justify-center space-y-2">
              <FileText className="h-8 w-8 mb-2" />
              <div className="text-base font-medium">Monthly Statement</div>
              <div className="text-xs text-gray-500">Generate current month's report</div>
            </Button>
            <Button variant="outline" className="h-auto py-4 px-6 flex-col items-center justify-center space-y-2">
              <FileText className="h-8 w-8 mb-2" />
              <div className="text-base font-medium">Custom Report</div>
              <div className="text-xs text-gray-500">Generate a report for a custom timeframe</div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReports;
