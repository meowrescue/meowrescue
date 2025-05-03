import getSupabaseClient from '@/integrations/supabase/client';
import { FundraisingCampaign } from '@/types/finance';

/**
 * Fetches active fundraising campaigns from the database
 */
export const getCurrentCampaigns = async (): Promise<FundraisingCampaign[]> => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('fundraising_campaigns')
      .select('*')
      .eq('is_active', true)
      .order('start_date', { ascending: false });
      
    if (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
    
    // Transform the data into the correct format
    const campaigns = data.map(campaign => {
      const targetAmount = typeof campaign.target_amount === 'string' 
        ? parseFloat(campaign.target_amount) 
        : campaign.target_amount || 0;
      
      const amountRaised = typeof campaign.amount_raised === 'string'
        ? parseFloat(campaign.amount_raised)
        : campaign.amount_raised || 0;
        
      const percentComplete = targetAmount > 0
        ? (amountRaised / targetAmount) * 100
        : 0;
        
      return {
        id: campaign.id,
        name: campaign.name,
        description: campaign.description,
        targetAmount,
        amountRaised,
        percentComplete,
        startDate: campaign.start_date,
        endDate: campaign.end_date,
        campaignType: campaign.campaign_type
      };
    });
    
    return campaigns;
  } catch (err) {
    console.error('Failed to fetch campaigns:', err);
    return [];
  }
};
