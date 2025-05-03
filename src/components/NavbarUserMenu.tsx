import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogIn } from "lucide-react";

interface User {
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
}
interface NavbarUserMenuProps {
  user: User | null;
  signOut: () => void;
  getUserInitials: (firstName?: string, lastName?: string) => string;
}

const NavbarUserMenu: React.FC<NavbarUserMenuProps> = ({
  user,
  signOut,
  getUserInitials,
}) => {
  const navigate = typeof window !== 'undefined' ? useNavigate() : null;

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full p-0 h-10 w-10 overflow-hidden">
          <Avatar>
            <AvatarImage src={user.avatar_url || ""} alt={user.first_name || "User"} />
            <AvatarFallback>
              {getUserInitials(user.first_name, user.last_name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2 border-b border-gray-100">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar_url || ""} alt={user.first_name || "User"} />
            <AvatarFallback>{getUserInitials(user.first_name, user.last_name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-medium">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
        <DropdownMenuItem asChild>
          <a 
            href="/profile" 
            className="w-full cursor-pointer"
            onClick={e => {
              if (navigate) {
                e.preventDefault();
                navigate('/profile');
              }
            }}
          >
            Profile
          </a>
        </DropdownMenuItem>

        {(user.role === "admin" || user.email?.endsWith("@meowrescue.org")) && (
          <DropdownMenuItem asChild>
            <a 
              href="/admin" 
              className="w-full cursor-pointer"
              onClick={e => {
                if (navigate) {
                  e.preventDefault();
                  navigate('/admin');
                }
              }}
            >
              Admin Dashboard
            </a>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={signOut} className="cursor-pointer">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <a href="/login">
      <Button variant="ghost" size="sm"
        onClick={e => {
          if (navigate) {
            e.preventDefault();
            navigate('/login');
          }
        }}
      >
        <LogIn className="mr-1 h-4 w-4" /> Login
      </Button>
    </a>
  );
};

export default NavbarUserMenu;
