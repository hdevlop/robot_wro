'use client'
import React, { useState } from 'react';
import { Label } from '../ui/label';
import { useMqttCommands } from '@/hooks/useMqttCommands';
import { useSpeed } from '@/stores/robotStore';


const SpeedComponent = () => {

  const { setSpeed } = useMqttCommands();
  const speed = useSpeed();

  const thumbHeight = 28;
  const thumbPosition = speed === 0 ? 0 :
    speed === 100 ? `calc(100% - ${thumbHeight}px)` :
      `calc(${speed}% - ${(speed / 100) * thumbHeight}px)`;

  return (
    <div className="flex flex-col items-center h-full px-4 ">

      <Label className='text-2xl mb-4'>SPEED</Label>

      <div className="relative flex flex-col items-center h-full w-9 py-2 border rounded-lg">

        <div className="absolute bottom-2 w-2 m-auto left-0 right-0 bg-primary rounded-full " style={{ height: `calc(${speed}% - 16px)` }} />
        <div className="absolute w-9 h-7 bg-primary border rounded-lg border-primary m-auto left-0 right-0 shadow-lg " style={{ bottom: thumbPosition }} />

        <input
          type="range"
          min={0}
          max={100}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{
            WebkitAppearance: 'slider-vertical',
            width: '100%',
            height: '100%'
          }}
        />
      </div>

      <Label className='text-2xl text-red-500 mt-4'>{speed}</Label>
    </div>
  );
};

export default SpeedComponent;