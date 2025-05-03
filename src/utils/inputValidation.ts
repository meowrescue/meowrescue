/**
 * Input Validation Utility
 * 
 * This utility provides functions for validating and sanitizing user inputs
 * to prevent security vulnerabilities like XSS and injection attacks.
 */

// Validate email addresses
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// Validate phone numbers
export function isValidPhone(phone: string): boolean {
  // Basic phone validation - allows various formats including international
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
}

// Sanitize text input to prevent XSS
export function sanitizeText(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Sanitize HTML (if you need to allow some HTML but prevent XSS)
export function sanitizeHTML(html: string): string {
  if (!html) return '';
  
  // This is a basic sanitizer - for production, consider using a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/onerror|onclick|onload|onmouseover|onmouseout|onfocus|onblur|onkeyup|onkeydown|onkeypress/gi, '');
}

// Validate usernames
export function isValidUsername(username: string): boolean {
  // Only allow alphanumeric characters and underscores, 3-20 characters
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

// Validate passwords for security requirements
export function isSecurePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  
  return { valid: true, message: 'Password is secure' };
}

// Validate URLs
export function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

// Prevent SQL injection in search terms
export function sanitizeSearchQuery(query: string): string {
  if (!query) return '';
  
  // Remove SQL-specific characters
  return query
    .replace(/[;'"\\\-\/]/g, '')
    .replace(/(\s+)/g, ' ')
    .trim();
}

// Validate zip/postal codes
export function isValidZipCode(zipCode: string, country = 'US'): boolean {
  if (country === 'US') {
    // US zip code: 5 digits, optionally followed by hyphen and 4 more digits
    return /^\d{5}(-\d{4})?$/.test(zipCode);
  } else if (country === 'CA') {
    // Canadian postal code: A1A 1A1
    return /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(zipCode);
  }
  
  // Default for other countries - basic alphanumeric check
  return /^[a-zA-Z0-9\s-]{3,10}$/.test(zipCode);
}

// Validate credit card numbers (for donation forms)
export function isValidCreditCard(cardNumber: string): boolean {
  // Remove spaces and dashes
  cardNumber = cardNumber.replace(/[\s-]/g, '');
  
  // Check that it contains only digits
  if (!/^\d+$/.test(cardNumber)) {
    return false;
  }
  
  // Luhn algorithm (mod 10 check)
  let sum = 0;
  let shouldDouble = false;
  
  // Loop through values starting from the rightmost digit
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return (sum % 10) === 0;
}

export default {
  isValidEmail,
  isValidPhone,
  sanitizeText,
  sanitizeHTML,
  isValidUsername,
  isSecurePassword,
  isValidUrl,
  sanitizeSearchQuery,
  isValidZipCode,
  isValidCreditCard
};
