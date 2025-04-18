
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const statusColors = {
  Available: 'bg-green-100 text-green-800', // Changed from orange to green
  Pending: 'bg-yellow-100 text-yellow-800',
  Adopted: 'bg-blue-100 text-blue-800'
};

interface CatCardProps {
  id: string;
  name: string;
  imageUrl: string;
  age: string;
  gender: string;
  description: string;
  status: 'Available' | 'Pending' | 'Adopted';
}

const CatCard: React.FC<CatCardProps> = ({ id, name, imageUrl, age, gender, description, status }) => {
  return (
    <Link 
      to={`/cats/${id}`} 
      className="group"
    >
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col">
        <div className="h-48 overflow-hidden">
          <img 
            src={imageUrl || '/placeholder.svg'} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-4 flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-meow-primary">{name}</h3>
            <Badge className={`${statusColors[status]}`}>
              {status}
            </Badge>
          </div>
          <div className="flex gap-2 mb-3 text-sm text-gray-600">
            <span>{age}</span>
            <span>•</span>
            <span>{gender}</span>
          </div>
          <p className="text-gray-600 line-clamp-2">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export { CatCard };
