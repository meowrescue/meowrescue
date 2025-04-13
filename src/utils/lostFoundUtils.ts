
import React from "react";
import { AlertCircle, Search, CheckCircle } from "lucide-react";

export const getStatusBadgeClass = (status: string): string => {
  switch (status) {
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

export const getStatusIcon = (status: string): React.ReactNode => {
  switch (status) {
    case "lost":
      return <AlertCircle className="w-4 h-4" />;
    case "found":
      return <Search className="w-4 h-4" />;
    case "reunited":
      return <CheckCircle className="w-4 h-4" />;
    default:
      return null;
  }
};

export const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return 'Unknown date';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    console.error('Error formatting date:', e);
    return dateString;
  }
};
