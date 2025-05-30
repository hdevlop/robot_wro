
import React from 'react'
import NIcon from '../NIcon'
import { useRobotStore } from '@/stores/robotStore';

const AnalysisButton = () => {
    const { openAnalysisDialog, criticalAlarm } = useRobotStore();

    const handleAnalysisClick = () => {
        openAnalysisDialog();
    };

    return (
        <button
            onClick={handleAnalysisClick}
            className={`
                fixed top-2 right-0 z-50
                w-16 h-16 
                bg-gray-900/90 hover:bg-gray-800 
                border-2 border-red-500 
                rounded-full 
                flex items-center justify-center
                transition-all duration-200
                hover:scale-110 hover:shadow-lg hover:shadow-red-500/20
                backdrop-blur-sm
                ${criticalAlarm ? 'animate-pulse shadow-lg shadow-red-500/40' : ''}
            `}
        >
            <NIcon icon="AI" size={32} color="#ef4444" />
        </button>
    )
}

export default AnalysisButton