import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import getSupabaseClient from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define form schema with Zod
const formSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip: z.string().min(5, 'ZIP code is required'),
  birthdate: z.string().min(2, 'Date of birth is required'),
  emergencyContactName: z.string().min(2, 'Emergency contact name is required'),
  emergencyContactPhone: z.string().min(10, 'Emergency contact phone is required'),
  volunteerAreas: z.array(z.string()).min(1, 'Please select at least one volunteer area'),
  availability: z.object({
    weekdays: z.boolean(),
    weekends: z.boolean(),
    mornings: z.boolean(),
    afternoons: z.boolean(),
    evenings: z.boolean(),
  }),
  specificAvailability: z.string(),
  experience: z.string(),
  skills: z.string(),
  whyVolunteer: z.string().min(10, 'Please tell us why you want to volunteer'),
  references: z.array(z.object({
    name: z.string(),
    relationship: z.string(),
    phone: z.string(),
  })).optional(),
  backgroundCheck: z.boolean().refine(value => value === true, {
    message: 'You must agree to a background check',
  }),
  photoRelease: z.boolean(),
  liabilityWaiver: z.boolean().refine(value => value === true, {
    message: 'You must agree to the liability waiver',
  }),
  confidentiality: z.boolean().refine(value => value === true, {
    message: 'You must agree to the confidentiality agreement',
  }),
  agreeToTerms: z.boolean().refine(value => value === true, {
    message: 'You must agree to the volunteer terms and conditions',
  }),
});

type FormData = z.infer<typeof formSchema>;

// Define volunteer area options
const volunteerAreas = [
  { id: 'catCare', label: 'Cat Care & Socialization' },
  { id: 'fostering', label: 'Fostering' },
  { id: 'transportation', label: 'Transportation' },
  { id: 'events', label: 'Events & Fundraising' },
  { id: 'photography', label: 'Photography' },
  { id: 'socialMedia', label: 'Social Media' },
  { id: 'administration', label: 'Administrative Support' },
  { id: 'maintenance', label: 'Facility Maintenance' },
  { id: 'other', label: 'Other' },
];

const VolunteerForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

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
      zip: '',
      birthdate: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      volunteerAreas: [],
      availability: {
        weekdays: false,
        weekends: false,
        mornings: false,
        afternoons: false,
        evenings: false,
      },
      specificAvailability: '',
      experience: '',
      skills: '',
      whyVolunteer: '',
      references: [
        { name: '', relationship: '', phone: '' },
        { name: '', relationship: '', phone: '' }
      ],
      backgroundCheck: false,
      photoRelease: false,
      liabilityWaiver: false,
      confidentiality: false,
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Submit to Supabase
      const { error } = await getSupabaseClient().from('applications').insert({
        applicant_id: user?.id,
        application_type: 'volunteer',
        status: 'pending',
        form_data: data,
      });

      if (error) throw error;

      // Show success toast
      toast({
        title: "Application Submitted",
        description: "Your volunteer application has been submitted successfully. We'll contact you soon.",
      });

      // Navigate to thank you page
      navigate('/thank-you-volunteer');
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

  // Handle volunteer area selection changes
  const handleVolunteerAreaChange = (areaId: string, checked: boolean) => {
    let updatedAreas: string[];
    
    if (checked) {
      updatedAreas = [...form.getValues('volunteerAreas'), areaId];
    } else {
      updatedAreas = form.getValues('volunteerAreas').filter(id => id !== areaId);
    }
    
    form.setValue('volunteerAreas', updatedAreas);
    setSelectedAreas(updatedAreas);
  };

  return (
    <Layout>
      <SEO title="Volunteer Application | Meow Rescue" />
      
      <PageHeader
        title="Volunteer Application"
        subtitle="Join our team and help make a difference in the lives of cats"
      />
      
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-4xl">
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Volunteer Application</CardTitle>
            <CardDescription>
              Thank you for your interest in volunteering with Meow Rescue. Please complete all fields below to help us match you with the right volunteer opportunities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your first name" {...field} />
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
                          <FormLabel>Last Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your last name" {...field} />
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
                          <FormLabel>Email*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your email address" {...field} />
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
                          <FormLabel>Phone Number*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="birthdate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth*</FormLabel>
                        <FormDescription>
                          We require this information for insurance purposes. Volunteers under 18 need parental consent.
                        </FormDescription>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address*</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your street address" {...field} />
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
                          <FormLabel>City*</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} />
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
                          <FormLabel>State*</FormLabel>
                          <FormControl>
                            <Input placeholder="State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="zip"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>ZIP Code*</FormLabel>
                          <FormControl>
                            <Input placeholder="ZIP Code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="emergencyContactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Emergency Contact Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter name" {...field} />
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
                          <FormLabel>Emergency Contact Phone*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Volunteer Interests Section */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">Volunteer Interests</h3>
                  
                  <FormField
                    control={form.control}
                    name="volunteerAreas"
                    render={() => (
                      <FormItem>
                        <FormLabel>Areas of Interest*</FormLabel>
                        <FormDescription>
                          Select all areas you're interested in volunteering
                        </FormDescription>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {volunteerAreas.map((area) => (
                            <div key={area.id} className="flex items-center space-x-2">
                              <Checkbox 
                                id={area.id}
                                checked={form.getValues('volunteerAreas').includes(area.id)}
                                onCheckedChange={(checked) => 
                                  handleVolunteerAreaChange(area.id, checked as boolean)
                                }
                              />
                              <label
                                htmlFor={area.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {area.label}
                              </label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <FormLabel>Availability*</FormLabel>
                    <FormDescription>
                      Please select all times you're typically available to volunteer
                    </FormDescription>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      <FormField
                        control={form.control}
                        name="availability.weekdays"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">Weekdays</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="availability.weekends"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">Weekends</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="availability.mornings"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">Mornings</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="availability.afternoons"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">Afternoons</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="availability.evenings"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">Evenings</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="specificAvailability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specific Availability</FormLabel>
                        <FormDescription>
                          Please provide more details about your availability, including specific days and times
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            placeholder="Example: Available Monday and Wednesday evenings from 5-8pm, and Saturday mornings"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Experience and Skills Section */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">Experience and Skills</h3>
                  
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relevant Experience</FormLabel>
                        <FormDescription>
                          Please describe any experience you have with animals or in a volunteer capacity
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            placeholder="Include any volunteer work, animal handling experience, or relevant skills you may have"
                            {...field}
                          />
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
                        <FormLabel>Special Skills</FormLabel>
                        <FormDescription>
                          List any special skills that might be useful (e.g., photography, social media, graphic design, etc.)
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            placeholder="Describe any special skills or talents you can contribute"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="whyVolunteer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Why do you want to volunteer with us?*</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please tell us why you're interested in volunteering with Meow Rescue"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* References Section */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">References</h3>
                  <p className="text-sm text-gray-500">Please provide references who can speak to your character and responsibility (optional)</p>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {[0, 1].map((index) => (
                      <div key={index} className="border p-4 rounded-md">
                        <p className="font-medium mb-2">Reference {index + 1}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <FormField
                            control={form.control}
                            name={`references.${index}.name` as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Reference name" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`references.${index}.relationship` as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Relationship</FormLabel>
                                <FormControl>
                                  <Input placeholder="How you know them" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`references.${index}.phone` as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                  <Input placeholder="Contact number" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Agreements Section */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">Agreements</h3>
                  
                  <FormField
                    control={form.control}
                    name="backgroundCheck"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I agree to a background check if required for my volunteer role*
                          </FormLabel>
                          <FormDescription>
                            Some volunteer positions may require a background check for the safety of our animals and volunteers.
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="photoRelease"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Photo Release (Optional)
                          </FormLabel>
                          <FormDescription>
                            I give permission for Meow Rescue to use photos of me for promotional purposes.
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="liabilityWaiver"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Liability Waiver*
                          </FormLabel>
                          <FormDescription>
                            I understand that volunteering with animals carries inherent risks. I agree to hold Meow Rescue harmless from any liability, loss, cost, or damage that may occur in connection with my volunteer activities. I assume the risk of any injuries that may be sustained while volunteering.
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confidentiality"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Confidentiality Agreement*
                          </FormLabel>
                          <FormDescription>
                            I agree to maintain the confidentiality of all proprietary or privileged information to which I am exposed while serving as a volunteer, including information about animals, adopters, donors, and other volunteers.
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="agreeToTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I agree to the terms and conditions of volunteering*
                          </FormLabel>
                          <FormDescription>
                            By checking this box, I certify that the information provided is true and accurate. I understand that Meow Rescue has the right to refuse any volunteer for any reason. I agree to abide by Meow Rescue's policies and procedures.
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
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
