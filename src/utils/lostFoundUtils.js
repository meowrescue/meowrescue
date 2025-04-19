
/**
 * Format location string for display
 * @param {Object} location - Location object with lat and lng
 * @returns {string} - Formatted location string
 */
export const formatLocation = (location) => {
  if (!location) return 'Unknown location';
  if (typeof location === 'string') return location;
  
  const { address, city, state, zipCode } = location;
  
  return [
    address,
    city,
    state,
    zipCode
  ].filter(Boolean).join(', ');
};

/**
 * Get relative time for lost/found date
 * @param {string} date - ISO date string
 * @returns {string} - Relative time (e.g., "3 days ago")
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const eventDate = new Date(date);
  const diffTime = Math.abs(now - eventDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
};

/**
 * Get status class based on post status
 * @param {string} status - Status of the post
 * @returns {string} - CSS class for status
 */
export const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'lost':
      return 'bg-red-100 text-red-800';
    case 'found':
      return 'bg-green-100 text-green-800';
    case 'reunited':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Format date for display
 * @param {string} date - ISO date string
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
