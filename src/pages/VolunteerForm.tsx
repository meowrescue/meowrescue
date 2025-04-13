
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
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 characters.' }),
  availability: z.string().min(10, { message: 'Availability must be at least 10 characters.' }),
  skills: z.string().optional(),
  experience: z.string().optional(),
  reason: z.string().min(10, { message: 'Reason must be at least 10 characters.' }),
  agreement: z.boolean().refine((value) => value === true, {
    message: 'You must agree to the terms and conditions.',
  }),
});

const VolunteerForm: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      availability: '',
      skills: '',
      experience: '',
      reason: '',
      agreement: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Submit to Supabase
      const { error } = await supabase
        .from('volunteer_applications')
        .insert([
          {
            name: values.name,
            email: values.email,
            phone: values.phone,
            availability: values.availability,
            skills: values.skills,
            experience: values.experience,
            reason: values.reason,
            submitted_at: new Date().toISOString()
          }
        ]);
        
      if (error) throw error;

      // Success - show toast and reset form
      toast({
        title: 'Application Submitted',
        description: 'Thank you for your interest in volunteering with Meow Rescue! We will review your application and contact you soon.',
      });
      
      form.reset();
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Application Not Submitted',
        description: 'There was a problem submitting your application. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEO title="Volunteer Application | Meow Rescue" description="Apply to volunteer with Meow Rescue. Help us make a difference in the lives of cats in need in our community." />
      
      <div className="bg-gradient-to-r from-meow-primary/10 to-meow-secondary/10 py-16 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-meow-primary mb-6">Volunteer Application</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please complete the form below to apply to volunteer with Meow Rescue.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto py-16">
        <Card className="bg-white shadow-lg border-none max-w-3xl mx-auto">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-meow-primary">Volunteer Application</CardTitle>
            <CardDescription className="text-base">
              Please fill out the form below to apply to volunteer with Meow Rescue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
                
                <FormField
                  control={form.control}
                  name="availability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Availability</FormLabel>
                      <FormControl>
                        <Textarea placeholder="When are you available to volunteer?" className="min-h-24" {...field} />
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
                      <FormLabel className="text-base">Skills (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Do you have any special skills or experience?" className="min-h-24" {...field} />
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
                      <FormLabel className="text-base">Experience (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Do you have any previous volunteer experience?" className="min-h-24" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Reason</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Why do you want to volunteer with Meow Rescue?" className="min-h-24" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="agreement"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="terms"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium">
                          I agree to the terms and conditions
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting || isSubmitted}
                  className="w-full h-12 text-base bg-meow-primary hover:bg-meow-primary/90 text-white"
                >
                  {isSubmitting ? 'Submitting...' : isSubmitted ? 'Application Submitted' : 'Submit Application'}
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
