
import React, { useState, useEffect } from 'react';
import { MessageSquareText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWidget, setShowWidget] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    // Only show the chat widget on public pages, not on admin pages
    const currentPath = location.pathname;
    const isAdminPage = currentPath.startsWith('/admin');
    setShowWidget(!isAdminPage);
  }, [location]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  if (!showWidget) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg w-80 h-96 flex flex-col">
          <div className="bg-meow-primary p-4 text-white rounded-t-lg flex justify-between items-center">
            <h3 className="font-medium">Chat with us</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleChat}
              className="h-8 w-8 p-0 text-white hover:bg-meow-primary/90"
            >
              &times;
            </Button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <p className="text-center text-gray-500 my-4">
              Our chat feature is coming soon! 
              <br />Please contact us through the contact form meanwhile.
            </p>
          </div>
        </div>
      ) : (
        <Button 
          onClick={toggleChat} 
          className="h-12 w-12 rounded-full bg-meow-primary hover:bg-meow-primary/90 flex items-center justify-center"
        >
          <MessageSquareText className="h-6 w-6 text-white" />
        </Button>
      )}
    </div>
  );
};

export default ChatWidget;
