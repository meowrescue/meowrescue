
import React from 'react';
import { Sheet, SheetContent } from '../ui/sheet';
import AdminSidebar from './AdminSidebar';

interface AdminSidebarDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdminSidebarDrawer: React.FC<AdminSidebarDrawerProps> = ({ 
  open, 
  onOpenChange 
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 w-72">
        <AdminSidebar />
      </SheetContent>
    </Sheet>
  );
};

export default AdminSidebarDrawer;
