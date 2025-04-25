
import React from "react";
import { AlertCircle, Search, CheckCircle, Archive } from "lucide-react";

export const getStatusBadgeClass = (status: string | null | undefined): string => {
  switch (status?.toLowerCase()) {
    case "lost":
      return "bg-red-100 text-red-800 border-red-200";
    case "found":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "reunited":
      return "bg-green-100 text-green-800 border-green-200";
    case "archived":
      return "bg-gray-100 text-gray-600 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getStatusIcon = (status: string | null | undefined): React.ReactNode => {
  switch (status?.toLowerCase()) {
    case "lost":
      return React.createElement(AlertCircle, { size: 16, strokeWidth: 2 });
    case "found":
      return React.createElement(Search, { size: 16, strokeWidth: 2 });
    case "reunited":
      return React.createElement(CheckCircle, { size: 16, strokeWidth: 2 });
    case "archived":
      return React.createElement(Archive, { size: 16, strokeWidth: 2 });
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
