/**
 * Database Connection Monitoring Service
 * 
 * This service provides background monitoring of the Supabase connection
 * and implements recovery strategies for connection issues.
 */

import { getClient, checkConnection } from '@/utils/supabaseClient';
import { logError, ErrorSeverity } from './errorLogging';

// Connection status
export interface ConnectionStatus {
  connected: boolean;
  lastChecked: Date;
  errorCount: number;
  lastError?: string;
}

// Monitoring configuration
interface MonitorConfig {
  checkIntervalMs: number;
  maxRetries: number;
  retryDelayMs: number;
  onConnectionChange?: (status: ConnectionStatus) => void;
}

// Default configuration
const defaultConfig: MonitorConfig = {
  checkIntervalMs: 60000, // Check every minute
  maxRetries: 3,
  retryDelayMs: 3000, // 3 second delay between retries
};

// Current connection status
let connectionStatus: ConnectionStatus = {
  connected: false,
  lastChecked: new Date(),
  errorCount: 0,
};

// Timer reference for background monitoring
let monitorTimer: number | null = null;

/**
 * Initialize the database connection monitor
 */
export function initDatabaseMonitor(config: Partial<MonitorConfig> = {}) {
  const fullConfig = { ...defaultConfig, ...config };
  
  // Check connection immediately
  checkDatabaseConnection(fullConfig);
  
  // Set up periodic checking if in browser environment
  if (typeof window !== 'undefined') {
    // Clear any existing timer
    if (monitorTimer !== null) {
      window.clearInterval(monitorTimer);
    }
    
    // Set up new monitoring interval
    monitorTimer = window.setInterval(() => {
      checkDatabaseConnection(fullConfig);
    }, fullConfig.checkIntervalMs);
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
      if (monitorTimer !== null) {
        window.clearInterval(monitorTimer);
        monitorTimer = null;
      }
    });
  }
  
  return connectionStatus;
}

/**
 * Check database connection and attempt recovery if needed
 */
async function checkDatabaseConnection(config: MonitorConfig): Promise<ConnectionStatus> {
  try {
    // Check connection to Supabase
    const result = await checkConnection();
    
    // Update connection status
    connectionStatus = {
      connected: result.connected,
      lastChecked: new Date(),
      errorCount: result.connected ? 0 : connectionStatus.errorCount + 1,
      lastError: result.connected ? undefined : result.error,
    };
    
    // If connection failed, try recovery
    if (!result.connected && connectionStatus.errorCount <= config.maxRetries) {
      await recoverConnection(config);
    }
    
    // Notify of connection change if callback provided
    if (config.onConnectionChange) {
      config.onConnectionChange(connectionStatus);
    }
    
    return connectionStatus;
  } catch (error) {
    // Log any errors during the check process
    logError(
      error instanceof Error ? error : new Error(`Database connection check failed: ${error}`),
      ErrorSeverity.ERROR,
      { component: 'DatabaseMonitor' }
    );
    
    // Update connection status
    connectionStatus = {
      connected: false,
      lastChecked: new Date(),
      errorCount: connectionStatus.errorCount + 1,
      lastError: error instanceof Error ? error.message : String(error),
    };
    
    // Notify of connection change if callback provided
    if (config.onConnectionChange) {
      config.onConnectionChange(connectionStatus);
    }
    
    return connectionStatus;
  }
}

/**
 * Attempt to recover database connection
 */
async function recoverConnection(config: MonitorConfig): Promise<boolean> {
  try {
    logError(
      `Attempting to recover database connection (attempt ${connectionStatus.errorCount})`,
      ErrorSeverity.WARNING,
      { component: 'DatabaseMonitor' }
    );
    
    // Wait before retry
    await new Promise(resolve => setTimeout(resolve, config.retryDelayMs));
    
    // Force a new client instance
    const supabase = getClient();
    
    // Test connection
    const { data, error } = await supabase.from('donations').select('id').limit(1);
    
    if (error) {
      throw error;
    }
    
    // Connection recovered
    connectionStatus.connected = true;
    connectionStatus.errorCount = 0;
    connectionStatus.lastError = undefined;
    
    logError(
      'Database connection successfully recovered',
      ErrorSeverity.INFO,
      { component: 'DatabaseMonitor' }
    );
    
    return true;
  } catch (error) {
    logError(
      error instanceof Error ? error : new Error(`Connection recovery failed: ${error}`),
      ErrorSeverity.ERROR,
      { component: 'DatabaseMonitor' }
    );
    return false;
  }
}

/**
 * Get current connection status
 */
export function getConnectionStatus(): ConnectionStatus {
  return { ...connectionStatus };
}

/**
 * Force a connection check immediately
 */
export async function checkConnectionNow(): Promise<ConnectionStatus> {
  return checkDatabaseConnection(defaultConfig);
}

export default {
  initDatabaseMonitor,
  getConnectionStatus,
  checkConnectionNow,
};
