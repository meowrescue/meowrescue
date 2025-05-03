import React, { useEffect } from "react";
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
  'data-realtime'?: string;
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
  'data-realtime': dataRealtime,
}) => {
  // Detect if we're in the browser environment
  const isBrowser = typeof window !== 'undefined';

  // Handle the tab changes in a way that works with both static HTML and React
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // For static HTML support, manually update visibility
    if (isBrowser) {
      const tabPanels = document.querySelectorAll('[data-tab-content="financial-tabs"]');
      tabPanels.forEach(panel => {
        const panelId = panel.getAttribute('id');
        if (panelId === `tab-${value}`) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      });
    }
  };

  // When the component mounts, ensure the active tab is visible
  useEffect(() => {
    if (isBrowser) {
      // Initialize active tab state for static HTML
      const activeTabPanel = document.getElementById(`tab-${activeTab}`);
      if (activeTabPanel) {
        activeTabPanel.classList.remove('hidden');
      }
    }
  }, [activeTab, isBrowser]);

  return (
    <div className="mb-8 w-full" data-realtime={dataRealtime}>
      <Tabs 
        defaultValue="summary" 
        value={activeTab} 
        onValueChange={handleTabChange} 
        className="w-full"
      >
        <div className="bg-white p-1 rounded-lg border shadow-sm mb-4">
          <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 gap-1">
            <TabsTrigger 
              value="summary" 
              className="text-sm"
              data-tab-toggle="tab-summary"
              data-tab-group="financial-tabs"
            >
              Budget
            </TabsTrigger>
            <TabsTrigger 
              value="campaigns" 
              className="text-sm"
              data-tab-toggle="tab-campaigns"
              data-tab-group="financial-tabs"
            >
              Fundraising
            </TabsTrigger>
            <TabsTrigger 
              value="donors" 
              className="text-sm"
              data-tab-toggle="tab-donors"
              data-tab-group="financial-tabs"
            >
              Donors
            </TabsTrigger>
            <TabsTrigger 
              value="expenses" 
              className="text-sm"
              data-tab-toggle="tab-expenses"
              data-tab-group="financial-tabs"
            >
              Expenses
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="mt-4 w-full">
          <TabsContent 
            value="summary" 
            className="mt-0 w-full" 
            id="tab-summary"
            data-tab-content="financial-tabs"
          >
            <BudgetCategories 
              budgetCategories={budgetCategories} 
              budgetLoading={isLoading.budgetCategories} 
            />
          </TabsContent>
          <TabsContent 
            value="campaigns" 
            className="mt-0 w-full"
            id="tab-campaigns"
            data-tab-content="financial-tabs"
          >
            <FundraisingCampaigns 
              campaigns={campaigns} 
              campaignsLoading={isLoading.campaigns} 
              onDonate={onDonate} 
            />
          </TabsContent>
          <TabsContent 
            value="donors" 
            className="mt-0 w-full"
            id="tab-donors"
            data-tab-content="financial-tabs"
          >
            <DonorWall
              recentDonors={recentDonors}
              donorsLoading={isLoading.donorsLoading}
              topDonors={topDonors}
              topDonorsLoading={isLoading.topDonorsLoading}
            />
          </TabsContent>
          <TabsContent 
            value="expenses" 
            className="mt-0 w-full"
            id="tab-expenses"
            data-tab-content="financial-tabs"
          >
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
