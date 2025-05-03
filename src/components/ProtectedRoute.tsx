import getSupabaseClient from '@/integrations/supabase/client';

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import getSupabaseClient, { checkSupabaseConnection } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, session, loading } = useAuth();
  const { toast } = useToast();
  const [showLoader, setShowLoader] = useState(true);
  const [connectionChecked, setConnectionChecked] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Check Supabase connection
  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log('Checking Supabase connection from ProtectedRoute...');
        const result = await checkSupabaseConnection();
        
        if (!result.connected) {
          console.error('Supabase connection error in ProtectedRoute:', result.error);
          setConnectionError(result.error);
          toast({
            title: "Connection Issue",
            description: "Unable to connect to our services. Some features may not work properly.",
            variant: "destructive",
          });
        } else {
          console.log('Supabase connection successful from ProtectedRoute');
        }
      } catch (err) {
        console.error('Exception checking Supabase connection:', err);
        setConnectionError(err instanceof Error ? err.message : 'Unknown connection error');
      } finally {
        setConnectionChecked(true);
      }
    };
    
    checkConnection();
  }, [toast]);
  
  // Add a slight delay before showing the loading spinner to prevent flashing
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(loading);
    }, 200);
    
    return () => clearTimeout(timer);
  }, [loading]);
  
  // If still loading, show loading indicator
  if (showLoader || !connectionChecked) {
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary mb-4"></div>
        {connectionError && (
          <div className="text-red-500 text-center max-w-md px-4">
            <p>Connection error: {connectionError}</p>
            <p className="mt-2 text-sm">Try refreshing the page or checking your network connection.</p>
          </div>
        )}
      </div>
    );
  }

  // If user is not logged in, redirect to login
  if (!user || !session) {
    console.log("User not logged in, redirecting to login");
    return <Navigate to="/login" />;
  }

  // If admin access required, check user email domain or user role
  if (requireAdmin) {
    const isAdmin = user.email?.endsWith('@meowrescue.org') || 
                   user.role === 'admin';
                   
    if (!isAdmin) {
      console.log("User is not an admin, redirecting to home");
      return <Navigate to="/" />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
