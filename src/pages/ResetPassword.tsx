
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
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

// Form schemas
const requestResetSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

const confirmResetSchema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Confirm password is required' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RequestResetFormValues = z.infer<typeof requestResetSchema>;
type ConfirmResetFormValues = z.infer<typeof confirmResetSchema>;

const ResetPassword: React.FC = () => {
  const { resetPassword, updatePassword, isLoading } = useAuth();
  const [isResetMode, setIsResetMode] = useState(false);
  const location = useLocation();

  // Check if the URL contains the reset token
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.has('type') && searchParams.get('type') === 'recovery') {
      setIsResetMode(true);
    }
  }, [location]);

  const requestForm = useForm<RequestResetFormValues>({
    resolver: zodResolver(requestResetSchema),
    defaultValues: {
      email: '',
    },
  });

  const confirmForm = useForm<ConfirmResetFormValues>({
    resolver: zodResolver(confirmResetSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onRequestReset = async (values: RequestResetFormValues) => {
    await resetPassword(values.email);
  };

  const onConfirmReset = async (values: ConfirmResetFormValues) => {
    await updatePassword(values.password);
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div>
            <h1 className="text-center text-3xl font-extrabold text-meow-primary">
              {isResetMode ? 'Set New Password' : 'Reset Your Password'}
            </h1>
            <p className="mt-2 text-center text-sm text-gray-600">
              Remember your password?{' '}
              <Link to="/login" className="font-medium text-meow-secondary hover:text-meow-secondary/80">
                Sign in
              </Link>
            </p>
          </div>

          {!isResetMode ? (
            <Form {...requestForm}>
              <form onSubmit={requestForm.handleSubmit(onRequestReset)} className="space-y-6">
                <FormField
                  control={requestForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="you@example.com" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-meow-primary hover:bg-meow-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Sending reset link...
                    </div>
                  ) : (
                    'Send reset link'
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...confirmForm}>
              <form onSubmit={confirmForm.handleSubmit(onConfirmReset)} className="space-y-6">
                <FormField
                  control={confirmForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={confirmForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-meow-primary hover:bg-meow-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Updating password...
                    </div>
                  ) : (
                    'Update password'
                  )}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ResetPassword;
