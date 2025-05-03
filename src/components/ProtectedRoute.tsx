import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/users';
import { getSupabaseClient, checkSupabaseConnection } from '@/integrations/supabase';
import LoadingFallback from './LoadingFallback';
import { logError } from '@/utils/logError';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requiredRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  requiredRoles = []
}) => {
  const { user, session, loading } = useAuth();
  const { toast } = useToast();
  const [showLoader, setShowLoader] = useState(true);
  const [isConnectionChecked, setIsConnectionChecked] = useState(false);
  const location = useLocation();

  // Check connection on mount - might be redundant if AuthProvider handles this
  useEffect(() => {
    const checkConn = async () => {
      await checkSupabaseConnection(); // Uses getSupabaseClient internally
      setIsConnectionChecked(true);
    };
    checkConn();
  }, []);

  // Add a slight delay before showing the loading spinner to prevent flashing
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(loading);
    }, 200);
    
    return () => clearTimeout(timer);
  }, [loading]);

  // If still loading, show loading indicator
  if (showLoader || !isConnectionChecked) {
    console.log('ProtectedRoute: Auth loading or connection not checked yet.');
    // Display a loading indicator while checking auth status or connection
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <LoadingFallback />
      </div>
    );
  }

  // If user is not logged in, redirect to login
  if (!user || !session) {
    console.log('ProtectedRoute: User not authenticated, redirecting to login.');
    // Redirect them to the /login page, but save the current location they were
    return <Navigate to={{ pathname: "/login", state: { from: location } }} />;
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

  // If user is authenticated, check role access if requiredRoles are specified
  if (requiredRoles && requiredRoles.length > 0) {
    // Assuming user object has a 'role' property conforming to UserRole
    const userRole = user.role as UserRole; // Cast might be needed depending on user type
    if (!userRole || !requiredRoles.includes(userRole)) {
      console.log(`ProtectedRoute: User role '${userRole}' does not have access. Redirecting.`);
      logError('Access denied due to role mismatch', { path: location.pathname, requiredRoles, userRole });
      // Redirect to an unauthorized page or home page
      return <Navigate to="/unauthorized" />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
