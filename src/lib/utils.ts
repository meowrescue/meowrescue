
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to preserve scroll position when navigating back
export function navigateBack() {
  window.history.back();
}

// Helper function to get user initials for avatar
export function getUserInitials(firstName?: string, lastName?: string) {
  if (!firstName && !lastName) return 'U';
  const firstInitial = firstName ? firstName.charAt(0) : '';
  const lastInitial = lastName ? lastName.charAt(0) : '';
  return `${firstInitial}${lastInitial}`.toUpperCase();
}

// Helper function to format currency - ALWAYS show exactly 2 decimal places for legal compliance
export function formatCurrency(value: number | string | undefined): string {
  if (value === undefined || value === null || value === "") return '$0.00';
  let num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return '$0.00';
  // Always two decimals, even for whole numbers (e.g., 20 -> 20.00)
  const fixed = Number(num).toFixed(2);
  return `$${fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

// Helper: Restricts a numeric string or number to 2 decimals, and if whole, adds .00
export function restrictToTwoDecimals(input: string | number): string {
  let value = typeof input === "string" ? input : input.toString();
  value = value.replace(/[^0-9.]/g, "");
  // Handle edge: multiple dots
  const parts = value.split(".");
  if (parts.length === 2) {
    parts[1] = parts[1].slice(0, 2);
    value = `${parts[0]}.${parts[1]}`;
  } else if (parts.length > 2) {
    value = `${parts[0]}.${parts[1].slice(0, 2)}`;
  }
  if (value && value.indexOf('.') === -1) value = value + ".00";
  if (value && value.match(/^\d+\.\d$/)) value = value + "0";
  if (value && value.match(/^\d+\.$/)) value = value + "00";
  value = value.replace(/^0+(?!\.)/, '');
  return value;
}

// NEW: Restrict onChange for input fields, returns sanitized value for input element
export function enforceCurrencyInput(value: string): string {
  let out = value.replace(/[^0-9.]/g, "");
  // Only allow one decimal point
  const parts = out.split(".");
  if (parts.length > 2) out = parts[0] + "." + parts[1];
  // Restrict to two decimals
  if (out.includes(".")) {
    const [whole, decimals] = out.split(".");
    out = whole + "." + (decimals?.slice(0, 2) || "");
  }
  // Remove leading zeros unless before decimal
  out = out.replace(/^0+(?!\.)/, "");
  return out;
}
