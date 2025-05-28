'use client'
import { useRobotStore } from "@/stores/robotStore";
import { useMessage, useMqtt } from "await-mqtt/client";
import { useEffect } from "react";

const TOPICS = {
   SENSORS: "arduino/sensors",
   COMMANDS: "arduino/commands"
};

export const useMqttSensors = () => {
   const { isConnected, error } = useMqtt();
   const { message: sensorMessage } = useMessage(TOPICS.SENSORS);
   const setSensors = useRobotStore.use.setSensors();
   const setGps = useRobotStore.use.setGps();
   const setBattery = useRobotStore.use.setBattery();
   const setIsConnected = useRobotStore.use.setIsConnected();
   const addToTerminal = useRobotStore.use.addToTerminal();

   useEffect(() => {
      if (isConnected) {
         console.log('MQTT connected, subscribing to topics...');
      }
      setIsConnected(isConnected);
   }, [isConnected, setIsConnected]);


   useEffect(() => {
      if (sensorMessage) {
         addToTerminal(sensorMessage);

         if (sensorMessage.temperature) {
            setSensors({
               temperature: sensorMessage.temperature,
               humidity: sensorMessage.humidity,
               co2: sensorMessage.co2,
               airQuality: sensorMessage.airQuality
            });

            setGps({
               latitude: sensorMessage.latitude,
               longitude: sensorMessage.longitude
            });

            setBattery({
               level: sensorMessage.batteryLevel,
               charging: sensorMessage.batteryCharging || false
            });
         }
      }
   }, [sensorMessage]);

return {
   isConnected
};
}