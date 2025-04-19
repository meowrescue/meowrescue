import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "./ui/badge.js";

interface CatCardProps {
  id: string;
  name: string;
  imageUrl: string;
  age: string;
  gender: string;
  description: string;
  status: 'Available' | 'Pending' | 'Adopted';
}

const statusColors = {
  Available: 'bg-green-100 text-green-800', // Changed from orange to green
  Pending: 'bg-yellow-100 text-yellow-800',
  Adopted: 'bg-blue-100 text-blue-800'
};

const CatCard: React.FC<CatCardProps> = ({ id, name, imageUrl, age, gender, description, status }) => {
  return (
    <Link to={`/cats/${id}`} className="group block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col">
        <div className="relative h-64 overflow-hidden">
          <img 
            src={imageUrl || '/placeholder-cat.jpg'} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {status && (
            <div className="absolute top-4 right-4">
              <Badge className={statusColors[status]}>
                {status}
              </Badge>
            </div>
          )}
        </div>
        <div className="p-4 flex-grow">
          <h3 className="text-xl font-semibold text-meow-primary">{name}</h3>
          <div className="flex gap-2 mb-3 text-sm text-gray-600">
            <span>{age}</span>
            <span>•</span>
            <span>{gender}</span>
          </div>
          <p className="text-gray-600 line-clamp-3">{description}</p>
        </div>
        <div className="p-4 pt-0">
          <button className="w-full py-2 px-4 bg-meow-primary text-white rounded-md hover:bg-meow-primary/90 transition-colors">
            Meet {name}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default CatCard;
