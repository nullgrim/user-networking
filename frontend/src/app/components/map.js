"use client";

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import React, { useEffect } from 'react';

const Map = ({ onMapClick }) => {
    useEffect(() => {
      const map = L.map('unique-map-id').setView([0, 0], 2);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  
      // * Set up a click event listener on the map
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        onMapClick({ lat, lng });
      });
  
      // * Cleanup function to remove the map when the component is unmounted
      return () => {
        map.remove();
      };
    }, []);
  
    return <div id="unique-map-id" style={{ height: '200px' }} />;
  };
  
  export default Map;