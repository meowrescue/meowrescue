
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
      try {
        console.log('Getting session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setError(sessionError.message);
          setLoading(false);
          return;
        }
        
        console.log('Session result:', session ? 'Session found' : 'No session');
        setSession(session);
        
        // If there's a session, fetch the extended user profile
        if (session?.user) {
          console.log('Fetching user profile for ID:', session.user.id);
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (profileError) {
              console.error('Error fetching profile:', profileError);
              // Don't throw here, still set basic user info
            }
            
            // Merge auth user with profile data
            if (profile) {
              console.log('Profile found, merging with user data');
              setUser({
                ...session.user,
                ...profile
              } as ExtendedUser);
            } else {
              // Fall back to basic user if no profile
              console.log('No profile found, using basic user data');
              setUser(session.user as unknown as ExtendedUser);
            }
          } catch (profileErr) {
            console.error('Exception fetching profile:', profileErr);
            setUser(session.user as unknown as ExtendedUser);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Exception in getSession:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event);
      setSession(newSession);
      
      // If there's a session, fetch the extended user profile
      if (newSession?.user) {
        try {
          console.log('Auth change: fetching profile for user ID:', newSession.user.id);
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', newSession.user.id)
            .single();
          
          if (profileError) {
            console.error('Auth change: error fetching profile:', profileError);
            // Don't throw, still set basic user
          }
          
          // Merge auth user with profile data
          if (profile) {
            console.log('Auth change: profile found, merging data');
            setUser({
              ...newSession.user,
              ...profile
            } as ExtendedUser);
          } else {
            // Fall back to basic user if no profile
            console.log('Auth change: no profile, using basic user data');
            setUser(newSession.user as unknown as ExtendedUser);
          }
        } catch (err) {
          console.error('Auth change: exception fetching profile:', err);
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
    setError(null);
    
    try {
      console.info('Attempting to sign in user:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Sign in error:', error);
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      console.log('Sign in successful, user ID:', data.user?.id);
      
      // Log the successful login
      if (data.user) {
        try {
          await logAuth.login(data.user.id, data.user.email || email);
        } catch (logErr) {
          console.error('Error logging authentication:', logErr);
          // Don't fail the login if logging fails
        }
      }
      
      return { success: true };
    } catch (err: any) {
      console.error('Exception during sign in:', err);
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
