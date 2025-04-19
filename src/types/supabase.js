
/**
 * @typedef {Object} Database
 * 
 * @typedef {Object} Tables
 * @property {Object} cats - Cats table
 * @property {Object} events - Events table
 * @property {Object} users - Users table
 * @property {Object} lost_found_posts - Lost and found posts table
 * @property {Object} donations - Donations table
 * @property {Object} chat_sessions - Chat sessions table
 * @property {Object} chat_messages - Chat messages table
 */

/**
 * @typedef {Object} LostFoundPost
 * @property {string} id - Unique identifier
 * @property {string} status - Status (lost, found, reunited)
 * @property {string} pet_type - Type of pet
 * @property {string} pet_name - Name of pet
 * @property {string} pet_description - Description of pet
 * @property {string} date - Date pet was lost/found
 * @property {Object} location - Location info
 * @property {string} contact_name - Contact person name
 * @property {string} contact_email - Contact email
 * @property {string} contact_phone - Contact phone
 * @property {string[]} photos - Array of photo URLs
 * @property {boolean} is_resolved - Whether the case is resolved
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 */

export {};
