'use client'
import React, { useState } from 'react'
import { ControlButton } from './ControlButton'
import { useMqttCommands } from '@/hooks/useMqttCommands';
import { useMoveDirection } from '@/stores/robotStore';

const MidleControl = () => {
    const moveDirection = useMoveDirection();
    const { moveForward, moveBackward, moveLeft, moveRight, stop } = useMqttCommands();

    return (
        <div className="grid grid-cols-3 grid-rows-3 mx-auto relative w-[300px] h-[300px]">
            <img src="/buttonsControlContainer.png" alt="" className='absolute top-0 right-0 w-full h-full' />

            <div></div>
            <ControlButton
                icon="fe:arrow-up"
                active={moveDirection === 'MOVE_FORWARD'}
                onMouseDown={moveForward}
                onMouseUp={stop}
            />
            <div></div>

            <ControlButton
                icon="fe:arrow-left"
                active={moveDirection === 'MOVE_LEFT'}
                onMouseDown={moveLeft}
                onMouseUp={stop}
            />
            <ControlButton
                text="STOP"
                active={moveDirection === 'MOVE_STOP'}
                onClick={stop}
            />
            <ControlButton
                icon="fe:arrow-right"
                active={moveDirection === 'MOVE_RIGHT'}
                onMouseDown={moveRight}
                onMouseUp={stop}
            />

            <div></div>
            <ControlButton
                icon="fe:arrow-down"
                active={moveDirection === 'MOVE_BACKWARD'}
                onMouseDown={moveBackward}
                onMouseUp={stop}
            />
            <div></div>
        </div>
    )
}

export default MidleControl