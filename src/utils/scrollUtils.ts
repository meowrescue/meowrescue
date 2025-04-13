
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

export const scrollToElement = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// Function to scroll to a specific element by class name (first occurrence)
export const scrollToElementByClass = (className: string) => {
  const element = document.getElementsByClassName(className)[0] as HTMLElement;
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// Function to handle smooth anchor links throughout the site
export const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
  e.preventDefault();
  scrollToElement(id);
};

// Initialize smooth scroll for all anchor links on the page
export const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href')?.substring(1);
      if (targetId) {
        scrollToElement(targetId);
      }
    });
  });
};

// Function to scroll to the bottom of an element
export const scrollToBottom = (element: HTMLElement | null) => {
  if (element) {
    element.scrollTop = element.scrollHeight;
  }
};

// Auto scroll chat messages container to bottom
export const autoScrollChatToBottom = (containerSelector: string) => {
  const container = document.querySelector(containerSelector) as HTMLElement;
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
};
