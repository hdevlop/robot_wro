import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const keyMap = {
   t: 'temperature',
   h: 'humidity',
   b: 'butane',
   c: 'co',
   aq: 'airQuality',
   aqs: 'airQualityStatus',
   lat: 'latitude',
   lng: 'longitude',
   bat: 'batteryLevel',
   chg: 'batteryCharging',
   rs: 'robotStatus'
};

export function parseCompactData(compactData) {
   const expandedData = {};
   Object.keys(compactData).forEach(key => {
      const fullKey = keyMap[key] || key;
      expandedData[fullKey] = compactData[key];
   });
   return expandedData;
}
