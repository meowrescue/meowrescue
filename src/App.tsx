
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import DebugInfo from "./components/DebugInfo";

// Component imports
import { routes } from './routes';

// Debug log
console.log('App.tsx is rendering');

const App = () => {
  const [appLoaded, setAppLoaded] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    console.log('App.tsx useEffect is running');
    console.log('Current route:', location.pathname);
    setAppLoaded(true);
  }, [location.pathname]);
  
  console.log('App component function executing, appLoaded:', appLoaded);
  
  return (
    <>
      {/* Debug component */}
      <DebugInfo />
      
      {/* Debug message directly in DOM */}
      <div className="fixed top-0 left-0 bg-black bg-opacity-75 text-white p-2 m-2 text-xs z-50">
        App loaded: {appLoaded ? 'Yes' : 'No'} | Path: {location.pathname}
      </div>
      
      {/* Routes - using routes from routes.tsx */}
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </>
  );
};

export default App;
