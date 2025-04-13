
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, session, isLoading } = useAuth();
  const [showLoader, setShowLoader] = useState(true);
  
  // Add a slight delay before showing the loading spinner to prevent flashing
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(isLoading);
    }, 200);
    
    return () => clearTimeout(timer);
  }, [isLoading]);
  
  // If still loading, show loading indicator
  if (showLoader) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
      </div>
    );
  }

  // If user is not logged in, redirect to login
  if (!user || !session) {
    return <Navigate to="/login" />;
  }

  // If admin access required, check user email domain or user role
  if (requireAdmin) {
    const isAdmin = user.email?.endsWith('@meowrescue.org') || 
                   user.role === 'admin';
                   
    if (!isAdmin) {
      return <Navigate to="/" />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
