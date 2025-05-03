
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider, HydrationBoundary } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from './contexts/AuthContext'
import { PageDataProvider } from './contexts/PageDataContext'
import App from './App.tsx'
import './index.css'
import '@fontsource/playfair-display/400.css'
import '@fontsource/playfair-display/600.css'
import '@fontsource/playfair-display/700.css'
import { checkSupabaseSchema } from './integrations/supabase/diagnostics'

// Error Boundary Component to catch initialization errors
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Something went wrong</h1>
          <p>There was an error initializing the application. Please check the console for details.</p>
          <pre>{this.state.error?.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// Define window.__INITIAL_DATA__ type
declare global {
  interface Window {
    __INITIAL_DATA__?: {
      queryClient?: {
        queries: Record<string, { state: { data: any } }>;
      };
      pageData?: any;
    };
    __INITIAL_PATH__?: string;
    checkSupabaseSchema?: () => Promise<string>;
  }
}

// Function to detect and handle query parameters for navigation
const handleInitialNavigation = () => {
  // Check for ?path= parameter which might be used by our redirect system
  const urlParams = new URLSearchParams(window.location.search);
  const redirectPath = urlParams.get('path');
  
  if (redirectPath) {
    // Remove the query parameter to clean up the URL
    window.history.replaceState({}, '', redirectPath);
    console.log('Redirected to:', redirectPath);
  }
  
  // Add a class to indicate JavaScript is loaded
  document.documentElement.classList.add('js');
  document.documentElement.classList.remove('no-js');
  
  // Make the root element visible
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.style.display = 'block';
  }
};

// Run the initial navigation handler
handleInitialNavigation();

// Initialize enhanced client-side navigation
const initializeClientNavigation = () => {
  // Create enhanced client-side navigation
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a');
    
    // Only intercept internal links
    if (link && 
        link.href && 
        link.href.startsWith(window.location.origin) && 
        !link.getAttribute('target') && 
        !link.hasAttribute('download') &&
        !link.hasAttribute('data-no-intercept')) {
      
      e.preventDefault();
      window.history.pushState({}, '', link.href);
      
      // Trigger a navigation event that React Router can listen to
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  });
};

const initializeDynamicElements = () => {
  // Re-initialize any dynamic elements that might not be properly handled by React yet
  // This helps during the transition from static HTML to interactive React
  console.log('Initializing dynamic elements after React hydration');
  
  // Force update any real-time subscription components
  const realTimeElements = document.querySelectorAll('[data-realtime]');
  realTimeElements.forEach(el => {
    el.setAttribute('data-initialized', 'true');
  });
  
  // Remove any static-only event listeners to avoid duplication
  const staticElements = document.querySelectorAll('[data-static-listener]');
  staticElements.forEach(el => {
    el.removeAttribute('data-static-listener');
  });
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const dehydratedState = window.__INITIAL_DATA__?.queryClient || null;
const pageData = window.__INITIAL_DATA__?.pageData || null;

// Initialize client-side navigation enhancement
initializeClientNavigation();

// Remove prerendered SSG content to avoid React hydration mismatch
const ssgContent = document.getElementById('ssg-content');
ssgContent?.parentElement?.removeChild(ssgContent);

// Create the root for React rendering
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  
  // Get initial path from window if available (for direct navigation to subpages)
  const initialPath = window.__INITIAL_PATH__ || '/';
  
  // Render the React app
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <HelmetProvider>
            <QueryClientProvider client={queryClient}>
              <HydrationBoundary state={dehydratedState}>
                <TooltipProvider>
                  <AuthProvider>
                    <PageDataProvider initialData={pageData}>
                      <App />
                    </PageDataProvider>
                  </AuthProvider>
                </TooltipProvider>
              </HydrationBoundary>
            </QueryClientProvider>
          </HelmetProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
  
  // Run initialization after render is complete
  // Using requestAnimationFrame ensures this runs after the next paint
  requestAnimationFrame(() => {
    setTimeout(initializeDynamicElements, 0);
  });
}

// Create a global handler for dynamic element initialization
window.addEventListener('load', () => {
  // Apply any final enhancements after all resources are loaded
  setTimeout(initializeDynamicElements, 100);
});
