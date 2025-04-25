
import React, { createContext, useContext, ReactNode } from 'react';

// Define a type for the context value
export interface PageData {
  [key: string]: any;
}

// Create the context with null as default value
const PageDataContext = createContext<PageData | null>(null);

// Provider component
interface PageDataProviderProps {
  initialData?: PageData | null;
  children: ReactNode;
}

export const PageDataProvider = ({ initialData = null, children }: PageDataProviderProps) => {
  // On client-side, try to get the data from the script tag if available
  const [data] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const scriptEl = document.getElementById('__PAGE_DATA__');
      if (scriptEl) {
        try {
          return JSON.parse(scriptEl.textContent || '{}');
        } catch (e) {
          console.error('Failed to parse page data:', e);
        }
      }
    }
    return initialData;
  });

  return (
    <PageDataContext.Provider value={data}>
      {children}
    </PageDataContext.Provider>
  );
};

// Hook for consuming the context
export const usePageData = () => useContext(PageDataContext);

export default PageDataContext;
