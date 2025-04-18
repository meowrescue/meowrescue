
import React, { createContext, useState, useEffect, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Session, User } from '@supabase/supabase-js';
import { logAuth } from '@/utils/logActivity';
import { supabase } from '@/integrations/supabase/client';
import { User as ExtendedUser } from '@/types/users';

interface AuthContextType {
  session: Session | null;
  user: ExtendedUser | null;
  loading: boolean;
  error: string | null;
  isLoading: boolean; // Added for compatibility
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      // If there's a session, fetch the extended user profile
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        // Merge auth user with profile data
        if (profile) {
          setUser({
            ...session.user,
            ...profile
          } as ExtendedUser);
        } else {
          // Fall back to basic user if no profile
          setUser(session.user as unknown as ExtendedUser);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      
      // If there's a session, fetch the extended user profile
      if (newSession?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', newSession.user.id)
          .single();
        
        // Merge auth user with profile data
        if (profile) {
          setUser({
            ...newSession.user,
            ...profile
          } as ExtendedUser);
        } else {
          // Fall back to basic user if no profile
          setUser(newSession.user as unknown as ExtendedUser);
        }
      } else {
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      console.info('Attempting to sign in user:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      // Log the successful login
      if (data.user) {
        await logAuth.login(data.user.id, data.user.email || email);
      }
      
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred during sign in';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        await logAuth.register(data.user.id, data.user.email || email);
      }

      return { success: true };
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up');
      return { success: false, error: err.message || 'An error occurred during sign up' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Log the logout before actually logging out
      if (user) {
        await logAuth.logout(user.id, user.email || '');
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear user state
      setUser(null);
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      setError(err.message || 'An error occurred during password reset');
      return { success: false, error: err.message || 'An error occurred during password reset' };
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    session,
    user,
    loading,
    error,
    isLoading: loading, // Alias for compatibility
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
