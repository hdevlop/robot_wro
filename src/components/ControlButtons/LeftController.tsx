'use client'
import React from 'react'
import { ControlButton } from './ControlButton'
import { useMqttCommands } from '@/hooks/useMqttCommands';
import { useFlashlight, useGripper } from '@/stores/robotStore';

const LeftController = () => {

    const { flashlightOn, flashlightOff, gripperOpen, gripperClose } = useMqttCommands();

    const gripperState = useGripper();
    const flashLight = useFlashlight();

    return (
        <div className="flex flex-col  lg:gap-4 justify-center items-center h-full ">
            <ControlButton
                icon="gripperClosed"
                iconSize={60}
                active={gripperState === 'GRIPPER_CLOSE'}
                onClick={gripperClose}
            />
            <ControlButton
                icon="flashLight"
                iconSize={40}
                className='w-[64px] h-[64px]'
                active={flashLight}
                onClick={() => flashLight ? flashlightOff() : flashlightOn()}
            />
            <ControlButton
                icon="gripperOpen"
                iconSize={60}
                active={gripperState === 'GRIPPER_OPEN'}
                onClick={gripperOpen}
            />
        </div>
    )
}

export default LeftController