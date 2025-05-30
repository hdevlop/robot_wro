import React from 'react'
import BatteryStatus from './BatteryStatus'
import { ChamferContainer } from '../ChamferContainer'
import GpsPosition from './GpsPosition'
import CameraControl from './CameraControl'
import SimpleTerminal from '../SimpleTerminal'
import StatusIndicator from './StatusIndicator'
import AnalysisButton from '../AiAnalysis/AnlysisButton'

const RightControl = () => {
  return (
    <div className='flex flex-col flex-1 w-72 max-w-72 relative p-4 gap-4'>
        <ChamferContainer chamfer={28}/>
        <StatusIndicator/>
        <BatteryStatus/>
        <GpsPosition/>
        <CameraControl/>
        <AnalysisButton/>
        {/* <SimpleTerminal/> */}
    </div>
  )
}

export default RightControl