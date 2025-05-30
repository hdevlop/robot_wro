import { create } from 'zustand'
import { devtools } from 'zustand/middleware';
import createSelectors from './selectors';

interface SensorData {
    temperature: number | string;
    humidity: number | string;
    co: number | string;
    airQuality: number | string;
}

interface GpsData {
    latitude: number | string;
    longitude: number | string;
}

interface BatteryData {
    level: number | string;
    charging: boolean;
}

type AnalysisType = 'current' | 'emergency' | 'trend' | 'historical';

interface AIAnalysisState {
    isDialogOpen: boolean;
    isAnalyzing: boolean;
    analysisResult: string;
    analysisType: AnalysisType | null;
    lastAnalysisTime: number | null;
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
    criticalAlarm: boolean;
    lastAlarmMessage: string;
    lastAlarmTime: number | null;

    aiAnalysis: AIAnalysisState;

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
    setCriticalAlarm: (critical: boolean) => void;
    clearAlarm: () => void;

    // AI Analysis Actions
    openAnalysisDialog: () => void;
    closeAnalysisDialog: () => void;
    setIsAnalyzing: (analyzing: boolean) => void;
    setAnalysisResult: (result: string, type: AnalysisType) => void;
    clearAnalysisResult: () => void;
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

        // Alarm state
        criticalAlarm: false,
        lastAlarmMessage: '',
        lastAlarmTime: null,

        aiAnalysis: {
            isDialogOpen: false,
            isAnalyzing: false,
            analysisResult: '',
            analysisType: null,
            lastAnalysisTime: null
        },

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

        setCriticalAlarm: (critical) => set({ criticalAlarm: critical }),
        clearAlarm: () => set({ criticalAlarm: false }),

                // AI Analysis actions
        openAnalysisDialog: () => set((state) => ({
            aiAnalysis: { ...state.aiAnalysis, isDialogOpen: true }
        })),

        closeAnalysisDialog: () => set((state) => ({
            aiAnalysis: { ...state.aiAnalysis, isDialogOpen: false }
        })),

        setIsAnalyzing: (analyzing) => set((state) => ({
            aiAnalysis: { ...state.aiAnalysis, isAnalyzing: analyzing }
        })),

        setAnalysisResult: (result, type) => set((state) => ({
            aiAnalysis: {
                ...state.aiAnalysis,
                analysisResult: result,
                analysisType: type,
                lastAnalysisTime: Date.now(),
                isAnalyzing: false
            }
        })),

        clearAnalysisResult: () => set((state) => ({
            aiAnalysis: {
                ...state.aiAnalysis,
                analysisResult: '',
                analysisType: null
            }
        })),

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
export const useCriticalAlarm = () => useRobotStore.use.criticalAlarm();

// AI Analysis hooks
export const useAIAnalysis = () => useRobotStore.use.aiAnalysis();
export const useAnalysisDialog = () => useRobotStore.use.aiAnalysis().isDialogOpen;
export const useIsAnalyzing = () => useRobotStore.use.aiAnalysis().isAnalyzing;