'use client'

import React from 'react'
import { useRobotStore } from '@/stores/robotStore'
import { Label } from '../ui/label'
import { ChamferContainer } from '../ChamferContainer'

const StatusIndicator = () => {
   const isRobotConnected = useRobotStore.use.isRobotConnected()
   const isBrokerConnected = useRobotStore.use.isBrokerConnected()

   return (
      <div className="flex flex-col items-center justify-between relative p-3">
         <ChamferContainer borderColor='#1A320C' />
         <Label className='text-xl'>Robot Status</Label>

         <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
               <div className={`w-3 h-3 rounded-full ${isRobotConnected
                     ? 'bg-green-400 shadow-green-400/50 shadow-md animate-pulse'
                     : 'bg-red-400 shadow-red-400/50 shadow-md'
                  }`} />
               <span className="text-xs text-gray-400">Robot</span>
            </div>

            <div className="flex items-center gap-2">
               <div className={`w-3 h-3 rounded-full ${isBrokerConnected
                     ? 'bg-blue-400 shadow-blue-400/50 shadow-md animate-pulse'
                     : 'bg-red-400 shadow-red-400/50 shadow-md'
                  }`} />
               <span className="text-xs text-gray-400">MQTT</span>
            </div>
         </div>
      </div>
   )
}

export default StatusIndicator