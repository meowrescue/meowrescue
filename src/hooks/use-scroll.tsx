
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to handle smooth scrolling with navbar offset
 */
export const useScrollToElement = (offset: number = 80) => {
  const { hash, pathname } = useLocation();
  
  useEffect(() => {
    // If there's no hash in the URL, scroll to top
    if (!hash) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }
    
    // Delay the scroll slightly to ensure the page is fully loaded
    const timeoutId = setTimeout(() => {
      const element = document.getElementById(hash.slice(1));
      if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [hash, pathname, offset]);
};

/**
 * Scroll to a specific element with navbar offset
 */
export const scrollToElement = (elementId: string, offset: number = 80) => {
  const element = document.getElementById(elementId);
  
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};
