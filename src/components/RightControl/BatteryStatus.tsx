import React from 'react'
import { Label } from '../ui/label'
import NIcon from '../NIcon'
import { ChamferContainer } from '../ChamferContainer'
import { useBattery } from '@/stores/robotStore'

const BatteryStatus = () => {

  const battery = useBattery();
  
  return (
    <div className='flex flex-col w-full justify-center items-center relative p-2'>
      <ChamferContainer borderColor='#1A320C' />
      <Label className='text-xl'>BATTERY STATUS</Label>
      <div className='flex justify-center items-center w-16 h-11'>
        <NIcon icon='battery' size={44} />
      </div>
      <Label className='text-xl'>{battery.level}%</Label>
    </div>
  )
}

export default BatteryStatus