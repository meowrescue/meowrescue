
import React, { useState, useEffect } from 'react';
import AdminLayout from './Admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, PencilIcon, Trash2Icon, BellOff, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import getSupabaseClient from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils';

interface Campaign {
  id: string;
  name: string;
  description: string;
  target_amount: number;
  amount_raised: number;
  start_date: string;
  end_date: string;
  campaign_type: string;
  is_active: boolean;
}

const AdminFundraisingCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
  
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    target_amount: '',
    start_date: format(new Date(), 'yyyy-MM-dd'),
    end_date: format(new Date(new Date().setMonth(new Date().getMonth() + 3)), 'yyyy-MM-dd'),
    campaign_type: 'general',
    is_active: true
  });
  
  useEffect(() => {
    fetchCampaigns();
  }, []);
  
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const { data, error } = await getSupabaseClient()
        .from('fundraising_campaigns')
        .select('*')
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch campaigns.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'is_active' ? (value === 'true') : value
    }));
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      target_amount: '',
      start_date: format(new Date(), 'yyyy-MM-dd'),
      end_date: format(new Date(new Date().setMonth(new Date().getMonth() + 3)), 'yyyy-MM-dd'),
      campaign_type: 'general',
      is_active: true
    });
    setCurrentCampaign(null);
    setIsEditing(false);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };
  
  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };
  
  const handleEditCampaign = (campaign: Campaign) => {
    setCurrentCampaign(campaign);
    setFormData({
      name: campaign.name,
      description: campaign.description,
      target_amount: campaign.target_amount.toString(),
      start_date: format(new Date(campaign.start_date), 'yyyy-MM-dd'),
      end_date: format(new Date(campaign.end_date), 'yyyy-MM-dd'),
      campaign_type: campaign.campaign_type,
      is_active: campaign.is_active
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const campaignData = {
        name: formData.name,
        description: formData.description,
        target_amount: parseFloat(formData.target_amount),
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        campaign_type: formData.campaign_type,
        is_active: formData.is_active
      };
      
      if (isEditing && currentCampaign) {
        const { error } = await getSupabaseClient()
          .from('fundraising_campaigns')
          .update(campaignData)
          .eq('id', currentCampaign.id);
        
        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'Campaign updated successfully.',
        });
      } else {
        const { error } = await getSupabaseClient()
          .from('fundraising_campaigns')
          .insert({
            ...campaignData,
            amount_raised: 0
          });
        
        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'Campaign created successfully.',
        });
      }
      
      fetchCampaigns();
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting campaign:', error);
      toast({
        title: 'Error',
        description: 'Failed to save campaign.',
        variant: 'destructive',
      });
    }
  };
  
  const handleDeleteCampaign = async (id: string) => {
    try {
      const { error } = await getSupabaseClient()
        .from('fundraising_campaigns')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Campaign deleted successfully.',
      });
      
      fetchCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete campaign.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <AdminLayout title="Fundraising Campaigns">
      <div className="container mx-auto py-4 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-meow-primary">Fundraising Campaigns</h1>
            <p className="text-gray-600">
              Create and manage fundraising campaigns for your organization
            </p>
          </div>
          <Button onClick={handleOpenModal}>
            <PlusCircle className="mr-2 h-4 w-4" /> New Campaign
          </Button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow-sm">
                <CardHeader className="pb-2">
                  <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-full mb-4"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 animate-pulse rounded w-full mb-2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => {
              const startDate = new Date(campaign.start_date);
              const endDate = new Date(campaign.end_date);
              const percentComplete = campaign.target_amount > 0
                ? (campaign.amount_raised / campaign.target_amount) * 100
                : 0;
              
              return (
                <Card key={campaign.id} className="shadow-sm overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{campaign.name}</CardTitle>
                        <CardDescription>
                          {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditCampaign(campaign)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteCampaign(campaign.id)}
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-1">
                      {!campaign.is_active && (
                        <div className="inline-flex items-center text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-1">
                          <BellOff className="h-3 w-3 mr-1" />
                          Inactive
                        </div>
                      )}
                      <div className="inline-flex items-center text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1 ml-1">
                        {campaign.campaign_type}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{campaign.description}</p>
                    
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">Progress</span>
                      <span className="text-xs font-medium">{percentComplete.toFixed(1)}%</span>
                    </div>
                    <Progress value={percentComplete} className="h-2 mb-2" />
                    
                    <div className="flex justify-between text-sm font-medium">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span>{formatCurrency(campaign.amount_raised)}</span>
                      </div>
                      <span className="text-gray-600">of {formatCurrency(campaign.target_amount)}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">No campaigns yet</h3>
            <p className="text-gray-500 mb-4">Start creating fundraising campaigns for your organization</p>
            <Button onClick={handleOpenModal}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create a Campaign
            </Button>
          </div>
        )}
      </div>
      
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        if (!open) handleCloseModal();
        setIsModalOpen(open);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Campaign' : 'Create New Campaign'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Update the details for this fundraising campaign.' 
                : 'Create a new fundraising campaign for your organization.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Summer Adoption Drive"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Describe the purpose of this campaign"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="target_amount">Target Amount ($)</Label>
                  <Input
                    id="target_amount"
                    name="target_amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.target_amount}
                    onChange={handleInputChange}
                    placeholder="5000.00"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="campaign_type">Campaign Type</Label>
                  <select
                    id="campaign_type"
                    name="campaign_type"
                    value={formData.campaign_type}
                    onChange={handleInputChange}
                    className="rounded-md border border-input bg-background px-3 py-2"
                    required
                  >
                    <option value="general">General</option>
                    <option value="emergency">Emergency</option>
                    <option value="medical">Medical</option>
                    <option value="adoption">Adoption</option>
                    <option value="facility">Facility</option>
                    <option value="equipment">Equipment</option>
                    <option value="seasonal">Seasonal</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="is_active">Status</Label>
                <select
                  id="is_active"
                  name="is_active"
                  value={formData.is_active.toString()}
                  onChange={handleInputChange}
                  className="rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Campaign' : 'Create Campaign'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminFundraisingCampaigns;
