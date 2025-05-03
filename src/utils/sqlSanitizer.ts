/**
 * SQL Sanitization Utility
 * 
 * This utility provides functions to prevent SQL injection by sanitizing
 * inputs before they're used in database queries.
 */

/**
 * Sanitize a string for use in SQL queries
 * Prevents SQL injection by escaping special characters
 */
export function sanitizeString(input: string | null | undefined): string {
  if (input === null || input === undefined) {
    return '';
  }
  
  // Replace single quotes with double single quotes (SQL standard escaping)
  return input.toString()
    .replace(/'/g, "''")
    .replace(/\\/g, "\\\\"); // Escape backslashes
}

/**
 * Sanitize an array of strings for use in SQL queries
 */
export function sanitizeStringArray(inputs: (string | null | undefined)[]): string[] {
  return inputs.map(sanitizeString);
}

/**
 * Sanitize a database table name or column name
 * Only allows alphanumeric and underscore characters
 */
export function sanitizeIdentifier(identifier: string): string {
  // Only allow alphanumeric and underscore characters in table/column names
  if (!/^[a-zA-Z0-9_]+$/.test(identifier)) {
    throw new Error(`Invalid SQL identifier: ${identifier}`);
  }
  return identifier;
}

/**
 * Safely build a WHERE IN clause with properly sanitized values
 */
export function buildSafeInClause(
  columnName: string, 
  values: (string | number | null | undefined)[]
): string {
  const safeColumn = sanitizeIdentifier(columnName);
  const safeValues = values
    .filter(v => v !== null && v !== undefined)
    .map(v => {
      if (typeof v === 'number') {
        return v.toString();
      }
      return `'${sanitizeString(v as string)}'`;
    });
  
  if (safeValues.length === 0) {
    return `${safeColumn} IS NULL`; // Fallback if no values provided
  }
  
  return `${safeColumn} IN (${safeValues.join(', ')})`;
}

/**
 * Validate and sanitize a SQL sort order parameter
 */
export function sanitizeSortOrder(sortOrder: string): 'asc' | 'desc' {
  const order = sortOrder.toLowerCase();
  if (order !== 'asc' && order !== 'desc') {
    throw new Error(`Invalid sort order: ${sortOrder}. Must be 'asc' or 'desc'.`);
  }
  return order as 'asc' | 'desc';
}

/**
 * Validate and sanitize a pagination limit parameter
 */
export function sanitizeLimit(limit: number, maxLimit = 100): number {
  if (!Number.isInteger(limit) || limit <= 0) {
    throw new Error(`Invalid limit: ${limit}. Must be a positive integer.`);
  }
  
  // Enforce maximum limit to prevent DoS attacks
  return Math.min(limit, maxLimit);
}

export default {
  sanitizeString,
  sanitizeStringArray,
  sanitizeIdentifier,
  buildSafeInClause,
  sanitizeSortOrder,
  sanitizeLimit
};
