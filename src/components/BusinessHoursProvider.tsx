import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@integrations/supabase';

interface BusinessHours {
  day: number; // 0 = Sunday, 1 = Monday, etc.
  startHour: number;
  endHour: number;
}

interface BusinessHoursSettings {
  enabled: boolean;
  hours: BusinessHours[];
}

interface BusinessHoursContextType {
  isBusinessHours: boolean;
  isAdminOnline: boolean;
  businessHoursSettings: BusinessHoursSettings;
  updateBusinessHours: (settings: BusinessHoursSettings) => Promise<void>;
}

// Default business hours: Monday-Friday, 9:00 AM to 5:00 PM
const defaultBusinessHours: BusinessHoursSettings = {
  enabled: true,
  hours: [
    { day: 1, startHour: 9, endHour: 17 }, // Monday
    { day: 2, startHour: 9, endHour: 17 }, // Tuesday
    { day: 3, startHour: 9, endHour: 17 }, // Wednesday
    { day: 4, startHour: 9, endHour: 17 }, // Thursday
    { day: 5, startHour: 9, endHour: 17 }, // Friday
  ]
};

// Create context with default value
const BusinessHoursContext = createContext<BusinessHoursContextType>({
  isBusinessHours: false,
  isAdminOnline: false,
  businessHoursSettings: defaultBusinessHours,
  updateBusinessHours: async () => {}, // Placeholder function
});

// Hook to use the business hours context
export const useBusinessHours = () => useContext(BusinessHoursContext);

interface BusinessHoursProviderProps {
  children: ReactNode;
}

export const BusinessHoursProvider: React.FC<BusinessHoursProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [isBusinessHours, setIsBusinessHours] = useState(false);
  const [isAdminOnline, setIsAdminOnline] = useState(false);
  const [businessHoursSettings, setBusinessHoursSettings] = useState<BusinessHoursSettings>(defaultBusinessHours);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch business hours settings from Supabase
  const fetchBusinessHours = async () => {
    try {
      
      const { data, error } = await supabase
        .from('content_blocks')
        .select('content')
        .eq('block_identifier', 'business_hours_settings')
        .single();
      
      if (error) {
        console.log("Using default business hours settings due to:", error.message);
        // Use default settings if table doesn't exist or error occurs
        setBusinessHoursSettings(defaultBusinessHours);
        setIsLoading(false);
        return;
      }
      
      if (data && data.content) {
        try {
          const settings = JSON.parse(data.content);
          setBusinessHoursSettings(settings);
        } catch (parseError) {
          console.log("Using default business hours settings due to parse error");
          // Use default settings if parsing fails
          setBusinessHoursSettings(defaultBusinessHours);
        }
      }
    } catch (err) {
      console.log("Error in business hours fetch, using defaults");
      // Use default settings for any other errors
      setBusinessHoursSettings(defaultBusinessHours);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBusinessHours();
  }, []);
  
  // Update business hours settings in the database
  const updateBusinessHours = async (settings: BusinessHoursSettings) => {
    try {
      
      // First check if the table exists to prevent errors
      const { count, error: checkError } = await supabase
        .from('content_blocks')
        .select('*', { count: 'exact', head: true });
      
      // If the table doesn't exist yet, just update local state
      if (checkError) {
        console.warn("Content blocks table not found, only updating local state:", checkError);
        setBusinessHoursSettings(settings);
        return;
      }
      
      const { error } = await supabase
        .from('content_blocks')
        .upsert({
          block_identifier: 'business_hours_settings',
          content: JSON.stringify(settings),
          page: 'settings',
          updated_by: user?.id
        }, {
          onConflict: 'block_identifier'
        });
      
      if (error) {
        console.error("Error updating business hours settings:", error);
        throw error;
      }
      
      setBusinessHoursSettings(settings);
      return;
    } catch (err) {
      console.error("Error in updateBusinessHours:", err);
      throw err;
    }
  };
  
  // Check if current time is within business hours
  const checkBusinessHours = (): boolean => {
    // If business hours are disabled, always return false
    if (!businessHoursSettings.enabled) {
      return false;
    }
    
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hours = now.getHours();
    
    // Check if current day and time match any business hours
    return businessHoursSettings.hours.some(period => 
      period.day === day && hours >= period.startHour && hours < period.endHour
    );
  };
  
  // Check if admin is online - with graceful error handling
  useEffect(() => {
    if (!user) {
      setIsAdminOnline(false);
      return;
    }

    const checkIfAdmin = async () => {
      try {
        
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error("Error checking admin status:", error);
          setIsAdminOnline(false);
          return;
        }
        
        // Set admin online if the user's role is 'admin'
        setIsAdminOnline(data?.role === 'admin');
      } catch (err) {
        console.error("Error in admin check:", err);
        setIsAdminOnline(false);
      }
    };
    
    checkIfAdmin();
  }, [user]);
  
  // Updated to consider both business hours and admin status
  const isWithinBusinessHours = checkBusinessHours();
  
  return (
    <BusinessHoursContext.Provider value={{ 
      isBusinessHours: isWithinBusinessHours,
      isAdminOnline, 
      businessHoursSettings,
      updateBusinessHours 
    }}>
      {children}
    </BusinessHoursContext.Provider>
  );
};

export default BusinessHoursProvider;
