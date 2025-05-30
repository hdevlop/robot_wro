import React from 'react'
import { ControlButton } from '../ControlButtons/ControlButton'
import { useRobotStore } from '@/stores/robotStore';

const AnalysisButton = () => {
    const { openAnalysisDialog, criticalAlarm } = useRobotStore();

    const handleAnalysisClick = () => {
        openAnalysisDialog();
    };

    return (
        <ControlButton
            text={criticalAlarm ? "URGENT AI" : "AI ANALYSIS"}
            className={`w-full h-12 ${criticalAlarm ? 'animate-pulse' : ''}`}
            onClick={handleAnalysisClick}
            icon='cpu'
            iconSize={32}
            active={true} 
        />
    )
}

export default AnalysisButton