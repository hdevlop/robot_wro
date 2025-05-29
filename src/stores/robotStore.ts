import { create } from 'zustand'
import { devtools } from 'zustand/middleware';
import createSelectors from './selectors';

interface SensorData {
    temperature: number|string;
    humidity: number|string;
    co: number|string;
    airQuality: number|string;
}

interface GpsData {
    latitude: number|string;
    longitude: number|string;
}

interface BatteryData {
    level: number|string;
    charging: boolean;
}

type MoveDirection = 'MOVE_FORWARD' | 'MOVE_BACKWARD' | 'MOVE_LEFT' | 'MOVE_RIGHT' | 'MOVE_STOP' | null;

interface RobotState {
    // State
    sensors: SensorData;
    gps: GpsData;
    battery: BatteryData;
    isBrokerConnected: boolean;
    isRobotConnected: boolean;
    mode: string
    speed: number;
    flashlight: boolean
    gripper: string

    moveDirection: MoveDirection;
    pan: number;
    tilt: number;
    nightVision: boolean;
    tracking: boolean;
    terminalMessages: string[];
    // Actions
    setSensors: (sensors: SensorData) => void;
    setGps: (gps: GpsData) => void;
    setBattery: (battery: BatteryData) => void;
    setIsBrokerConnected: (connected: boolean) => void;
    setIsRobotConnected: (connected: boolean) => void;
    setMode: (mode: string) => void;
    setSpeed: (speed: number) => void;
    setFlashlight: (state: boolean) => void;
    setGripper: (state: string) => void;
    setMoveDir: (direction: MoveDirection) => void;
    setCameraPan: (pan: number) => void;
    setCameraTilt: (tilt: number) => void;
    setCameraNightVision: (nightVision: boolean) => void;
    setCameraTracking: (tracking: boolean) => void;
    addToTerminal: (message: any) => void;
    clearTerminal: () => void;
}

const robotStore = create<RobotState>()(
    devtools((set, get) => ({
        sensors: {
            temperature: "0",
            humidity: "0",
            co: "0",
            airQuality: "0"
        },

        gps: {
            latitude: "0",
            longitude: "0"
        },

        battery: {
            level: 0,
            charging: false
        },

        isBrokerConnected: false,
        isRobotConnected: false,
        mode: 'MANUAL',
        speed: 99,
        flashlight: false,
        gripper: 'GRIPPER_OPEN',
        moveDirection: 'MOVE_STOP',

        pan: 90,
        tilt: 90,
        nightVision: false,
        tracking: false,
        terminalMessages: [],

        setSensors: (sensors) => set({ sensors }),
        setGps: (gps) => set({ gps }),
        setBattery: (battery) => set({ battery }),
        setIsBrokerConnected: (connected) => set({ isBrokerConnected: connected }),
        setIsRobotConnected: (connected) => set({ isRobotConnected: connected }),
        setMode: (mode) => set({ mode }),
        setSpeed: (speed) => set({ speed }),
        setFlashlight: (flashlight) => set({ flashlight }),
        setGripper: (gripper) => set({ gripper }),
        setMoveDir: (moveDirection) => set({ moveDirection }),
        setCameraPan: (pan) => set({ pan }),
        setCameraTilt: (tilt) => set({ tilt }),
        setCameraNightVision: (nightVision) => set({ nightVision }),
        setCameraTracking: (tracking) => set({ tracking }),

        addToTerminal: (message) => set((state) => ({
            terminalMessages: [
                ...state.terminalMessages.slice(-99), // Keep last 100
                JSON.stringify(message)
            ]
        })),

        clearTerminal: () => set({ terminalMessages: [] }),

    }))
);

export const useRobotStore = createSelectors(robotStore);

// Custom hooks for specific data
export const useSensors = () => useRobotStore.use.sensors();
export const useGps = () => useRobotStore.use.gps();
export const useBattery = () => useRobotStore.use.battery();
export const useIsBrokerConnected = () => useRobotStore.use.isBrokerConnected();
export const useIsRobotConnected = () => useRobotStore.use.isRobotConnected();
export const useMode = () => useRobotStore.use.mode();
export const useSpeed = () => useRobotStore.use.speed();
export const useFlashlight = () => useRobotStore.use.flashlight();
export const useGripper = () => useRobotStore.use.gripper();
export const useMoveDirection = () => useRobotStore.use.moveDirection();
export const useCameraPan = () => useRobotStore.use.pan();
export const useCameraTilt = () => useRobotStore.use.tilt();
export const useCameraNightVision = () => useRobotStore.use.nightVision();
export const useCameraTracking = () => useRobotStore.use.tracking();