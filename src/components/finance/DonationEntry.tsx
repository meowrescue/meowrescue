
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Check, DollarSign, Search, Plus, User } from 'lucide-react';
import getSupabaseClient from '@/integrations/getSupabaseClient()/client';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  amount: z.string().min(1, { message: "Amount is required" })
    .refine(val => !isNaN(parseFloat(val)), { message: "Must be a valid number" })
    .refine(val => parseFloat(val) > 0, { message: "Amount must be greater than 0" }),
  donorType: z.enum(["anonymous", "existing", "new"]),
  donorProfileId: z.string().optional(),
  donorName: z.string().optional(),
  donorEmail: z.string().email({ message: "Invalid email address" }).optional().or(z.literal('')),
  donorPhone: z.string().optional(),
  donorAddress: z.string().optional(),
  donorCity: z.string().optional(),
  donorState: z.string().optional(),
  donorZip: z.string().optional(),
  donationType: z.string().min(1, { message: "Select a donation type" }),
  paymentMethod: z.string().min(1, { message: "Select a payment method" }),
  notes: z.string().optional(),
  isRecurring: z.boolean().default(false),
  campaignId: z.string().optional(),
  budgetCategoryId: z.string().optional(),
  taxReceiptRequired: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
}

const DonationEntry: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewProfileDialogOpen, setIsNewProfileDialogOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<{id: string, name: string, assignedBudgetCategory?: string}[]>([]);
  const [budgetCategories, setBudgetCategories] = useState<{id: string, name: string}[]>([]);
  
  // Get current user from Supabase
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Get URL parameters (for campaign or category)
  const [urlParams, setUrlParams] = useState<{campaign?: string, category?: string}>({});
  
  useEffect(() => {
    // Get URL parameters
    const queryParams = new URLSearchParams(window.location.search);
    const campaignId = queryParams.get('campaign');
    const categoryId = queryParams.get('category');
    
    if (campaignId || categoryId) {
      setUrlParams({
        campaign: campaignId || undefined,
        category: categoryId || undefined,
      });
    }
    
    // Get current user
    const getCurrentUser = async () => {
      const { data } = await getSupabaseClient().auth.getUser();
      if (data && data.user) {
        setCurrentUser(data.user);
      }
    };
    
    getCurrentUser();
    
    // Load campaigns
    const fetchCampaigns = async () => {
      const { data, error } = await getSupabaseClient()
        .from('fundraising_campaigns')
        .select('id, name, assignedBudgetCategory')
        .eq('is_active', true);
      
      if (!error && data) {
        setCampaigns(data);
      }
    };
    
    // Load budget categories
    const fetchBudgetCategories = async () => {
      const currentYear = new Date().getFullYear();
      const { data, error } = await getSupabaseClient()
        .from('budget_categories')
        .select('id, name')
        .eq('year', currentYear)
        .order('name');
      
      if (!error && data) {
        setBudgetCategories(data);
      }
    };
    
    fetchCampaigns();
    fetchBudgetCategories();
  }, []);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
      donorType: 'anonymous',
      donorProfileId: '',
      donorName: '',
      donorEmail: '',
      donorPhone: '',
      donorAddress: '',
      donorCity: '',
      donorState: '',
      donorZip: '',
      donationType: urlParams.category ? 'campaign' : 'general',
      paymentMethod: 'cash',
      notes: '',
      isRecurring: false,
      campaignId: urlParams.campaign,
      budgetCategoryId: urlParams.category,
      taxReceiptRequired: false
    }
  });
  
  const donorType = form.watch('donorType');
  const selectedCampaign = form.watch('campaignId');
  
  // Effect to set budget category when campaign changes
  useEffect(() => {
    if (selectedCampaign) {
      const campaign = campaigns.find(c => c.id === selectedCampaign);
      if (campaign && campaign.assignedBudgetCategory) {
        form.setValue('budgetCategoryId', campaign.assignedBudgetCategory);
      }
    }
  }, [selectedCampaign, campaigns, form]);
  
  const searchProfiles = async () => {
    if (!searchQuery || searchQuery.length < 3) return;
    
    const { data, error } = await getSupabaseClient()
      .from('profiles')
      .select('id, email, first_name, last_name')
      .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
      .limit(10);
    
    if (!error && data) {
      setProfiles(data);
    }
  };
  
  const selectProfile = (profile: Profile) => {
    form.setValue('donorProfileId', profile.id);
    form.setValue('donorName', `${profile.first_name || ''} ${profile.last_name || ''}`.trim());
    form.setValue('donorEmail', profile.email);
    setProfiles([]);
    setSearchQuery('');
  };
  
  const createNewDonorProfile = async (data: FormValues) => {
    // Create a new user profile if donorType is 'new'
    if (data.donorType === 'new') {
      try {
        // Split donor name into first and last name
        const nameParts = data.donorName?.split(' ') || ['', ''];
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');
        
        // Create profile record
        const { data: profileData, error: profileError } = await getSupabaseClient()
          .from('profiles')
          .insert({
            email: data.donorEmail,
            first_name: firstName,
            last_name: lastName,
            phone: data.donorPhone,
            address: data.donorAddress,
            city: data.donorCity,
            state: data.donorState,
            zip: data.donorZip,
            role: 'donor'
          })
          .select('id')
          .single();
        
        if (profileError) throw profileError;
        
        return profileData.id;
      } catch (error) {
        console.error('Error creating donor profile:', error);
        toast({
          title: "Error creating donor profile",
          description: "Could not create a profile for this donor.",
          variant: "destructive"
        });
        return null;
      }
    }
    return null;
  };
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setIsSuccess(false);
    
    try {
      // Convert amount string to number (preserve cents)
      const amountNum = parseFloat(parseFloat(data.amount).toFixed(2));
      
      // Create new donor profile if needed
      let donorProfileId = data.donorProfileId || null;
      
      if (data.donorType === 'new') {
        const newProfileId = await createNewDonorProfile(data);
        if (newProfileId) {
          donorProfileId = newProfileId;
        }
      }
      
      // Create donation record
      const { error } = await getSupabaseClient().from('donations').insert({
        amount: amountNum,
        donor_name: data.donorType !== 'anonymous' ? data.donorName : null,
        donor_email: data.donorType !== 'anonymous' ? data.donorEmail : null,
        donor_profile_id: donorProfileId,
        income_type: data.donationType,
        payment_method: data.paymentMethod,
        notes: data.notes || null,
        is_recurring: data.isRecurring,
        status: 'completed',
        donation_date: new Date().toISOString(),
        campaign_id: data.campaignId || null,
        budget_category_id: data.budgetCategoryId || null,
        tax_receipt_sent: false,
        tax_receipt_required: data.taxReceiptRequired
      });
      
      if (error) throw error;
      
      // Update all related queries
      queryClient.invalidateQueries({ queryKey: ['monthly-donations'] });
      queryClient.invalidateQueries({ queryKey: ['total-donations'] });
      queryClient.invalidateQueries({ queryKey: ['recent-donors'] });
      queryClient.invalidateQueries({ queryKey: ['top-donors'] });
      
      setIsSuccess(true);
      form.reset();
      
      toast({
        title: "Donation recorded",
        description: `$${amountNum.toFixed(2)} donation successfully recorded.`
      });
    } catch (error: any) {
      toast({
        title: "Error recording donation",
        description: error.message || "An error occurred while recording the donation.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Donation</CardTitle>
        <CardDescription>
          Enter donation details to record a new contribution
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        {...field}
                        className="pl-9"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="donorType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Donor Information</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="anonymous" id="anonymous" />
                        <label htmlFor="anonymous" className="text-sm">Anonymous donation</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="existing" id="existing" />
                        <label htmlFor="existing" className="text-sm">Existing donor</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="new" id="new" />
                        <label htmlFor="new" className="text-sm">New donor</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            
            {donorType === 'existing' && (
              <div>
                <div className="flex gap-2 mb-2">
                  <Input 
                    placeholder="Search by name or email" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="button" variant="outline" onClick={searchProfiles}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                
                {profiles.length > 0 && (
                  <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                    {profiles.map((profile) => (
                      <Button
                        key={profile.id}
                        type="button"
                        variant="ghost"
                        className="w-full justify-start flex items-center gap-2 text-left"
                        onClick={() => selectProfile(profile)}
                      >
                        <User className="h-4 w-4" />
                        {profile.first_name} {profile.last_name}
                        <span className="text-gray-500 text-xs ml-1">{profile.email}</span>
                      </Button>
                    ))}
                  </div>
                )}
                
                <FormField
                  control={form.control}
                  name="donorProfileId"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {(donorType === 'new' || donorType === 'existing') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="donorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Donor Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Jane Doe" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="donorEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Donor Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="jane@example.com" type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {donorType === 'new' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="donorPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="(123) 456-7890" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mt-2">
                  <FormLabel className="mb-2 block">Mailing Address</FormLabel>
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="donorAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Street Address" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      <FormField
                        control={form.control}
                        name="donorCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="City" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="donorState"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="State" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="donorZip"
                        render={({ field }) => (
                          <FormItem className="md:col-span-1 col-span-2">
                            <FormControl>
                              <Input {...field} placeholder="ZIP" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="donationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Donation Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">General Fund</SelectItem>
                        <SelectItem value="medical">Medical Fund</SelectItem>
                        <SelectItem value="food">Food & Supplies</SelectItem>
                        <SelectItem value="sponsor">Cat Sponsorship</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="campaign">Specific Campaign</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                        <SelectItem value="credit">Credit Card</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="venmo">Venmo</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {form.watch('donationType') === 'campaign' && (
              <FormField
                control={form.control}
                name="campaignId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Campaign</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select campaign" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {campaigns.map(campaign => (
                          <SelectItem key={campaign.id} value={campaign.id}>{campaign.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Campaigns can be linked to specific budget categories
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="budgetCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget category (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None (General Fund)</SelectItem>
                      {budgetCategories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Specify which budget category this donation should be allocated to
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field}
                      placeholder="Additional information about this donation"
                      className="min-h-20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="isRecurring"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Recurring Donation</FormLabel>
                      <FormDescription>
                        Mark if this is a recurring monthly donation
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
                
              <FormField
                control={form.control}
                name="taxReceiptRequired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Tax Receipt Required</FormLabel>
                      <FormDescription>
                        Mark if this donor needs a tax receipt
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Recording..." : "Record Donation"}
            </Button>
          </form>
        </Form>
        
        {isSuccess && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center">
            <Check className="h-5 w-5 mr-2" />
            <span>Donation recorded successfully!</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DonationEntry;
