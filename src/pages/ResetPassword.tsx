
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Layout from '../components/Layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import SectionHeading from '../components/ui/SectionHeading';
import { toast } from "@/hooks/use-toast";

// Create schema validation for password reset form
const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC = () => {
  const [submitted, setSubmitted] = React.useState(false);
  
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      // This would be replaced with actual Supabase password reset
      console.log('Requesting password reset for:', data);
      
      // In a real implementation with Supabase, you would include:
      // const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      //   redirectTo: 'https://yourdomain.com/update-password',
      // });
      // 
      // if (error) throw error;
      
      // Show success message
      toast({
        title: "Reset Email Sent",
        description: "If an account exists with this email, you'll receive reset instructions.",
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: "Request Failed",
        description: "An error occurred. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Reset Your Password" 
            subtitle="We'll send you instructions to reset your password"
            centered
          />
          
          <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            {submitted ? (
              <div className="text-center">
                <div className="mb-4 text-meow-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Check Your Email</h3>
                <p className="text-gray-600 mb-4">
                  We've sent instructions to reset your password. Please check your email inbox.
                </p>
                <p className="text-sm text-gray-500">
                  Didn't receive an email? Check your spam folder or{' '}
                  <button 
                    onClick={() => setSubmitted(false)} 
                    className="text-meow-primary hover:underline"
                  >
                    try again
                  </button>
                </p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full bg-meow-primary hover:bg-meow-primary/90">
                    Send Reset Instructions
                  </Button>
                </form>
              </Form>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                <Link to="/login" className="text-meow-primary hover:underline">
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPassword;
