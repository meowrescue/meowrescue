/**
 * Centralized Error Logging Service
 * 
 * This service provides standardized error logging and handling
 * without affecting the visual appearance of the application.
 */

// Error severity levels
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
  SECURITY = 'security' // New severity level for security-related events
}

// Error context information
interface ErrorContext {
  component?: string;
  location?: string;
  user?: string | null;
  additionalData?: Record<string, unknown>;
  securityRelevant?: boolean; // Flag to indicate security-relevant errors
}

/**
 * Log an error with standardized formatting and severity level
 */
export function logError(
  error: Error | string,
  severity: ErrorSeverity = ErrorSeverity.ERROR,
  context: ErrorContext = {}
): void {
  // Create a standardized error object
  const errorObj = {
    message: error instanceof Error ? error.message : error,
    timestamp: new Date().toISOString(),
    severity,
    stack: error instanceof Error ? error.stack : undefined,
    ...context
  };

  // Log to console with appropriate level
  switch (severity) {
    case ErrorSeverity.INFO:
      console.info(`[INFO] ${errorObj.message}`, errorObj);
      break;
    case ErrorSeverity.WARNING:
      console.warn(`[WARNING] ${errorObj.message}`, errorObj);
      break;
    case ErrorSeverity.ERROR:
      console.error(`[ERROR] ${errorObj.message}`, errorObj);
      break;
    case ErrorSeverity.CRITICAL:
      console.error(`[CRITICAL] ${errorObj.message}`, errorObj);
      // Could add additional handling for critical errors
      break;
    case ErrorSeverity.SECURITY:
      console.error(`[SECURITY] ${errorObj.message}`, errorObj);
      // Security events should be logged more prominently
      logSecurityEvent(errorObj);
      break;
  }

  // In production, you could send to a service like Sentry, LogRocket, etc.
  if (import.meta.env.PROD) {
    // Example of how you could send to a remote service
    // sendToErrorService(errorObj);
  }
}

/**
 * Log a security-specific event
 * This handles security-relevant errors and events separately
 */
export function logSecurityEvent(
  eventData: Record<string, any>
): void {
  // In a production environment, you might want to:
  // 1. Store these separately from regular errors
  // 2. Alert administrators
  // 3. Possibly block suspicious behavior

  // For now, we'll just log it with special formatting
  console.group('🔐 SECURITY EVENT DETECTED');
  console.error(JSON.stringify(eventData, null, 2));
  console.groupEnd();

  // In production, you would send this to a security monitoring service
  if (import.meta.env.PROD) {
    try {
      // Example: Send to your Netlify function endpoint
      if (typeof window !== 'undefined' && 'fetch' in window) {
        fetch('/api/security-event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData)
        }).catch(err => console.error('Failed to report security event:', err));
      }
    } catch (err) {
      console.error('Error sending security event report:', err);
    }
  }
}

/**
 * Create an error boundary handler function
 */
export function createErrorBoundaryHandler(componentName: string) {
  return (error: Error, info: { componentStack: string }) => {
    logError(error, ErrorSeverity.ERROR, {
      component: componentName,
      additionalData: { componentStack: info.componentStack }
    });
  };
}

/**
 * Handle Promise rejections in async functions
 */
export async function handleAsyncError<T>(
  promise: Promise<T>,
  errorMessage: string,
  context: ErrorContext = {}
): Promise<T | null> {
  try {
    return await promise;
  } catch (error) {
    logError(
      error instanceof Error ? error : new Error(`${errorMessage}: ${error}`),
      context.securityRelevant ? ErrorSeverity.SECURITY : ErrorSeverity.ERROR,
      context
    );
    return null;
  }
}

/**
 * Log a security-specific error or suspicious activity
 */
export function logSecurityIssue(
  issue: string | Error,
  context: ErrorContext = {}
): void {
  logError(issue, ErrorSeverity.SECURITY, {
    ...context,
    securityRelevant: true
  });
}

// Set up global error handlers
export function initializeGlobalErrorHandling(): void {
  if (typeof window !== 'undefined') {
    // Handle unhandled Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      logError(event.reason || 'Unhandled Promise rejection', ErrorSeverity.ERROR, {
        location: 'unhandledrejection'
      });
    });

    // Handle uncaught exceptions
    window.addEventListener('error', (event) => {
      // Check if this might be security-relevant (e.g., CORS errors often are)
      const isCORSError = event.message && (
        event.message.includes('CORS') || 
        event.message.includes('cross-origin')
      );
      
      logError(event.error || event.message, 
        isCORSError ? ErrorSeverity.SECURITY : ErrorSeverity.ERROR, 
        {
          location: event.filename,
          securityRelevant: isCORSError,
          additionalData: {
            line: event.lineno,
            column: event.colno
          }
        }
      );
    });
  }
}

export default {
  logError,
  createErrorBoundaryHandler,
  handleAsyncError,
  initializeGlobalErrorHandling,
  logSecurityEvent,
  logSecurityIssue,
  ErrorSeverity
};
