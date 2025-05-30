'use client'

import { useRobotStore } from "@/stores/robotStore";
import { useMessage, useMqtt } from "await-mqtt/client";
import { useEffect } from "react";

export const useMqttSensors = () => {
   const { isConnected } = useMqtt();
   const { message: sensorMsg } = useMessage(process.env.NEXT_PUBLIC_TOPICS_SENSORS);

   const setSensors = useRobotStore.use.setSensors();
   const setGps = useRobotStore.use.setGps();
   const setBattery = useRobotStore.use.setBattery();
   const setIsBrokerConnected = useRobotStore.use.setIsBrokerConnected();
   const setIsRobotConnected = useRobotStore.use.setIsRobotConnected();
   const addToTerminal = useRobotStore.use.addToTerminal();
   const setCriticalAlarm = useRobotStore.use.setCriticalAlarm();

   const messageHandlers = {
      sensor: (data) => {
         setSensors({
            temperature: data.t,
            humidity: data.h,
            co: data.c,
            airQuality: data.aq
         });

         setGps({
            latitude: data.lat,
            longitude: data.lng
         });

         setBattery({
            level: data.bat,
            charging: data.chg || false
         });

         setIsRobotConnected(data.rs);
      },

      status: (data) => {
         setIsRobotConnected(data.status);
      },

      alarm: (data) => {
         addToTerminal(`🚨 CRITICAL Alarm`);
         setSensors({
            temperature: data.t,
            humidity: data.h,
            co: data.c,
            airQuality: data.aq
         });
         setCriticalAlarm(true);
      }
   };

   useEffect(() => {
      setIsBrokerConnected(isConnected);
   }, [isConnected]);

   useEffect(() => {
      if (sensorMsg) {
         addToTerminal(JSON.stringify(sensorMsg));

         const messageType = sensorMsg.type;
         const messageData = sensorMsg.data;

         if (!messageType || !messageData) return;

         const handler = messageHandlers[messageType];
         if (handler) {
            handler(messageData);
         }
      }
   }, [sensorMsg]);

   return {
      isConnected
   };
};