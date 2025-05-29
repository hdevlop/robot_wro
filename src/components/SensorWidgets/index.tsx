'use client'

import React from 'react';
import SensorWidget from './SensorWidget';
import { useSensors } from '@/stores/robotStore';

const sensorInfo = {
  "temperature": {
    title: "TEMPERATURE",
    icon: "thermometer",
    units: "ºC"
  },
  "humidity": {
    title: "HUMIDITY",
    icon: "humidity",
    units: "%"
  },
  "co": {
    title: "co",
    icon: "co",
    units: "ppm"
  },
  "airQuality": {
    title: "AIR QUALITY",
    icon: "airQuality",
    units: "%"
  }
};

const SensorWidgets = () => {

  const sensorValues = useSensors();

  return (
    <div className='flex gap-4 w-full justify-between'>
      {Object.entries(sensorValues).map(([type, value]) => (
        <SensorWidget
          key={type}
          title={sensorInfo[type].title}
          icon={sensorInfo[type].icon}
          value={value}
          units={sensorInfo[type].units}
        />
      ))}
    </div>
  );
};

export default SensorWidgets;



