'use client'

import { useRobotStore } from "@/stores/robotStore";
import { useMessage, useMqtt } from "await-mqtt/client";
import { useEffect } from "react";


export const useMqttSensors = () => {
   const { isConnected, error } = useMqtt();
   const { message: sensorMessage } = useMessage(process.env.NEXT_PUBLIC_TOPICS_SENSORS);
   const setSensors = useRobotStore.use.setSensors();
   const setGps = useRobotStore.use.setGps();
   const setBattery = useRobotStore.use.setBattery();
   const setIsBrokerConnected = useRobotStore.use.setIsBrokerConnected();
   const setIsRobotConnected = useRobotStore.use.setIsRobotConnected();
   const addToTerminal = useRobotStore.use.addToTerminal();

   useEffect(() => {
      if (isConnected) {
         console.log('MQTT connected, subscribing to topics...');
      }
      setIsBrokerConnected(isConnected);
   }, [isConnected]);


   useEffect(() => {
      if (sensorMessage) {
         addToTerminal(JSON.stringify(sensorMessage));
         const hasData =  sensorMessage.t 

         if (hasData) {
            setSensors({
               temperature: sensorMessage.t,
               humidity: sensorMessage.h,
               co: sensorMessage.c,
               airQuality: sensorMessage.aq
            });

            setGps({
               latitude: sensorMessage.lat,
               longitude: sensorMessage.lng
            });

            setBattery({
               level: sensorMessage.bat,
               charging: sensorMessage.chg || false
            });

            setIsRobotConnected(sensorMessage.rs);
         }
      }
   }, [sensorMessage]);

   return {
      isConnected
   };
}