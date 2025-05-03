import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import getSupabaseClient from '@/integrations/getSupabaseClient()/client';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { Cat } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, user, isLoading: authLoading } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user && !isLoading && !authLoading) {
      navigate('/profile');
    }
  }, [user, navigate, isLoading, authLoading]);

  // Fix the signUp call that has too many arguments
  const handleSignUp = async (values: z.infer<typeof formSchema>) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const result = await signUp(values.email, values.password);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      toast({
        title: "Registration Successful",
        description: "Please verify your email to log in.",
      });
      
      // Redirect to login page
      navigate('/login');
      
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "There was a problem with your registration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <SEO title="Register | Meow Rescue" />
      <div className="flex items-center justify-center h-screen bg-gray-100">
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
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Email</Label>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Password</Label>
                      <FormControl>
                        <Input placeholder="Password" {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading || authLoading} className="w-full" type="submit">
                  {isLoading || authLoading ? "Signing up..." : "Sign Up"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-meow-primary hover:underline">
                Log in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Register;
