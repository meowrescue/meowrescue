
import React from 'react';

const StatsSection: React.FC = () => {
  return (
    <section className="py-12 bg-meow-primary text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="animate-fade-in">
            <div className="text-4xl md:text-5xl font-bold mb-2">24+</div>
            <p className="text-lg">Cats Currently in Care</p>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-4xl md:text-5xl font-bold mb-2">100+</div>
            <p className="text-lg">Cats Rescued</p>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-4xl md:text-5xl font-bold mb-2">75+</div>
            <p className="text-lg">Happy Adoptions</p>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="text-4xl md:text-5xl font-bold mb-2">$1K</div>
            <p className="text-lg">Monthly Food Costs</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
