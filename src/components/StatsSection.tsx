
import React from 'react';
import { Cat, Heart, Home, Award } from 'lucide-react';
import CountUp from './CountUp';

const StatsSection: React.FC = () => {
  return (
    <section className="py-16 bg-meow-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Stat 1 */}
            <div className="text-center">
              <div className="bg-meow-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Cat className="w-8 h-8 text-meow-primary" />
              </div>
              <div className="text-4xl font-bold text-meow-primary mb-2">
                <CountUp end={24} suffix="+" />
              </div>
              <p className="text-gray-600">Cats in Care</p>
            </div>
            
            {/* Stat 2 */}
            <div className="text-center">
              <div className="bg-meow-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-meow-primary" />
              </div>
              <div className="text-4xl font-bold text-meow-primary mb-2">
                <CountUp end={147} />
              </div>
              <p className="text-gray-600">Cats Rescued</p>
            </div>
            
            {/* Stat 3 */}
            <div className="text-center">
              <div className="bg-meow-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-meow-primary" />
              </div>
              <div className="text-4xl font-bold text-meow-primary mb-2">
                <CountUp end={112} />
              </div>
              <p className="text-gray-600">Adoptions</p>
            </div>
            
            {/* Stat 4 */}
            <div className="text-center">
              <div className="bg-meow-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-meow-primary" />
              </div>
              <div className="text-4xl font-bold text-meow-primary mb-2">
                <CountUp end={3} />
              </div>
              <p className="text-gray-600">Years Serving</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
