
import React from 'react';
import { Facebook, Twitter, Linkedin, Mail, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SocialShareProps {
  url: string;
  title: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ url, title }) => {
  const handleShare = (platform: string) => {
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
      default:
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard');
    }
  };

  return (
    <div className="fixed top-36 left-4 z-30 space-y-2 md:flex hidden flex-col">
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
  );
};

export default SocialShare;
