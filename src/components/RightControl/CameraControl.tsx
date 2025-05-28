'use client'
import React from 'react';
import { ControlButton } from '../ControlButtons/ControlButton';
import { ChamferContainer } from '../ChamferContainer';
import { Label } from '../ui/label';
import { useMqttCommands } from '@/hooks/useMqttCommands';
import { useCameraPan, useCameraTilt, useCameraNightVision, useCameraTracking } from '@/stores/robotStore';

const HorizontalSlider = ({ value, onChange, label, max = 180 }) => {
   const thumbWidth = 10;
   const thumbPosition = value === 0 ? 0 :
      value === max ? `calc(100% - ${thumbWidth}px)` :
         `calc(${(value / max) * 100}% - ${((value / max) * thumbWidth)}px)`;

   return (
      <div className="flex items-center gap-2 w-full ">
         <Label className='text-sm  '>{label}</Label>
         <div className="relative flex items-center w-48 h-6 px-2 border  rounded-lg bg-black/50">
            <div
               className="absolute left-2 h-2 top-0 bottom-0 m-auto bg-primary rounded-full"
               style={{ width: `calc(${(value / max) * 100}% - 8px)` }}
            />
            <div
               className="absolute w-4 h-6 bg-primary border rounded-md border-primary top-0 bottom-0 m-auto shadow-lg"
               style={{ left: thumbPosition }}
            />
            <input
               type="range"
               min={0}
               max={max}
               value={value}
               onChange={(e) => onChange(Number(e.target.value))}
               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
         </div>
         <Label className='text-lg min-w-8 w-8'>{value}°</Label>
      </div>
   );
};

const CameraControl = () => {
   // Get camera state from store
   const pan = useCameraPan();
   const tilt = useCameraTilt();
   const nightVision = useCameraNightVision();
   const tracking = useCameraTracking();
   
   // Get command functions
   const { setCameraPan, setCameraTilt, setCameraNightVision, setCameraTracking } = useMqttCommands();

   const handleNightVisionToggle = () => {
      setCameraNightVision(!nightVision);
   };

   const handleTrackingToggle = () => {
      setCameraTracking(!tracking);
   };

   return (
      <div className="flex flex-col items-center p-4 gap-6 h-full relative">
         <ChamferContainer borderColor='#1A320C' />
         <Label className='text-xl text-red-500 tracking-wider'>CAMERA CONTROL</Label>

         <div className="flex flex-col gap-3 w-full">
            <HorizontalSlider
               value={pan}
               onChange={setCameraPan}
               label="PAN"
               max={180}
            />
            <HorizontalSlider
               value={tilt}
               onChange={setCameraTilt}
               label="TILT"
               max={180}
            />
         </div>

         <div className="flex flex-col gap-4 w-full">
            <ControlButton
               text="NIGHT VISION"
               className='w-full h-14'
               active={nightVision}
               onClick={handleNightVisionToggle}
               icon='vision'
               iconSize={32}
            />

            <ControlButton
               text="TRACKING"
               className='w-full h-14'
               active={tracking}
               onClick={handleTrackingToggle}
               icon=''
            />
         </div>
      </div>
   );
};

export default CameraControl;