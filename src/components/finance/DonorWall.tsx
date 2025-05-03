import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Donor {
  name: string;
  amount: number;
  position?: string;
  date?: string;
  isAnonymous?: boolean;
  is_anonymous?: boolean;
}

interface DonorWallProps {
  recentDonors: Donor[] | undefined;
  donorsLoading: boolean;
  topDonors: Donor[] | undefined;
  topDonorsLoading: boolean;
  onLoadMoreRecentDonors?: () => void;
  onLoadMoreTopDonors?: () => void;
  hasMoreRecentDonors?: boolean;
  hasMoreTopDonors?: boolean;
}

const DonorsTable = ({ donors, loading, showPosition = false }: { donors: Donor[] | undefined, loading: boolean, showPosition?: boolean }) => {
  console.log("DonorsTable rendering with data:", donors);
  
  if (loading) {
    return <div className="h-52 bg-gray-200 animate-pulse rounded-md"></div>;
  }

  if (!donors?.length) {
    return (
      <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
        <p>No donation records found.</p>
        <p className="text-sm mt-2">Donations will appear here once they are recorded in the system.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {showPosition ? (
              <TableHead>Position</TableHead>
            ) : (
              <TableHead>Date</TableHead>
            )}
            <TableHead>Donor</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donors.map((donor, index) => {
            // Normalize donor name handling by checking both isAnonymous and is_anonymous fields
            const isAnonymous = donor.isAnonymous || donor.is_anonymous;
            const displayName = isAnonymous ? "Anonymous Donor" : donor.name;
            
            return (
              <TableRow
                key={index}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <TableCell className="font-medium">
                  {showPosition ? donor.position : donor.date}
                </TableCell>
                <TableCell>{displayName}</TableCell>
                <TableCell>{formatCurrency(donor.amount)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

const DonorWall: React.FC<DonorWallProps> = ({
  recentDonors,
  donorsLoading,
  topDonors,
  topDonorsLoading,
  onLoadMoreRecentDonors,
  onLoadMoreTopDonors,
  hasMoreRecentDonors,
  hasMoreTopDonors,
}) => {
  console.log("DonorWall rendering with recent donors:", recentDonors);
  console.log("DonorWall rendering with top donors:", topDonors);
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2 border-b flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-xl text-meow-primary">Donation Records</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="recent">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="recent">Recent Donors</TabsTrigger>
            <TabsTrigger value="top">Top Donors</TabsTrigger>
          </TabsList>
          <TabsContent value="recent">
            <DonorsTable donors={recentDonors} loading={donorsLoading} showPosition={false} />
            {hasMoreRecentDonors && (
              <div className="flex justify-center mt-4">
                <button
                  className="px-4 py-2 bg-meow-primary text-white rounded hover:bg-meow-primary-dark transition"
                  onClick={onLoadMoreRecentDonors}
                  disabled={donorsLoading}
                >
                  {donorsLoading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="top">
            <DonorsTable donors={topDonors} loading={topDonorsLoading} showPosition={true} />
            {hasMoreTopDonors && (
              <div className="flex justify-center mt-4">
                <button
                  className="px-4 py-2 bg-meow-primary text-white rounded hover:bg-meow-primary-dark transition"
                  onClick={onLoadMoreTopDonors}
                  disabled={topDonorsLoading}
                >
                  {topDonorsLoading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DonorWall;
