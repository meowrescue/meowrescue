
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface BusinessHoursContextType {
  isBusinessHours: boolean;
}

// Create context with default value
const BusinessHoursContext = createContext<BusinessHoursContextType>({ isBusinessHours: false });

// Hook to use the business hours context
export const useBusinessHours = () => useContext(BusinessHoursContext);

interface BusinessHoursProviderProps {
  children: ReactNode;
}

export const BusinessHoursProvider: React.FC<BusinessHoursProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [isAdminOnline, setIsAdminOnline] = useState(false);
  
  // Check if current time is within business hours
  // Business hours: Monday-Friday, 9:00 AM to 5:00 PM
  const checkBusinessHours = (): boolean => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hours = now.getHours();
    
    // Business days are Monday (1) through Friday (5)
    const isBusinessDay = day >= 1 && day <= 5;
    
    // Business hours are 9 AM (9) through 5 PM (17)
    const isBusinessTime = hours >= 9 && hours < 17;
    
    return isBusinessDay && isBusinessTime;
  };
  
  // Check if admin is online
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
        setIsAdminOnline(data.role === 'admin');
      } catch (err) {
        console.error("Error in admin check:", err);
        setIsAdminOnline(false);
      }
    };
    
    checkIfAdmin();
  }, [user]);
  
  // Either during business hours OR an admin is online
  const isAvailableForChat = checkBusinessHours() || isAdminOnline;
  
  return (
    <BusinessHoursContext.Provider value={{ isBusinessHours: isAvailableForChat }}>
      {children}
    </BusinessHoursContext.Provider>
  );
};

export default BusinessHoursProvider;
