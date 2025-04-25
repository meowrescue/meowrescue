
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BudgetCategories from "@/components/finance/BudgetCategories";
import FundraisingCampaigns from "@/components/finance/FundraisingCampaigns";
import DonorWall from "@/components/finance/DonorWall";
import ExpensesTable from "@/components/finance/ExpensesTable";
import { FundraisingCampaign } from "@/types/finance";

interface FinancialDataTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  budgetCategories: any[];
  campaigns: FundraisingCampaign[];
  recentDonors: any[];
  topDonors: any[];
  expenses: any[];
  isLoading: {
    budgetCategories: boolean;
    campaigns: boolean;
    donorsLoading: boolean;
    topDonorsLoading: boolean;
    expensesLoading: boolean;
  };
  onDonate: (campaignId: string, assignedBudgetCategory?: string) => void;
}

const FinancialDataTabs: React.FC<FinancialDataTabsProps> = ({
  activeTab,
  setActiveTab,
  budgetCategories,
  campaigns,
  recentDonors,
  topDonors,
  expenses,
  isLoading,
  onDonate,
}) => {
  return (
    <div className="mb-8 w-full">
      <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-white p-1 rounded-lg border shadow-sm mb-4">
          <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 gap-1">
            <TabsTrigger value="summary" className="text-sm">Budget</TabsTrigger>
            <TabsTrigger value="campaigns" className="text-sm">Fundraising</TabsTrigger>
            <TabsTrigger value="donors" className="text-sm">Donors</TabsTrigger>
            <TabsTrigger value="expenses" className="text-sm">Expenses</TabsTrigger>
          </TabsList>
        </div>
        <div className="mt-4 w-full">
          <TabsContent value="summary" className="mt-0 w-full">
            <BudgetCategories 
              budgetCategories={budgetCategories} 
              budgetLoading={isLoading.budgetCategories} 
            />
          </TabsContent>
          <TabsContent value="campaigns" className="mt-0 w-full">
            <FundraisingCampaigns 
              campaigns={campaigns} 
              campaignsLoading={isLoading.campaigns} 
              onDonate={onDonate} 
            />
          </TabsContent>
          <TabsContent value="donors" className="mt-0 w-full">
            <DonorWall
              recentDonors={recentDonors}
              donorsLoading={isLoading.donorsLoading}
              topDonors={topDonors}
              topDonorsLoading={isLoading.topDonorsLoading}
            />
          </TabsContent>
          <TabsContent value="expenses" className="mt-0 w-full">
            <ExpensesTable 
              expenses={expenses} 
              expensesLoading={isLoading.expensesLoading} 
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default FinancialDataTabs;
