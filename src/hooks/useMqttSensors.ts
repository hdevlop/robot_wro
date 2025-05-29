'use client'

import { useRobotStore } from "@/stores/robotStore";
import { useMessage, useMqtt } from "await-mqtt/client";
import { useEffect } from "react";


export const useMqttSensors = () => {
   const { isConnected, error } = useMqtt();
   const { message: sensorMsg } = useMessage(process.env.NEXT_PUBLIC_TOPICS_SENSORS);
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
      if (sensorMsg) {
         addToTerminal(JSON.stringify(sensorMsg));
         const hasData = sensorMsg.t

         if (sensorMsg.msg && !sensorMsg.t) {
            setIsRobotConnected(sensorMsg.rs);
         }

         if (hasData) {
            setSensors({
               temperature: sensorMsg.t,
               humidity: sensorMsg.h,
               co: sensorMsg.c,
               airQuality: sensorMsg.aq
            });

            setGps({
               latitude: sensorMsg.lat,
               longitude: sensorMsg.lng
            });

            setBattery({
               level: sensorMsg.bat,
               charging: sensorMsg.chg || false
            });

            setIsRobotConnected(sensorMsg.rs);
         }
      }
   }, [sensorMsg]);

   return {
      isConnected
   };
}