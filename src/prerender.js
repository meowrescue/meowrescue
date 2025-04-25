// Import the preRenderRoutes function
import { preRenderRoutes } from './prerender/preRenderRoutes.js';

console.log("Pre-rendering all routes");
preRenderRoutes();

export { preRenderRoutes };
