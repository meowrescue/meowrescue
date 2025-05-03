
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import getSupabaseClient, { checkSupabaseConnection } from '@/integrations/supabase/client';
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

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{checked: boolean, connected: boolean, error?: string}>({
    checked: false,
    connected: false
  });
  const { user, session, signIn, isLoading: authLoading, error: authError } = useAuth();

  // Add debug info to console
  useEffect(() => {
    console.log('Login page - Auth state:', { 
      user: user ? 'User exists' : 'No user', 
      session: session ? 'Session exists' : 'No session',
      isLoading: isLoading,
      authLoading: authLoading,
      authError: authError 
    });
  }, [user, session, isLoading, authLoading, authError]);

  // Check Supabase connection on component mount
  useEffect(() => {
    const verifyConnection = async () => {
      try {
        const result = await checkSupabaseConnection();
        setConnectionStatus({
          checked: true,
          connected: result.connected,
          error: result.error
        });
        
        if (!result.connected) {
          console.error('Supabase connection failed:', result.error);
          toast({
            title: "Connection Issue",
            description: "Unable to connect to our services. Please try again later.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error checking connection:', error);
        setConnectionStatus({
          checked: true,
          connected: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    };
    
    verifyConnection();
  }, [toast]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user && !isLoading && !authLoading) {
      console.log("User is logged in, redirecting", user);
      const redirectTo = location.state?.from || (user.email?.endsWith('@meowrescue.org') ? '/admin' : '/profile');
      navigate(redirectTo);
    }
  }, [user, navigate, location.state, isLoading, authLoading]);

  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    console.log("Login attempt with email:", values.email);
    
    if (isLoading || authLoading) {
      console.log("Already processing login, skipping");
      return;
    }
    
    if (!connectionStatus.connected) {
      toast({
        title: "Connection Issue",
        description: "Can't log in due to connection problems. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Calling signIn method with:", values.email);
      const result = await signIn(values.email, values.password);
      console.log("Sign in result:", result);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      toast({
        title: "Login Successful",
        description: "You have been logged in successfully.",
      });
      
      // The redirect will be handled by the useEffect above
      
    } catch (error: any) {
      console.error("Login error:", error);
      
      toast({
        title: "Login Failed",
        description: error.message || "There was a problem with your login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check for and display persistent auth errors
  useEffect(() => {
    if (authError) {
      console.error("Auth context error:", authError);
      toast({
        title: "Authentication Error",
        description: authError,
        variant: "destructive",
      });
    }
  }, [authError, toast]);

  return (
    <Layout>
      <SEO title="Login | Meow Rescue" />
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
            <CardTitle className="text-2xl font-bold text-center">Login to Your Account</CardTitle>
          </CardHeader>
          <CardContent>
            {!connectionStatus.checked ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-meow-primary"></div>
              </div>
            ) : !connectionStatus.connected ? (
              <div className="text-center py-4 text-red-500">
                <p>Unable to connect to our services</p>
                <p className="text-sm mt-2">{connectionStatus.error}</p>
                <Button 
                  className="mt-4" 
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Retry Connection
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
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
                    {isLoading || authLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-sm text-gray-500">
              <Link to="/reset-password" className="text-meow-primary hover:underline">
                Forgot your password?
              </Link>
            </div>
            <div className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/register" className="text-meow-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
