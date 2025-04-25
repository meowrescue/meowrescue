import { getStaticPaths, fetchAllCatIds, fetchAllBlogSlugs, fetchAllEventIds } from '../routes';
import path from 'path';
import fs from 'fs';

/**
 * Fetches and logs information about all static paths.
 * Returns the list of static paths.
 */
async function resolveStaticPaths() {
  let staticPaths = await getStaticPaths();
  console.log(`Found ${staticPaths.length} base static paths to pre-render`);
  
  // Add dynamic paths if possible
  try {
    // Add cat detail paths if the function exists
    if (typeof fetchAllCatIds === 'function') {
      const catIds = await fetchAllCatIds();
      console.log(`Adding ${catIds.length} cat detail paths`);
      for (const id of catIds) {
        staticPaths.push(`/cats/${id}`);
      }
    }
    
    // Add blog post paths if the function exists
    if (typeof fetchAllBlogSlugs === 'function') {
      const blogSlugs = await fetchAllBlogSlugs();
      console.log(`Adding ${blogSlugs.length} blog post paths`);
      for (const slug of blogSlugs) {
        staticPaths.push(`/blog/${slug}`);
      }
    }
    
    // Add event paths if the function exists
    if (typeof fetchAllEventIds === 'function') {
      const eventIds = await fetchAllEventIds();
      console.log(`Adding ${eventIds.length} event detail paths`);
      for (const id of eventIds) {
        staticPaths.push(`/events/${id}`);
      }
    }
  } catch (error) {
    console.error('Error adding dynamic paths:', error);
  }

  // Ensure no duplicate paths
  staticPaths = [...new Set(staticPaths)];
  
  console.log(`Total of ${staticPaths.length} paths to pre-render after adding dynamic routes`);
  console.log('Sample paths:', staticPaths.slice(0, 5), '...');
  
  return staticPaths;
}

export { resolveStaticPaths };
