"use client";
import React, { useEffect, useState } from 'react';
import { ollamaService, type AirQualityAnalysis, type SensorData } from '@/services/ollamaService';

const qualityColors = {
  excellent: '#00ff00',
  good: '#90EE90',
  moderate: '#FFD700',
  poor: '#FFA500',
  hazardous: '#FF0000'
};

const AirQualityAnalysis: React.FC = () => {
  const [analysis, setAnalysis] = useState<AirQualityAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simuler des données de capteurs pour le test
  const mockSensorData: SensorData = {
    temperature: 22,
    humidity: 45,
    co2: 800,
  };

  useEffect(() => {
    const analyzeData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await ollamaService.analyzeAirQuality(mockSensorData);
        setAnalysis(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    analyzeData();
    // Mettre à jour l'analyse toutes les 5 minutes
    const interval = setInterval(analyzeData, 1 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black/80 rounded-lg p-6 border border-red-500/50">
        <div className="text-red-500 animate-pulse">Analyse en cours...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black/80 rounded-lg p-6 border border-red-500/50">
        <div className="text-red-500">Erreur: {error}</div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="w-full h-full bg-black/80 rounded-lg p-6 border border-red-500/50 shadow-lg shadow-red-500/20">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Qualité de l'Air</h2>
          <div 
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{ 
              backgroundColor: `${qualityColors[analysis.quality]}20`,
              color: qualityColors[analysis.quality],
              border: `1px solid ${qualityColors[analysis.quality]}40`
            }}
          >
            {analysis.quality.toUpperCase()}
          </div>
        </div>

        <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full transition-all duration-500"
            style={{ 
              width: `${analysis.score}%`,
              backgroundColor: qualityColors[analysis.quality]
            }}
          />
        </div>

        <div className="text-gray-300 space-y-2">
          <p className="text-sm">{analysis.description}</p>
          
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-red-400 mb-2">Recommandations :</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="text-gray-400">{rec}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-4">
          Dernière mise à jour : {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default AirQualityAnalysis; 