
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/users';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData?: any) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("Setting up auth state listener...");
    
    // Set up auth state change listener first
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event, newSession?.user?.id);
      
      if (event === 'SIGNED_IN' && newSession) {
        setSession(newSession);
        await fetchUserProfile(newSession);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
      } else if (event === 'PASSWORD_RECOVERY') {
        // Handle password recovery event
        console.log('Password recovery initiated');
      }
    });
    
    // Then check active session
    const checkUser = async () => {
      try {
        console.log("Checking for existing session...");
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          console.log("Found existing session:", data.session.user?.id);
          setSession(data.session);
          await fetchUserProfile(data.session);
        } else {
          console.log("No existing session found");
          setIsLoading(false);
        }
      } catch (error: any) {
        console.error('Error checking user session:', error);
        setError(error);
        setIsLoading(false);
      }
    };

    checkUser();

    return () => {
      console.log("Cleaning up auth listener");
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  // Helper function to fetch user profile
  const fetchUserProfile = async (currentSession: Session) => {
    if (!currentSession.user) {
      setIsLoading(false);
      return;
    }
    
    try {
      console.log("Fetching user profile for:", currentSession.user.id);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentSession.user.id)
        .single();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        throw profileError;
      }
        
      if (profileData) {
        console.log("Profile found:", profileData);
        setUser({
          id: currentSession.user.id,
          email: currentSession.user.email || '',
          ...profileData
        });
      } else {
        console.log("No profile found, using basic user data");
        // If profile doesn't exist, set basic user data
        setUser({
          id: currentSession.user.id,
          email: currentSession.user.email || '',
          role: currentSession.user.email?.endsWith('@meowrescue.org') ? 'admin' : 'user',
          is_active: true,
          created_at: currentSession.user.created_at || new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      
      // If profile doesn't exist, set basic user data
      setUser({
        id: currentSession.user.id,
        email: currentSession.user.email || '',
        role: currentSession.user.email?.endsWith('@meowrescue.org') ? 'admin' : 'user',
        is_active: true,
        created_at: currentSession.user.created_at || new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      console.log("Sign in attempt for:", email);
      setIsLoading(true);
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error("Sign in error:", error);
        throw error;
      }
      
      console.log("Sign in successful:", data);
      return data;
      // Session will be handled by the onAuthStateChange listener
    } catch (error: any) {
      console.error("Sign in catch error:", error);
      setError(error);
      throw error;
    } finally {
      // We'll set loading to false in the fetchUserProfile function
      // This prevents the UI from flickering if the user is redirected quickly
      setTimeout(() => {
        if (isLoading) {
          console.log("Setting isLoading to false after timeout");
          setIsLoading(false);
        }
      }, 3000);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      console.log("Sign up attempt for:", email);
      setIsLoading(true);
      const { error, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: userData
        }
      });
      
      if (error) {
        console.error("Sign up error:", error);
        throw error;
      }
      
      console.log("Sign up successful:", data);
      return data;
    } catch (error: any) {
      console.error("Sign up catch error:", error);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      console.log("Sign out attempt");
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        throw error;
      }
      
      console.log("Sign out successful");
      // State will be updated by the onAuthStateChange listener
    } catch (error: any) {
      console.error("Sign out catch error:", error);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password - sends reset email
  const resetPassword = async (email: string) => {
    try {
      console.log("Password reset attempt for:", email);
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        console.error("Password reset error:", error);
        throw error;
      }
      
      console.log("Password reset email sent");
    } catch (error: any) {
      console.error("Password reset catch error:", error);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update password - used after reset link is clicked
  const updatePassword = async (password: string) => {
    try {
      console.log("Update password attempt");
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        console.error("Update password error:", error);
        throw error;
      }
      
      console.log("Password updated successfully");
    } catch (error: any) {
      console.error("Update password catch error:", error);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
