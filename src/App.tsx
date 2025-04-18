
import React, { Suspense } from 'react';
import { useRoutes } from "react-router-dom";
import { routes } from "./routes";
import Layout from "./components/Layout";

// Loading component for suspense fallback
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
  </div>
);

const App = () => {
  // Use routes directly
  const routing = useRoutes(routes);

  // Special paths that shouldn't have the Layout applied
  const isAdminPath = window.location.pathname.startsWith('/admin');

  return (
    <Suspense fallback={<Loading />}>
      {isAdminPath ? (
        routing
      ) : (
        <Layout>
          {routing}
        </Layout>
      )}
    </Suspense>
  );
};

export default App;
