
// I can't directly modify the Layout component as it's read-only,
// So I'll create a new LayoutWithChat component that wraps around it

import React from 'react';
import Layout from '@/components/Layout'; // Original Layout
import ChatWidget from '@/components/ChatWidget';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutWithChatProps {
  children: React.ReactNode;
}

const LayoutWithChat: React.FC<LayoutWithChatProps> = ({ children }) => {
  const { user } = useAuth();
  
  return (
    <>
      <Layout>
        {children}
      </Layout>
      {user && <ChatWidget />}
    </>
  );
};

export default LayoutWithChat;
