import React from 'react'
import BatteryStatus from './BatteryStatus'
import { ChamferContainer } from '../ChamferContainer'
import GpsPosition from './GpsPosition'
import CameraControl from './CameraControl'
import SimpleTerminal from '../SimpleTerminal'
import StatusIndicator from './StatusIndicator'

const RightControl = () => {
  return (
    <div className='flex flex-col h-full w-72 max-w-72 relative p-4 gap-4'>
        <ChamferContainer chamfer={28}/>
        <StatusIndicator/>
        <BatteryStatus/>
        <GpsPosition/>
        <CameraControl/>
        {/* <SimpleTerminal/> */}
    </div>
  )
}

export default RightControl