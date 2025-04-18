
// Export our main page component for vite-plugin-ssr
export { Page };

import React from 'react';
import App from '../App';

function Page() {
  return <App />;
}
