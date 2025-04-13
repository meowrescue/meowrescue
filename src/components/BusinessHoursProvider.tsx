
import React, { createContext, useContext, ReactNode } from 'react';

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
  
  const isBusinessHours = checkBusinessHours();
  
  return (
    <BusinessHoursContext.Provider value={{ isBusinessHours }}>
      {children}
    </BusinessHoursContext.Provider>
  );
};

export default BusinessHoursProvider;
