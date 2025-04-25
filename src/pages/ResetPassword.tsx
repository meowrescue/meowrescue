
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Cat } from 'lucide-react';

// Schema for the email form
const emailSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

// Schema for the password reset form (used after email verification)
const resetSchema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Confirm password is required' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type EmailFormValues = z.infer<typeof emailSchema>;
type ResetFormValues = z.infer<typeof resetSchema>;

const ResetPassword: React.FC = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form for email submission
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  // Form for password reset (after email verification)
  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Handle email form submission
  const onSubmitEmail = async (values: EmailFormValues) => {
    setIsLoading(true);
    try {
      // Use Supabase's password reset functionality
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setEmailSent(true);
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for a link to reset your password.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password reset form submission
  const onSubmitReset = async (values: ResetFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been reset successfully.",
      });

      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reset password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md p-4">
          <CardHeader className="space-y-4">
            <div className="flex flex-col items-center">
              <div className="bg-meow-primary rounded-full p-2 mb-2">
                <Cat className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl">
                <span className="text-meow-primary">Meow</span>
                <span className="text-meow-secondary">Rescue</span>
              </span>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Reset Your Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!emailSent ? (
              // Step 1: Email form
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-6">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Enter your registered email" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending Reset Link...' : 'Send Password Reset Link'}
                  </Button>
                </form>
              </Form>
            ) : (
              // Email sent confirmation
              <div className="space-y-6 text-center">
                <p className="text-gray-600">
                  We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
                </p>
                <p className="text-gray-600">
                  If you don't receive an email within a few minutes, please check your spam folder or try again.
                </p>
                <Button 
                  className="w-full"
                  onClick={() => setEmailSent(false)}
                >
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-center text-sm text-gray-500">
              Remember your password?{" "}
              <Link to="/login" className="text-meow-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default ResetPassword;
