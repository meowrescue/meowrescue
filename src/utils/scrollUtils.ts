
/**
 * Smooth scrolls to an element with offset for the fixed navbar
 * 
 * @param elementId - The ID of the element to scroll to
 * @param offset - Optional offset (default: 80px to account for navbar)
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
  } else {
    // If no element is found, scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
};

/**
 * Scroll to top of the page
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};
