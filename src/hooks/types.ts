export interface CompactSensorData {
  t: number|string;      // temperature
  h: number|string;      // humidity
  b: number|string;     // butane
  c: number|string;      // co
  aq: number|string;     // airQuality
  aqs: string;   // airQualityStatus
  lat: number|string;    // latitude
  lng: number|string;    // longitude
  bat: number|string;    // batteryLevel
  chg: boolean;   // batteryCharging
  rs: boolean;    // robotStatus
}

export interface SensorData {
  temperature: number|string;
  humidity: number|string;
  butane: number|string;
  co: number|string;
  airQuality: number|string;
  airQualityStatus: string;
  latitude: number|string;
  longitude: number|string;
  batteryLevel: number|string;
  batteryCharging: boolean;
  robotStatus: boolean;
}

export type SensorMessage = CompactSensorData | SensorData;