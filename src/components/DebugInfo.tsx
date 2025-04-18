
import React, { useEffect, useState } from 'react';

const DebugInfo: React.FC = () => {
  const [routeInfo, setRouteInfo] = useState('Initializing...');
  const [windowInfo, setWindowInfo] = useState({
    width: 0,
    height: 0,
    url: '',
  });
  const [componentState, setComponentState] = useState('Mounting...');

  useEffect(() => {
    // Log component mount
    console.log('DebugInfo component mounted');
    setComponentState('Mounted');
    
    // Update window info
    const updateWindowInfo = () => {
      setWindowInfo({
        width: window.innerWidth,
        height: window.innerHeight,
        url: window.location.href,
      });
    };
    
    // Set route info
    setRouteInfo(`Current route: ${window.location.pathname}`);
    
    // Add window resize listener
    updateWindowInfo();
    window.addEventListener('resize', updateWindowInfo);
    
    // Clean up
    return () => {
      console.log('DebugInfo component unmounting');
      window.removeEventListener('resize', updateWindowInfo);
    };
  }, []);

  return (
    <div className="fixed bottom-0 right-0 bg-black bg-opacity-75 text-white p-4 m-4 rounded-lg z-50 text-xs">
      <h3 className="font-bold">Debug Info</h3>
      <div>Component: {componentState}</div>
      <div>{routeInfo}</div>
      <div>Window: {windowInfo.width}x{windowInfo.height}</div>
      <div>URL: {windowInfo.url}</div>
    </div>
  );
};

export default DebugInfo;
