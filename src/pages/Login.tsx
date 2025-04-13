
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
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

interface LoginFormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // This would be replaced with actual Supabase authentication
      console.log('Logging in with:', data);
      
      // Show success message
      toast({
        title: "Login Successful",
        description: "Welcome back to Meow Rescue!",
      });

      // In a real implementation, this would redirect to dashboard or home
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Login to Your Account" 
            subtitle="Access your Meow Rescue profile"
            centered
          />
          
          <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
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
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full bg-meow-primary hover:bg-meow-primary/90">
                  Log In
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-600">
                <Link to="/reset-password" className="text-meow-primary hover:underline">
                  Forgot your password?
                </Link>
              </p>
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-meow-primary hover:underline">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
