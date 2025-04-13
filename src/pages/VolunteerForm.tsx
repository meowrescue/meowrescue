import React, { useState } from 'react';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Define the form schema
const formSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters.' }),
  city: z.string().min(2, { message: 'City must be at least 2 characters.' }),
  state: z.string().min(2, { message: 'State must be at least 2 characters.' }),
  zip: z.string().min(5, { message: 'Zip code must be at least 5 digits.' }),
  availability: z.string().min(10, { message: 'Availability must be at least 10 characters.' }),
  interests: z.string().min(10, { message: 'Interests must be at least 10 characters.' }),
  experience: z.string().optional(),
  agreement: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions.',
  }),
  backgroundCheck: z.boolean().refine((val) => val === true, {
    message: 'You must consent to a background check.',
  }),
  canCommit: z.boolean().refine((val) => val === true, {
    message: 'You must be able to commit to a regular schedule.',
  }),
});

const VolunteerForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      availability: '',
      interests: '',
      experience: '',
      agreement: false,
      backgroundCheck: false,
      canCommit: false,
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Type guard to check if the element is an input element with a checkbox
    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
      form.setValue(e.target.name as any, e.target.checked);
    } else {
      form.setValue(e.target.name as any, e.target.value);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Submit to Supabase - Use 'applications' table with volunteer type
      const { error } = await supabase
        .from('applications')
        .insert([
          {
            applicant_id: (await supabase.auth.getUser()).data.user?.id,
            application_type: 'volunteer',
            status: 'submitted',
            form_data: {
              first_name: values.firstName,
              last_name: values.lastName,
              email: values.email,
              phone: values.phone,
              address: values.address,
              city: values.city,
              state: values.state,
              zip: values.zip,
              availability: values.availability,
              interests: values.interests,
              experience: values.experience,
              agreement: values.agreement,
              background_check: values.backgroundCheck,
              can_commit: values.canCommit,
              submitted_at: new Date().toISOString()
            }
          }
        ]);
        
      if (error) throw error;

      // Success - show toast and reset form
      toast({
        title: 'Application Sent',
        description: 'Thank you for your interest in volunteering with us! We will review your application and get back to you soon.',
      });
      
      form.reset();
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Application Not Sent',
        description: 'There was a problem sending your application. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  
  return (
    <Layout>
      <SEO title="Volunteer | Meow Rescue" description="Join the Meow Rescue team and help us save cats! Fill out our volunteer application form to get started." />
      
      <div className="container mx-auto py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-meow-primary mb-6">Volunteer with Us</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join our dedicated team of volunteers and make a difference in the lives of cats in need. We have a variety of volunteer opportunities available, and we're sure to find a role that's perfect for you!
          </p>
        </div>
        
        <Card className="bg-white shadow-lg border-none max-w-4xl mx-auto">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl">Volunteer Application Form</CardTitle>
            <CardDescription className="text-base">
              Please fill out the form below to apply for a volunteer position.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form id="volunteer-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">First Name</FormLabel>
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
                        <FormLabel className="text-base">Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your last name" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Email</FormLabel>
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
                        <FormLabel className="text-base">Phone</FormLabel>
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
                      <FormLabel className="text-base">Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Your street address" {...field} className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">City</FormLabel>
                        <FormControl>
                          <Input placeholder="Your city" {...field} className="h-12" />
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
                        <FormLabel className="text-base">State</FormLabel>
                        <FormControl>
                          <Input placeholder="Your state" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Zip Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Your zip code" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="availability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Availability</FormLabel>
                      <FormControl>
                        <Textarea placeholder="When are you available to volunteer?" className="min-h-40" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Areas of Interest</FormLabel>
                      <FormControl>
                        <Textarea placeholder="What areas of volunteering are you interested in?" className="min-h-40" {...field} />
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
                      <FormLabel className="text-base">Relevant Experience (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Do you have any relevant experience?" className="min-h-40" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="agreement"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-tight">
                          <FormLabel className="text-base">
                            I agree to the <a href="/terms" className="text-meow-primary underline underline-offset-2">terms and conditions</a>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="backgroundCheck"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-tight">
                          <FormLabel className="text-base">
                            I consent to a background check
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="canCommit"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-tight">
                          <FormLabel className="text-base">
                            I can commit to a regular schedule
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              form="volunteer-form"
              disabled={isSubmitting || isSubmitted}
              className="w-full h-12 text-base"
            >
              {isSubmitting ? 'Submitting...' : isSubmitted ? 'Application Sent' : 'Submit Application'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default VolunteerForm;
