'use client'

import { useRobotStore } from '@/stores/robotStore'
import { usePublish } from 'await-mqtt/client'

const COMMANDS_TOPIC = 'arduino/commands'

export const useMqttCommands = () => {
    const { sendMessage } = usePublish();
    const {
        setMode,
        setSpeed,
        setFlashlight,
        setGripper,
        setMoveDir,
        setCameraPan,
        setCameraTilt,
        setCameraNightVision,
        setCameraTracking } = useRobotStore();

    const sendCmd = (cmd: string, value: any = null) => {
        const payload = value !== null ? { cmd, value } : { cmd }
        const jsonString = JSON.stringify(payload) + '\n'
        console.log('Sending MQTT command:', payload)
        sendMessage(COMMANDS_TOPIC, jsonString)
    }

    return {
        // Mode
        setManual: () => {
            setMode('MANUAL')
            sendCmd('MANUAL')
        },
        setAuto: () => {
            setMode('AUTO')
            sendCmd('AUTO')
        },

        // Movement
        moveForward: () => {
            setMoveDir('MOVE_FORWARD')
            sendCmd('MOVE_FORWARD')
        },
        moveBackward: () => {
            setMoveDir('MOVE_BACKWARD')
            sendCmd('MOVE_BACKWARD')
        },
        moveLeft: () => {
            setMoveDir('MOVE_LEFT')
            sendCmd('MOVE_LEFT')
        },
        moveRight: () => {
            setMoveDir('MOVE_RIGHT')
            sendCmd('MOVE_RIGHT')
        },
        stop: () => {
            setMoveDir('MOVE_STOP')
            sendCmd('MOVE_STOP')
        },

        // Speed (0-100)
        setSpeed: (speed: number) => {
            setSpeed(speed)
            sendCmd('SPEED', speed)
        },

        flashlightOn: () => {
            setFlashlight(true)
            sendCmd('FLASHLIGHT_ON')
        },
        flashlightOff: () => {
            setFlashlight(false)
            sendCmd('FLASHLIGHT_OFF')
        },

        // Gripper
        gripperOpen: () => {
            setGripper('GRIPPER_OPEN')
            sendCmd('GRIPPER_OPEN')
        },
        gripperClose: () => {
            setGripper('GRIPPER_CLOSE')
            sendCmd('GRIPPER_CLOSE')
        },

        // Camera Controls
        setCameraPan: (pan) => {
            setCameraPan(pan)
            sendCmd('PAN', pan)
        },
        setCameraTilt: (tilt) => {
            setCameraTilt(tilt)
            sendCmd('TILT', tilt)
        },
        setCameraNightVision: (enabled) => {
            setCameraNightVision(enabled)
            sendCmd(enabled ? 'NIGHT_VISION_ON' : 'NIGHT_VISION_OFF')
        },
        setCameraTracking: (enabled) => {
            setCameraTracking(enabled)
            sendCmd(enabled ? 'TRACKING_ON' : 'TRACKING_OFF')
        },

        // Raw command (for custom commands)
        send: sendCmd
    }
}