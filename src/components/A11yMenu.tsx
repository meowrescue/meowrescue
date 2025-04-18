import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Accessibility, ZoomIn, MousePointerClick } from 'lucide-react';
import { useA11y } from './A11yProvider';
import { Switch } from '@/components/ui/switch';

export const A11yMenu: React.FC = () => {
  const { highContrast, largeText, reducedMotion, toggleHighContrast, toggleLargeText, toggleReducedMotion } = useA11y();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Accessibility options">
          <Accessibility className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Accessibility Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="flex items-center justify-between cursor-default">
          <div className="flex items-center gap-2">
            <ZoomIn className="h-4 w-4" />
            <span>Larger Text</span>
          </div>
          <Switch 
            checked={largeText} 
            onCheckedChange={toggleLargeText}
            aria-label="Toggle larger text"
          />
        </DropdownMenuItem>
        
        <DropdownMenuItem className="flex items-center justify-between cursor-default">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor" />
              <path d="M12 6v12" stroke="currentColor" strokeWidth="2" />
              <path d="M6 12h12" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span>High Contrast</span>
          </div>
          <Switch 
            checked={highContrast} 
            onCheckedChange={toggleHighContrast}
            aria-label="Toggle high contrast"
          />
        </DropdownMenuItem>
        
        <DropdownMenuItem className="flex items-center justify-between cursor-default">
          <div className="flex items-center gap-2">
            <MousePointerClick className="h-4 w-4" />
            <span>Reduce Motion</span>
          </div>
          <Switch 
            checked={reducedMotion} 
            onCheckedChange={toggleReducedMotion}
            aria-label="Toggle reduced motion"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) ;
};
