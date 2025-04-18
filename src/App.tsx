
import React, { Suspense } from 'react';
import { useRoutes } from "react-router-dom";
import { routes } from "./routes";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Loading component for suspense fallback
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
  </div>
);

const App = () => {
  const routing = useRoutes(routes.map(route => ({
    ...route,
    element: route.element ? (
      <Layout>
        {route.element}
      </Layout>
    ) : null
  })));

  return (
    <Suspense fallback={<Loading />}>
      {routing}
    </Suspense>
  );
};

export default App;
