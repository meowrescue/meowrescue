/**
 * CSP Violation Reporting Endpoint
 * This serverless function logs CSP violations to help detect potential attacks
 * or misconfigured resources.
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
    // Parse the CSP violation report
    let reportData;
    try {
      reportData = JSON.parse(event.body);
    } catch (error) {
      console.error('Error parsing CSP report:', error);
      reportData = { raw: event.body };
    }

    // Log the violation (in production, you might want to store these in a database)
    console.log('CSP Violation Report:');
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      report: reportData,
      headers: event.headers,
      ip: event.headers['x-forwarded-for'] || event.headers['client-ip'],
      userAgent: event.headers['user-agent']
    }, null, 2));

    // Return success
    return {
      statusCode: 204 // No content needed for successful logging
    };
  } catch (error) {
    console.error('Error processing CSP report:', error);
    
    // Return error
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error processing CSP report' })
    };
  }
};
