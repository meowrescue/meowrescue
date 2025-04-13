
"use client";

import React, { createContext, useContext } from "react";

interface SidebarContextType {
  isSidebarOpen: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isSidebarOpen = true; // Always open

  return (
    <SidebarContext.Provider value={{ isSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }
  return context;
}

export const SidebarContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="sidebar-content">{children}</div>;
};
