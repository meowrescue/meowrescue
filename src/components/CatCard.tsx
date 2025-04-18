
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

interface CatCardProps {
  id: string;
  name: string;
  imageUrl: string;
  age: string;
  gender: string;
  description: string;
  status: 'Available' | 'Pending' | 'Adopted';
}

const CatCard: React.FC<CatCardProps> = ({ 
  id, 
  name, 
  imageUrl, 
  age, 
  gender, 
  description, 
  status 
}) => {
  const statusColors = {
    Available: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Adopted: 'bg-blue-100 text-blue-800'
  };
  
  return (
    <Link 
      to={`/cats/${id}`}
      className="block transition-transform hover:scale-[1.02] duration-200"
    >
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg">
        <div className="relative">
          <img 
            src={imageUrl} 
            alt={`${name} - cat for adoption`} 
            className="w-full h-60 object-cover"
          />
          <div className={`absolute top-4 right-4 py-1 px-3 rounded-full text-xs font-medium ${statusColors[status]}`}>
            {status}
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="text-xl font-bold text-meow-primary">{name}</h3>
          <div className="flex space-x-4 my-2 text-sm text-gray-600">
            <span>{age}</span>
            <span>•</span>
            <span>{gender}</span>
          </div>
          <p className="text-gray-600 mt-2 line-clamp-3">{description}</p>
          
          <div className="mt-5">
            <Button 
              className="w-full bg-meow-primary hover:bg-meow-primary/90"
            >
              Meet {name}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CatCard;
