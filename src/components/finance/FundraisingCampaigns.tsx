
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";

// Updated interface with category
interface FundraisingCampaign {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  amountRaised: number;
  percentComplete: number;
  startDate?: string;
  endDate?: string;
  // New property for category assignment
  assignedBudgetCategory?: string;
}

interface FundraisingCampaignsProps {
  campaigns: FundraisingCampaign[] | undefined;
  campaignsLoading: boolean;
  onDonate: (campaignId: string, category?: string) => void;
}

const FundraisingCampaigns: React.FC<FundraisingCampaignsProps> = ({
  campaigns,
  campaignsLoading,
  onDonate,
}) => (
  <Card className="shadow-md">
    <CardHeader className="pb-2 border-b">
      <CardTitle className="text-xl text-meow-primary">
        Current Fundraising Campaigns
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-6">
      {campaignsLoading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-md"></div>
          ))}
        </div>
      ) : campaigns && campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden border-t-4 border-t-meow-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{campaign.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{campaign.description}</p>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>{formatCurrency(campaign.amountRaised)} raised</span>
                    <span className="font-medium">{campaign.percentComplete}%</span>
                  </div>
                  <div className="h-6 relative">
                    <Progress
                      value={campaign.percentComplete}
                      max={100}
                      className="h-3"
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>Goal: {formatCurrency(campaign.targetAmount)}</span>
                    {campaign.endDate && (
                      <span>
                        Ends: {new Date(campaign.endDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {campaign.assignedBudgetCategory && (
                    <div className="mt-2 text-xs text-meow-primary">
                      Applies to: <span className="font-semibold">{campaign.assignedBudgetCategory}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 pb-4 pt-3 px-6">
                <button 
                  onClick={() => onDonate(campaign.id, campaign.assignedBudgetCategory)} 
                  className="w-full py-2 bg-meow-primary text-white rounded-md hover:bg-meow-primary/90 transition-colors"
                >
                  Donate to this Campaign
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
          <p>No active fundraising campaigns.</p>
          <p className="text-sm mt-2">Check back soon for upcoming fundraising initiatives!</p>
        </div>
      )}
    </CardContent>
  </Card>
);

export default FundraisingCampaigns;
