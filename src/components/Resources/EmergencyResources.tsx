
import React from 'react';

const EmergencyResources = () => {
  return (
    <div className="bg-gray-50 p-8 rounded-lg mb-16">
      <h2 className="text-2xl font-bold text-meow-primary mb-6 text-center">Emergency Resources</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-meow-primary">Emergency Veterinary Clinics</h3>
          <ul className="space-y-4">
            <li className="bg-white p-4 rounded shadow-sm">
              <strong className="block text-meow-primary">BluePearl Pet Hospital</strong>
              <p className="text-sm text-gray-600">3000 Busch Lake Blvd, Tampa, FL 33614</p>
              <p className="text-sm text-gray-600">(813) 933-8944</p>
              <p className="text-sm text-gray-600">Open 24/7</p>
            </li>
            <li className="bg-white p-4 rounded shadow-sm">
              <strong className="block text-meow-primary">Animal Emergency of Pasco</strong>
              <p className="text-sm text-gray-600">7121 State Road 54, New Port Richey, FL 34653</p>
              <p className="text-sm text-gray-600">(727) 849-9999</p>
              <p className="text-sm text-gray-600">Evenings, weekends, and holidays</p>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3 text-meow-primary">Poison Control</h3>
          <ul className="space-y-4">
            <li className="bg-white p-4 rounded shadow-sm">
              <strong className="block text-meow-primary">ASPCA Animal Poison Control Center</strong>
              <p className="text-sm text-gray-600">(888) 426-4435</p>
              <p className="text-sm text-gray-600">24/7 Emergency Hotline (fee may apply)</p>
            </li>
            <li className="bg-white p-4 rounded shadow-sm">
              <strong className="block text-meow-primary">Pet Poison Helpline</strong>
              <p className="text-sm text-gray-600">(855) 764-7661</p>
              <p className="text-sm text-gray-600">24/7 Emergency Hotline (fee may apply)</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmergencyResources;
