'use client'

import React from 'react'
import { ControlButton } from './ControlButton'
import { useMqttCommands } from '@/hooks/useMqttCommands'
import { useMode } from '@/stores/robotStore'


const FooterController = () => {
    const { setManual, setAuto } = useMqttCommands();
    const currentMode = useMode();

    return (
        <div className="flex gap-8 justify-center items-center w-full h-[100px]">
            <ControlButton
                text="MANUAL"
                active={currentMode === 'MANUAL'}
                onClick={() => setManual()}
                className='w-52 h-16'
            />
            <ControlButton
                text="AUTONOMOUS"
                active={currentMode === 'AUTO'}
                onClick={() => setAuto()}
                className='w-52 h-16'
            />
        </div>
    )
}

export default FooterController