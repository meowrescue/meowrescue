
// Placeholder for shadcn/ui toast component

import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext({
  toast: () => {},
});

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  
  const toast = (options) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, ...options };
    
    setToasts((prevToasts) => [...prevToasts, newToast]);
    
    if (options.duration !== Infinity) {
      setTimeout(() => {
        setToasts((prevToasts) => 
          prevToasts.filter((toast) => toast.id !== id)
        );
      }, options.duration || 5000);
    }
    
    return {
      id,
      dismiss: () => {
        setToasts((prevToasts) => 
          prevToasts.filter((toast) => toast.id !== id)
        );
      },
    };
  };
  
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Render toasts here */}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const toast = (options) => {
  console.warn('Toast called outside of provider, this is a no-op');
};
