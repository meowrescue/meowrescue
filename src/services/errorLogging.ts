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
  CRITICAL = 'critical'
}

// Error context information
interface ErrorContext {
  component?: string;
  location?: string;
  user?: string | null;
  additionalData?: Record<string, unknown>;
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
  }

  // In production, you could send to a service like Sentry, LogRocket, etc.
  if (import.meta.env.PROD) {
    // Example of how you could send to a remote service
    // sendToErrorService(errorObj);
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
      ErrorSeverity.ERROR,
      context
    );
    return null;
  }
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
      logError(event.error || event.message, ErrorSeverity.ERROR, {
        location: event.filename,
        additionalData: {
          line: event.lineno,
          column: event.colno
        }
      });
    });
  }
}

export default {
  logError,
  createErrorBoundaryHandler,
  handleAsyncError,
  initializeGlobalErrorHandling,
  ErrorSeverity
};
