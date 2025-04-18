
import React, { useEffect, useRef } from 'react';
import ContactMap from './ContactMap';

const Map = () => {
  return <ContactMap 
    address="7726 US Highway 19, New Port Richey, FL 34652"
    lat={28.2413}
    lng={-82.7274}
    zoom={15}
  />;
};

export default Map;
