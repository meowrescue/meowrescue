
import React from 'react';
import { Facebook, Twitter, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareButtonsProps {
  name: string;
}

const ShareButtons = ({ name }: ShareButtonsProps) => {
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = `Meet ${name} at Meow Rescue`;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`, '_blank');
        break;
    }
  };

  return (
    <>
      {/* Desktop social share icons */}
      <div className="hidden md:flex flex-col space-y-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200 rounded-full shadow-sm w-9 h-9 p-2"
          onClick={() => handleShare('facebook')}
        >
          <Facebook className="h-4 w-4 text-blue-600" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200 rounded-full shadow-sm w-9 h-9 p-2"
          onClick={() => handleShare('twitter')}
        >
          <Twitter className="h-4 w-4 text-sky-500" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200 rounded-full shadow-sm w-9 h-9 p-2"
          onClick={() => handleShare('linkedin')}
        >
          <Linkedin className="h-4 w-4 text-blue-700" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200 rounded-full shadow-sm w-9 h-9 p-2"
          onClick={() => handleShare('email')}
        >
          <Mail className="h-4 w-4 text-gray-600" />
        </Button>
      </div>

      {/* Mobile social share buttons */}
      <div className="md:hidden flex justify-center gap-3 -mt-6 mb-8">
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-primary/10 backdrop-blur-sm hover:bg-primary/20 border border-primary/20 rounded-full shadow-sm w-12 h-12"
          onClick={() => handleShare('facebook')}
        >
          <Facebook className="h-5 w-5 text-blue-600" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-primary/10 backdrop-blur-sm hover:bg-primary/20 border border-primary/20 rounded-full shadow-sm w-12 h-12"
          onClick={() => handleShare('twitter')}
        >
          <Twitter className="h-5 w-5 text-sky-500" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-primary/10 backdrop-blur-sm hover:bg-primary/20 border border-primary/20 rounded-full shadow-sm w-12 h-12"
          onClick={() => handleShare('linkedin')}
        >
          <Linkedin className="h-5 w-5 text-blue-700" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-primary/10 backdrop-blur-sm hover:bg-primary/20 border border-primary/20 rounded-full shadow-sm w-12 h-12"
          onClick={() => handleShare('email')}
        >
          <Mail className="h-5 w-5 text-gray-600" />
        </Button>
      </div>
    </>
  );
};

export default ShareButtons;
