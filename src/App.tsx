
import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import DebugInfo from "./components/DebugInfo";

// Component imports
import Index from "./pages/Index";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

// Debug log
console.log('App.tsx is rendering');

const App = () => {
  const [appLoaded, setAppLoaded] = useState(false);
  
  useEffect(() => {
    console.log('App.tsx useEffect is running');
    setAppLoaded(true);
  }, []);
  
  console.log('App component function executing, appLoaded:', appLoaded);
  
  return (
    <>
      {/* Debug component */}
      <DebugInfo />
      
      {/* Debug message directly in DOM */}
      <div className="fixed top-0 left-0 bg-black bg-opacity-75 text-white p-2 m-2 text-xs z-50">
        App loaded: {appLoaded ? 'Yes' : 'No'}
      </div>
      
      {/* Routes - temporary simplified version */}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
