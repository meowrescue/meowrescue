/**
 * Security Event Logging Endpoint
 * This serverless function logs security-related events to help detect 
 * potential security issues or attacks
 */

exports.handler = async (event, context) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    // Parse the security event data
    let eventData;
    try {
      eventData = JSON.parse(event.body);
    } catch (error) {
      console.error('Error parsing security event data:', error);
      eventData = { raw: event.body };
    }

    // Log the security event (in production, you should store this in a database)
    console.log('⚠️ SECURITY EVENT DETECTED:');
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      event: eventData,
      headers: event.headers,
      ip: event.headers['x-forwarded-for'] || event.headers['client-ip'],
      userAgent: event.headers['user-agent'],
      // Include geo information if available from Netlify
      geo: event.headers['x-nf-geo'] ? JSON.parse(event.headers['x-nf-geo']) : null
    }, null, 2));

    // Return success
    return {
      statusCode: 204 // No content needed for successful logging
    };
  } catch (error) {
    console.error('Error processing security event:', error);
    
    // Return error
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error processing security event' })
    };
  }
};
