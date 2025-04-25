
import React from "react";
import { menuGroups, type MenuItem } from "./menuGroups";

interface AdminMobileMenuListProps {
  onNav: (path: string) => void;
}

const AdminMobileMenuList: React.FC<AdminMobileMenuListProps> = ({ onNav }) => (
  <>
    {menuGroups.flatMap((group) => [
      group.label && (
        <li className="mt-2 mb-1 px-2" key={group.id + "-label"}>
          <span className="uppercase tracking-widest text-xs font-semibold text-gray-400">
            {group.label}
          </span>
        </li>
      ),
      ...group.items.map((item) => (
        <li key={item.path}>
          <button
            type="button"
            className="flex items-center w-full text-gray-700 px-2 py-2 rounded-lg font-medium hover:bg-meow-primary/10 hover:text-meow-primary transition justify-start text-base"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation(); // Prevent bubbling
              console.log("Admin menu item clicked:", item.path);
              onNav(item.path);
            }}
          >
            <span className="mr-3">
              {React.createElement(item.icon, { size: 20 })}
            </span>
            <span>{item.label}</span>
          </button>
        </li>
      )),
    ])}
  </>
);

export default AdminMobileMenuList;
