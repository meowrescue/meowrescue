
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import ApplicationHeader from '@/components/ui/ApplicationHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import getSupabaseClient from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 characters.' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters.' }),
  city: z.string().min(2, { message: 'City is required' }),
  state: z.string().min(2, { message: 'State is required' }),
  zipCode: z.string().min(5, { message: 'ZIP code must be at least 5 characters' }),
  dateOfBirth: z.string().min(1, { message: 'Date of birth is required for insurance purposes' }),
  emergencyContactName: z.string().min(2, { message: 'Emergency contact name is required' }),
  emergencyContactPhone: z.string().min(10, { message: 'Emergency contact phone is required' }),
  emergencyContactRelation: z.string().min(2, { message: 'Please specify your relation to emergency contact' }),
  
  // Volunteer Information
  whyVolunteer: z.string().min(10, { message: 'Please tell us why you want to volunteer.' }),
  experience: z.string().optional(),
  availability: z.string().min(10, { message: 'Please describe your availability.' }),
  skills: z.string().optional(),
  preferredAreas: z.array(z.string()).min(1, { message: 'Please select at least one area of interest' }),
  
  // Health and Safety
  hasAllergies: z.enum(['yes', 'no']),
  allergiesDetails: z.string().optional(),
  physicalLimitations: z.enum(['yes', 'no']),
  limitationsDetails: z.string().optional(),
  
  // Legal Requirements
  isOver18: z.boolean().refine(value => value === true, {
    message: 'You must be at least 18 years old to volunteer.',
  }),
  canBackgroundCheck: z.boolean().refine(value => value === true, {
    message: 'Background check consent is required for volunteering with our organization.',
  }),
  hasTransportation: z.boolean(),
  
  // Agreements
  agreesToPolicies: z.boolean().refine(value => value === true, {
    message: 'You must agree to abide by our volunteer policies.',
  }),
  agreesToPhotos: z.boolean().refine(value => value === true, {
    message: 'You must agree to our photo release policy.',
  }),
  agreesToWaiver: z.boolean().refine(value => value === true, {
    message: 'You must agree to the liability waiver.',
  }),
});

type FormData = z.infer<typeof formSchema>;

const VolunteerForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize the form with default values
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: user?.email || '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      dateOfBirth: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelation: '',
      whyVolunteer: '',
      experience: '',
      availability: '',
      skills: '',
      preferredAreas: [],
      hasAllergies: 'no',
      allergiesDetails: '',
      physicalLimitations: 'no',
      limitationsDetails: '',
      isOver18: false,
      canBackgroundCheck: false,
      hasTransportation: false,
      agreesToPolicies: false,
      agreesToPhotos: false,
      agreesToWaiver: false,
    },
  });

  const onSubmit = async (values: FormData) => {
    setIsSubmitting(true);
    try {
      // Submit to Supabase
      const getSupabaseClient() = getSupabaseClient();
      const { error } = await getSupabaseClient().from('applications').insert({
        applicant_id: user?.id,
        application_type: 'volunteer',
        status: 'pending',
        form_data: values,
      });

      if (error) throw error;

      // Show success toast
      toast({
        title: "Application Submitted",
        description: "Your volunteer application has been submitted successfully. We'll contact you soon.",
      });

      // Navigate to thank you or profile page
      navigate('/profile');
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Error",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <SEO 
        title="Volunteer Application | Meow Rescue" 
        description="Apply to become a volunteer at Meow Rescue. Join our team and help make a difference in the lives of cats." 
      />
      
      <ApplicationHeader
        title="Volunteer Application"
        subtitle="Thank you for your interest in volunteering with Meow Rescue. Please complete the form below to apply."
      />
      
      <div className="container mx-auto py-16">
        <Card className="bg-white shadow-lg border-none max-w-3xl mx-auto">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-meow-primary">Personal Information</CardTitle>
            <CardDescription className="text-base">
              Your time and dedication help us save more cats. Please tell us about yourself.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">First Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="Your first name" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Last Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="Your last name" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Email Address*</FormLabel>
                        <FormControl>
                          <Input placeholder="Your email address" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Phone Number*</FormLabel>
                        <FormControl>
                          <Input placeholder="Your phone number" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Street Address*</FormLabel>
                      <FormControl>
                        <Input placeholder="Your street address" {...field} className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">City*</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">State*</FormLabel>
                        <FormControl>
                          <Input placeholder="State" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-base">ZIP Code*</FormLabel>
                        <FormControl>
                          <Input placeholder="ZIP Code" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Date of Birth* (Required for insurance purposes)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <CardHeader className="px-0">
                  <CardTitle className="text-2xl text-meow-primary">Emergency Contact</CardTitle>
                  <CardDescription className="text-base">
                    Please provide information for someone we can contact in case of emergency.
                  </CardDescription>
                </CardHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="emergencyContactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Emergency Contact Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="Full name" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="emergencyContactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Emergency Contact Phone*</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone number" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="emergencyContactRelation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Relationship to Emergency Contact*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Spouse, Parent, Friend" {...field} className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <CardHeader className="px-0">
                  <CardTitle className="text-2xl text-meow-primary">Volunteer Information</CardTitle>
                  <CardDescription className="text-base">
                    Tell us about your interest in volunteering and any relevant experience.
                  </CardDescription>
                </CardHeader>

                <FormField
                  control={form.control}
                  name="whyVolunteer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Why Do You Want to Volunteer?*</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Please tell us why you would like to volunteer at Meow Rescue." className="min-h-40" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Relevant Experience</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Please describe any relevant experience you have, such as working with animals or in a rescue organization." className="min-h-40" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="availability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Availability*</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Please describe your availability, including days and times you are available to volunteer." className="min-h-40" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Skills</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Please list any skills you have that would be helpful to Meow Rescue, such as photography, writing, or social media management." className="min-h-40" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <CardHeader className="px-0">
                  <CardTitle className="text-2xl text-meow-primary">Health & Safety Information</CardTitle>
                  <CardDescription className="text-base">
                    This information helps us ensure your safety while volunteering.
                  </CardDescription>
                </CardHeader>
                
                <FormField
                  control={form.control}
                  name="hasAllergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Do you have any allergies to animals?*</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="yes" />
                            </FormControl>
                            <FormLabel className="font-normal">Yes</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="no" />
                            </FormControl>
                            <FormLabel className="font-normal">No</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {form.watch('hasAllergies') === 'yes' && (
                  <FormField
                    control={form.control}
                    name="allergiesDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Please describe your allergies</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe your allergies and how they may affect your volunteering" {...field} className="min-h-20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="physicalLimitations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Do you have any physical limitations we should be aware of?*</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="yes" />
                            </FormControl>
                            <FormLabel className="font-normal">Yes</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="no" />
                            </FormControl>
                            <FormLabel className="font-normal">No</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {form.watch('physicalLimitations') === 'yes' && (
                  <FormField
                    control={form.control}
                    name="limitationsDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Please describe your limitations</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe any physical limitations that may affect your volunteer work" {...field} className="min-h-20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <CardHeader className="px-0">
                  <CardTitle className="text-2xl text-meow-primary">Legal Requirements</CardTitle>
                  <CardDescription className="text-base">
                    These agreements are necessary for legal and insurance purposes.
                  </CardDescription>
                </CardHeader>
                
                <FormField
                  control={form.control}
                  name="isOver18"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-base">I confirm that I am 18 years of age or older.*</FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="canBackgroundCheck"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-base">I consent to a background check if required for my volunteer role.*</FormLabel>
                        <FormDescription>Background checks may be required for certain volunteer positions involving handling finances, working with vulnerable populations, or representing the organization.</FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="hasTransportation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-base">I have reliable transportation to volunteer activities and events.</FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <CardHeader className="px-0">
                  <CardTitle className="text-2xl text-meow-primary">Agreements & Waivers</CardTitle>
                  <CardDescription className="text-base">
                    Please review and agree to the following terms.
                  </CardDescription>
                </CardHeader>
                
                <FormField
                  control={form.control}
                  name="agreesToPolicies"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-base">I agree to abide by Meow Rescue's volunteer policies and procedures.*</FormLabel>
                        <FormDescription>
                          By checking this box, I confirm that I will comply with all policies, procedures, and guidelines provided to me during orientation and training.
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="agreesToPhotos"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-base">Photo Release: I grant Meow Rescue permission to use photos of me in promotional materials.*</FormLabel>
                        <FormDescription>
                          I hereby grant Meow Rescue permission to use photographs and videos of me taken during volunteer activities for use in promotional materials, social media, website content, and other organizational publications.
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="agreesToWaiver"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-base">Liability Waiver: I understand and accept the risks associated with volunteering.*</FormLabel>
                        <FormDescription>
                          I understand that working with animals carries inherent risks. I willingly assume these risks and release Meow Rescue, its directors, officers, employees, and other volunteers from all liability for any injury, loss, or damage connected with my volunteer activities.
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-12 text-base bg-meow-primary hover:bg-meow-primary/90 text-white"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default VolunteerForm;
