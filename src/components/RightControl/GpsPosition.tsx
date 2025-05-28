import React from 'react'
import { Label } from '../ui/label'
import NIcon from '../NIcon'
import { ChamferContainer } from '../ChamferContainer'
import { useGps } from '@/stores/robotStore'

const GpsPosition = () => {

  const gps = useGps();
  
  return (
    <div className='flex flex-col w-full justify-center items-center relative p-2 gap-2'>
      <ChamferContainer borderColor='#1A320C' />
      <Label className='text-2xl'>GPS POSITION</Label>
      <div className='flex justify-center items-center w-16 h-11'>
        <NIcon icon='GPS' size={52} />
      </div>
      <div className='flex flex-col '>

      <Label className='text-xl'>{gps.latitude}</Label>
        <Label className='text-xl'>{gps.longitude}</Label>
      </div>
    </div>
  )
}

export default GpsPosition