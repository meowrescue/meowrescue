
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';
import { AppUser } from '../types/auth';

// Define the shape of the AuthContext
interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  isLoading: boolean;
  loading: boolean; // Added to fix ProtectedRoute error
  error?: string;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const currentSession = data.session;
      
      setSession(currentSession);
      setUser(currentSession?.user as AppUser || null);
      setIsLoading(false);
    };

    checkSession();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user as AppUser || null);
      setError(undefined);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Auth functions with proper typing
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setError(error.message);
        throw error;
      }
      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Sign in failed');
      throw error;
    }
  };
  
  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        setError(error.message);
        throw error;
      }
      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Sign up failed');
      throw error;
    }
  };
  
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(error.message);
        throw error;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Sign out failed');
      throw error;
    }
  };

  const value = {
    user,
    session,
    isLoading,
    loading: isLoading, // Added to fix ProtectedRoute error
    error,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
