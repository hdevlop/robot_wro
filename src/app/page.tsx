'use client'
import AIAnalysisDialog from '@/components/AiAnalysis';
import { AlarmComponent } from '@/components/AlarmComponent';
import ControlButtons from '@/components/ControlButtons'
import FullscreenDialog from '@/components/FullscreenDialog';
import RadarDialog from '@/components/RadarDisplay';
import RightControl from '@/components/RightControl'
import SensorWidgets from '@/components/SensorWidgets'
import { useMqttSensors } from '@/hooks/useMqttSensors';
import React from 'react'

const Dashboard = () => {

  useMqttSensors();

  return (

    <div className='h-screen w-screen flex gap-4 p-2'>
      <div className='flex flex-1 flex-col h-full gap-4'>
        <SensorWidgets />
        <ControlButtons />
      </div>
      <RightControl />
      <AlarmComponent/>
      <FullscreenDialog/>
      <AIAnalysisDialog/>
      <RadarDialog/>
    </div>

  )
}

export default Dashboard

