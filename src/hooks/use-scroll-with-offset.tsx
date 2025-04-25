
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollWithOffset = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    // If there's a hash in the URL
    if (hash) {
      // Get the element with the ID that matches the hash
      const element = document.getElementById(hash.substring(1));
      if (element) {
        // Get the navbar height to use as offset
        const navbarHeight = 80; // Height of fixed navbar
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else {
      // Always scroll to top when navigating to a new page without hash
      window.scrollTo(0, 0);
    }
  }, [hash, pathname]);
};
