
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import PageHeader from "@/components/ui/PageHeader";
import { InfoIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { checkSupabaseConnection, checkFinancialData } from "@/integrations/supabase/client";
import FinancialOverview from "@/components/finance/FinancialOverview";
import FinancialDataTabs from "@/components/finance/FinancialDataTabs";
import { useFinancialDashboard } from "@/hooks/useFinancialDashboard";

const FinancialTransparency: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("summary");
  const navigate = useNavigate();
  const { financialStats, donorData, expenses, refetchData } = useFinancialDashboard();

  // Test connection and fetch data on page load
  useEffect(() => {
    const init = async () => {
      try {
        // Check connection
        const connectionStatus = await checkSupabaseConnection();
        console.log("Supabase connection status on Financial Transparency page:", connectionStatus);

        if (!connectionStatus.connected) {
          toast.error("Unable to connect to the database. Some data may not be available.");
          return;
        }

        // Perform a manual data refresh
        await refetchData.refetchFinancialStats();
        await refetchData.refetchRecentDonors();
        await refetchData.refetchTopDonors();
        await refetchData.refetchExpenses();

        // Check if we have actual data
        const sampleData = await checkFinancialData();
        console.log("Financial data sample:", sampleData);

        if (
          !sampleData.donations.length &&
          !sampleData.expenses.length &&
          !sampleData.budgets.length
        ) {
          console.warn("No financial data found in the database");
        }
      } catch (err) {
        console.error("Error initializing financial transparency page:", err);
      }
    };

    init();
  }, [refetchData]);

  // Handle donations
  const handleDonate = (campaignId: string, assignedBudgetCategory?: string) => {
    toast.success("Redirecting to donation page...");
    let url = `/donate?campaign=${campaignId}`;
    if (assignedBudgetCategory) {
      url += `&category=${encodeURIComponent(assignedBudgetCategory)}`;
    }
    navigate(url);
  };

  // Log data for debugging
  useEffect(() => {
    console.log("Financial Transparency Render Data:", {
      totalBudget: financialStats.totalBudget,
      totalDonations: financialStats.totalDonations,
      monthlyDonations: financialStats.monthlyDonations,
      monthlyExpenses: financialStats.monthlyExpenses,
      loading: financialStats.isLoading,
      recentDonorsCount: donorData.recentDonors?.length,
      topDonorsCount: donorData.topDonors?.length,
      expensesCount: expenses.data?.length
    });
  }, [financialStats, donorData, expenses]);

  return (
    <Layout>
      <SEO title="Financial Transparency | Meow Rescue" />
      
      <PageHeader 
        title="Financial Transparency" 
        subtitle="At Meow Rescue, we believe in complete transparency with our finances. This dashboard shows real-time data on our donations, expenses, and how funds are used to help cats in our care."
      />
      
      <div className="container mx-auto py-8 px-2 sm:px-4">
        <div className="max-w-5xl mx-auto flex flex-col w-full items-center">
          <FinancialOverview
            totalBudget={financialStats.totalBudget}
            totalDonations={financialStats.totalDonations}
            monthlyDonations={financialStats.monthlyDonations}
            monthlyExpenses={financialStats.monthlyExpenses}
            previousMonthDonations={financialStats.previousMonthDonations}
            previousMonthExpenses={financialStats.previousMonthExpenses}
            isLoading={{
              totalBudget: financialStats.isLoading.totalBudget,
              totalDonations: financialStats.isLoading.totalDonations,
              monthlyDonations: financialStats.isLoading.monthlyDonations,
              monthlyExpenses: financialStats.isLoading.monthlyExpenses
            }}
          />
          
          <FinancialDataTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            budgetCategories={financialStats.budgetCategories}
            campaigns={financialStats.campaigns}
            recentDonors={donorData.recentDonors}
            topDonors={donorData.topDonors}
            expenses={expenses.data}
            isLoading={{
              budgetCategories: financialStats.isLoading.budgetCategories,
              campaigns: financialStats.isLoading.campaigns,
              donorsLoading: donorData.donorsLoading,
              topDonorsLoading: donorData.topDonorsLoading,
              expensesLoading: expenses.isLoading
            }}
            onDonate={handleDonate}
          />
          
          <div className="mt-8 border-t border-gray-200 pt-4 text-center text-sm text-gray-500 w-full">
            <p className="flex items-center justify-center">
              <InfoIcon className="h-4 w-4 mr-2" />
              This dashboard updates automatically with our financial records. Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FinancialTransparency;
