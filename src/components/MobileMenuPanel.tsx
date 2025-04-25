
import React from "react";

interface MobileMenuPanelProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const MobileMenuPanel: React.FC<MobileMenuPanelProps> = ({ children, className = "", style }) => {
  const handlePanelClick = (e: React.MouseEvent) => {
    // This will prevent clicks inside the panel from closing it
    e.stopPropagation();
  };

  return (
    <div
      className={
        `bg-white fixed left-0 right-0 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto 
        animate-fade-in drop-shadow-lg ${className}`.replace(/\s+/g, " ")
      }
      style={{
        borderTopWidth: '0px',
        ...style
      }}
      onClick={handlePanelClick}
      data-mobile-menu-panel
    >
      <div className="container mx-auto px-4 py-4">
        <ul 
          className="flex flex-col space-y-4" 
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </ul>
      </div>
    </div>
  );
};

export default MobileMenuPanel;
