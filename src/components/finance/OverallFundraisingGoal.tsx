
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const primary = "#004080";
const light = "#f1f6fb";
const progressBg = "#e6eff7";

interface OverallFundraisingGoalProps {
  totalTarget: number;
  totalRaised: number;
  percentComplete: number;
  isLoading: boolean;
  year: number;
}

// Helper for readable percentage pill color
function isVeryLow(percent: number) {
  return percent < 8;
}

const OverallFundraisingGoal: React.FC<OverallFundraisingGoalProps> = ({
  totalTarget,
  totalRaised,
  percentComplete,
  isLoading,
  year
}) => {
  const isMobile = useIsMobile();
  
  // Calculate the actual percentage with precision for small amounts
  const actualPercentage = totalTarget > 0 ? (totalRaised / totalTarget) * 100 : 0;
  // Format the percentage with 2 decimal places for display
  const displayPercentageText = Number.isNaN(actualPercentage) ? "0.00" : actualPercentage.toFixed(2);

  // For the progress bar, ensure a minimum visible width if there's any donation
  const displayPercentage = totalRaised > 0 
    ? Math.max(0.25, actualPercentage) // Show at least 0.25% instead of 1% to avoid visual artifacts
    : 0;

  // Debug output
  console.log("Fundraising goal data:", { 
    totalTarget, 
    totalRaised, 
    percentComplete: actualPercentage 
  });

  return (
    <div className="max-w-5xl w-full mx-auto">
      <Card className="shadow-md mb-6 w-full bg-[#f7fafd] border border-[#e7f0f7] rounded-2xl p-0 overflow-hidden">
        <CardHeader className="pb-2 bg-[#004080] text-white rounded-t-2xl">
          <CardTitle className="text-xl md:text-2xl font-semibold font-serif tracking-tight leading-tight">
            Overall {year} Fundraising Goal
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-8 py-6">
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
              <div className="h-6 bg-gray-200 animate-pulse rounded-md"></div>
            </div>
          ) : (
            <>
              <div className={`flex flex-col ${isMobile ? "items-center gap-y-3" : "md:flex-row justify-between items-center"} mb-4`}>
                <div className="flex flex-col md:flex-row md:items-end gap-x-2 items-center">
                  <span className="text-2xl md:text-3xl font-bold text-[#004080] font-sans leading-tight">
                    {formatCurrency(totalRaised)}
                  </span>
                  <span className="text-base md:text-lg font-semibold text-gray-500 ml-1">
                    raised of 
                    <span className="font-bold text-[#193f6d] ml-2">{formatCurrency(totalTarget)}</span>
                    <span className="font-normal">&nbsp;goal</span>
                  </span>
                </div>
                <div className={`md:pr-0 ${isMobile ? "mt-2" : "mt-4 md:mt-0"}`}>
                  <span
                    className="px-4 py-1 rounded-full text-base md:text-lg font-bold font-sans"
                    style={{
                      background: "#e6eff7",
                      color: primary,
                    }}
                  >
                    {displayPercentageText}% Complete
                  </span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="relative w-full h-12 md:h-10 mb-4">
                <Progress
                  value={displayPercentage}
                  max={100}
                  className="h-12 md:h-10 rounded-full bg-[#e6eff7]"
                  barColor={primary}
                  trackColor={progressBg}
                />
              </div>

              <div className="mt-3 text-center text-sm text-[#4B5460] font-sans font-medium">
                Help us reach our goal by donating today or supporting one of our specific campaigns below!
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OverallFundraisingGoal;
