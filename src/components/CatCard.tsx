
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

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
  Available: 'bg-emerald-500 text-white', 
  Pending: 'bg-amber-500 text-white',
  Adopted: 'bg-blue-500 text-white'
};

const CatCard: React.FC<CatCardProps> = ({ id, name, imageUrl, age, gender, description, status }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Link to={`/cats/${id}`} className="group block h-full">
        <div className="bg-white rounded-xl overflow-hidden transition-all duration-300 shadow-lg h-full flex flex-col">
          <div className="relative h-64 overflow-hidden">
            <img 
              src={imageUrl || '/placeholder-cat.jpg'} 
              alt={`${name} - ${age} ${gender} cat available for adoption`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="eager"
              width="400"
              height="300"
            />
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {status && (
              <div className="absolute top-4 right-4">
                <Badge className={`${statusColors[status]} shadow-md px-3 py-1 text-xs font-semibold`}>
                  {status}
                </Badge>
              </div>
            )}
          </div>
          <div className="p-5 flex-grow flex flex-col">
            <div className="mb-auto">
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#F97316] transition-colors duration-300">{name}</h3>
              <div className="flex gap-2 mb-3 text-sm text-gray-600">
                <span className="bg-meow-primary/10 px-2 py-0.5 rounded-full text-meow-primary">{age}</span>
                <span>•</span>
                <span className="bg-meow-primary/10 px-2 py-0.5 rounded-full text-meow-primary">{gender}</span>
              </div>
              <p className="text-gray-600 line-clamp-3 mb-4 text-sm">{description}</p>
            </div>
            <div className="mt-auto">
              <button className="w-full py-3 px-4 bg-meow-primary text-white rounded-lg shadow-md transform transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] hover:bg-[#003366]">
                <span className="block transform transition-transform duration-300">Meet {name}</span>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CatCard;
