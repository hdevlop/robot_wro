import Icon from '@/components/NIcon';
import { Label } from '@/components/ui/label';
import React from 'react';
import { ChamferContainer } from '../ChamferContainer';

export type SensorWidgetProps = {
   title: string,
   icon: string,
   value: string | number | any,
   units: string
}

const SensorWidget: React.FC<SensorWidgetProps> = ({ title, icon, value = 0, units }) => {
   return (
      <div className='relative flex flex-col p-4 gap-4 red-glow-text justify-center items-center max-w-56 w-[150px] h-[150px]  lg:w-[180px] lg:h-[180px] rounded-3xl'>
         <ChamferContainer chamfer={28} />
         <Icon icon={icon} size={54} className='w-12 min-w-12 min-h-12 lg:w-14 lg:min-w-14 lg:min-h-14' />

         <div className='flex gap-1 '>
            <Label className='text-4xl lg:text-5xl '>{value}</Label>
            <Label className='text-2xl lg:text-4xl '>{units}</Label>
         </div>
         <Label className='text-md ' >{title}</Label>

      </div>
   )
}

export default SensorWidget