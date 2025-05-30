import React from 'react'
import { Label } from '../ui/label'
import NIcon from '../NIcon'
import { ChamferContainer } from '../ChamferContainer'
import { useGps, useRobotStore } from '@/stores/robotStore'

const GpsPosition = () => {
  const gps = useGps();
  const openRadarDialog = useRobotStore.use.openRadarDialog();

  const handleClick = () => {
    openRadarDialog();
  };

  return (
    <div 
      className='flex flex-col w-full justify-center items-center relative p-2 gap-2 cursor-pointer hover:bg-gray-800/50 transition-colors duration-200 rounded-lg'
      onClick={handleClick}
    >
      <ChamferContainer borderColor='#1A320C' />
      <Label className='text-xl'>GPS POSITION</Label>
      <div className='flex justify-center items-center w-16 h-11'>
        <NIcon icon='GPS' size={44} />
      </div>
      <div className='flex flex-col '>
        <Label className='text-xl'>{gps.latitude}</Label>
        <Label className='text-xl'>{gps.longitude}</Label>
      </div>
    </div>
  )
}

export default GpsPosition