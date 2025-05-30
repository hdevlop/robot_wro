import React from 'react'
import MidleControl from './MidleControl'
import { Label } from '../ui/label'
import LeftController from './LeftController'
import FooterController from './FooterControl'
import { ChamferContainer } from '../ChamferContainer'
import SpeedControl from './SpeedControl'

const ControlButtons = () => {
   return (
      <div className='flex flex-col flex-1 justify-between p-2 px-4 lg:p-4 items-center relative'>
         <ChamferContainer chamfer={28}/>
         <Label className='text-2xl lg:text-4xl'>ROBOT CONTROL</Label>
         <div className='flex w-full h-full justify-center items-center'>
            <LeftController />
            <MidleControl />
            <SpeedControl/>
         </div>
         <FooterController />
      </div>
   )
}

export default ControlButtons