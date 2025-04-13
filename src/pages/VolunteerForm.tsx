
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '@/components/Layout';
import SectionHeading from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import SEO from '@/components/SEO';

interface VolunteerFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  interestType: string;
  availability: string[];
  experience: string;
  petInfo: string;
  housingType: string;
  agreement: boolean;
}

const VolunteerForm: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<VolunteerFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: user?.email || '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      interestType: 'volunteer',
      availability: [],
      experience: '',
      petInfo: '',
      housingType: '',
      agreement: false,
    },
  });

  const onSubmit = async (data: VolunteerFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Determine application type based on interest
      let applicationType = 'volunteer';
      if (data.interestType === 'foster') {
        applicationType = 'foster';
      } else if (data.interestType === 'both') {
        applicationType = 'volunteer+foster';
      }
      
      // Use RPC function to create application
      const { error } = await supabase
        .rpc('create_application', {
          p_applicant_id: user?.id,
          p_application_type: applicationType,
          p_status: 'pending',
          p_form_data: data
        });
        
      if (error) throw error;
      
      // Show success message
      toast({
        title: "Application Submitted",
        description: "Thank you for your interest in volunteering or fostering! We'll be in touch soon.",
      });
      
      // Reset the form
      form.reset();
    } catch (error: any) {
      toast({
        title: "Submission Error",
        description: error.message || "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEO
        title="Volunteer & Foster Application | Meow Rescue"
        description="Apply to volunteer or foster cats with Meow Rescue. Help us make a difference in the lives of cats in need."
      />
      
      <div className="container mx-auto px-4 py-12 pt-24">
        <SectionHeading
          title="Volunteer & Foster Application"
          subtitle="Join our team and help make a difference in the lives of cats in need"
          centered
        />
        
        <div className="max-w-3xl mx-auto mt-8 bg-white p-8 rounded-lg shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    rules={{ required: "First name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    rules={{ required: "Last name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    rules={{ 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    rules={{ required: "Phone number is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Address Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Address</h3>
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="address"
                    rules={{ required: "Address is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="city"
                      rules={{ required: "City is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="New Port Richey" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      rules={{ required: "State is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="FL">Florida</SelectItem>
                              <SelectItem value="GA">Georgia</SelectItem>
                              <SelectItem value="AL">Alabama</SelectItem>
                              <SelectItem value="SC">South Carolina</SelectItem>
                              <SelectItem value="NC">North Carolina</SelectItem>
                              <SelectItem value="TN">Tennessee</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="zipCode"
                      rules={{ required: "ZIP code is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP Code</FormLabel>
                          <FormControl>
                            <Input placeholder="34653" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              
              {/* Volunteer/Foster Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Role Interest</h3>
                
                <FormField
                  control={form.control}
                  name="interestType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>I am interested in:</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="volunteer" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Volunteering (helping at events, cleaning, socializing cats)
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="foster" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Fostering (providing temporary home for cats/kittens)
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="both" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Both volunteering and fostering
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Experience & Home Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Experience & Home Environment</h3>
                
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Previous Experience with Cats</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please describe any previous experience you have with cats or animal rescue."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="mt-6">
                  <FormField
                    control={form.control}
                    name="petInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Pets</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please list any current pets, including species, breed, age, and whether they're spayed/neutered."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mt-6">
                  <FormField
                    control={form.control}
                    name="housingType"
                    rules={{ required: "Housing information is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Housing Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select housing type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="house">House (Own)</SelectItem>
                            <SelectItem value="house-rent">House (Rent)</SelectItem>
                            <SelectItem value="apartment">Apartment/Condo</SelectItem>
                            <SelectItem value="mobile">Mobile Home</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Agreement */}
              <div>
                <FormField
                  control={form.control}
                  name="agreement"
                  rules={{ required: "You must agree to the terms to continue" }}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I understand that submitting this application does not guarantee acceptance into the volunteer/foster program, and that additional screening may be required.
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              <Button type="submit" variant="meow" size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default VolunteerForm;
