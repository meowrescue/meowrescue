import React from "react";
import { AlertCircle, Search, CheckCircle } from "lucide-react";

// Function to get badge styling based on status
export const getStatusBadgeClass = (status: string | null | undefined): string => {
  switch (status?.toLowerCase()) {
    case "lost":
      return "bg-red-100 text-red-800 border border-red-200";
    case "found":
      return "bg-amber-100 text-amber-800 border border-amber-200";
    case "reunited":
      return "bg-green-100 text-green-800 border border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-200";
  }
};

// Function to get icon component based on status
export const getStatusIcon = (status: string | null | undefined): React.ReactNode => {
  switch (status?.toLowerCase()) {
    case "lost":
      // Using correct props for Lucide React Icons with self-closing tag
      return <AlertCircle size={16} strokeWidth={2} />;
    case "found":
      return <Search size={16} strokeWidth={2} />;
    case "reunited":
      return <CheckCircle size={16} strokeWidth={2} />;
    default:
      return null;
  }
};

// Function to format date (Includes safe-checks)
export const formatDateForDisplay = (dateString: string | null | undefined): string => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
          return 'Invalid date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      console.error('Error formatting date:', dateString, e);
      return typeof dateString === 'string' ? dateString : 'Invalid date input';
    }
  };
