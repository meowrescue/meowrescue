
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Download, PlusCircle, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';

interface Donation {
  id: string;
  amount: number;
  donation_date: string;
  donor_profile_id: string | null;
  donor_name?: string;
  donor_email?: string;
  is_recurring: boolean;
  status: string;
  notes: string | null;
}

const AdminFinance: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch donations with donor information
  const { data: donations, isLoading, error } = useQuery({
    queryKey: ['donations'],
    queryFn: async () => {
      const { data: donationsData, error: donationsError } = await supabase
        .from('donations')
        .select('*')
        .order('donation_date', { ascending: false });
      
      if (donationsError) throw donationsError;
      
      // For each donation with a donor_profile_id, fetch the donor's name and email
      const donationsWithDonorInfo = await Promise.all(
        donationsData.map(async (donation) => {
          if (donation.donor_profile_id) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('first_name, last_name, email')
              .eq('id', donation.donor_profile_id)
              .single();
              
            if (profileData) {
              return {
                ...donation,
                donor_name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Anonymous',
                donor_email: profileData.email
              };
            }
          }
          
          return {
            ...donation,
            donor_name: 'Anonymous',
            donor_email: ''
          };
        })
      );
      
      return donationsWithDonorInfo as Donation[];
    }
  });
  
  // Calculate total donations
  const totalDonations = donations?.reduce((sum, donation) => 
    sum + parseFloat(donation.amount.toString()), 0) || 0;
  
  // Calculate monthly donations (for this month)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyDonations = donations?.filter(donation => {
    const donationDate = new Date(donation.donation_date);
    return donationDate.getMonth() === currentMonth && 
           donationDate.getFullYear() === currentYear;
  }).reduce((sum, donation) => 
    sum + parseFloat(donation.amount.toString()), 0) || 0;
  
  // Calculate recurring donations total
  const recurringDonationsTotal = donations?.filter(donation => 
    donation.is_recurring
  ).reduce((sum, donation) => 
    sum + parseFloat(donation.amount.toString()), 0) || 0;
  
  // Filter donations based on search query
  const filteredDonations = donations?.filter(donation =>
    donation.donor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donation.donor_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donation.notes?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Finance">
      <SEO title="Finance | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-meow-primary">Finance</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Donation
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalDonations.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
              <p className="text-xs text-gray-500 mt-1">Lifetime total</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Monthly Donations</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${monthlyDonations.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Recurring Donations</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${recurringDonationsTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
              <p className="text-xs text-gray-500 mt-1">Total recurring donations</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex items-center mb-6">
          <Input
            placeholder="Search donations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading donations. Please try again later.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>A list of all donations received.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Donor</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDonations?.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell>
                      {new Date(donation.donation_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{donation.donor_name}</TableCell>
                    <TableCell>{donation.donor_email || '-'}</TableCell>
                    <TableCell>
                      ${parseFloat(donation.amount.toString()).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge className={donation.is_recurring ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"}>
                        {donation.is_recurring ? 'Recurring' : 'One-time'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">
                        {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{donation.notes || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminFinance;
