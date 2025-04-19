
import React from 'react';

export const Tabs: React.FC<{
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}> = ({ defaultValue, className, children }) => {
  return <div className={className}>{children}</div>;
};

export const TabsList: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => {
  return <div className={className}>{children}</div>;
};

export const TabsTrigger: React.FC<{
  value: string;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return <button>{children}</button>;
};

export const TabsContent: React.FC<{
  value: string;
  className?: string;
  children: React.ReactNode;
}> = ({ value, className, children }) => {
  return <div className={className}>{children}</div>;
};
